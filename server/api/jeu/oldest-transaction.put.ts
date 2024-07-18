import { defineEventHandler, createError, readBody } from 'h3';
import { Client } from 'xrpl';
import { GetClassroomStudents, UpdateStudentOldestTransaction } from '~/server/connectors/mongo';

const getOldestTransaction = async (soluce_account: string, personal_account: string) => {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  const request = {
    command: 'account_tx',
    account: soluce_account,
    ledger_index_min: -1,
    ledger_index_max: -1,
    limit: 100,
  }

  const response = await client.request(request);
  await client.disconnect();

  const transactions = response.result.transactions.filter(tx => tx.tx.Account === personal_account);
  const oldestTransaction = transactions.reduce((oldest, tx) => {
    return !oldest || tx.tx.date < oldest.tx.date ? tx : oldest;
  }, null);

  console.log("Je suis dans oldest-transaction.put.ts qui retourne :", oldestTransaction);
  return oldestTransaction ? oldestTransaction.tx.date : null;
};

export default defineEventHandler(async (event) => {
  try {
    const { classroomName } = await readBody(event);
    const students = await GetClassroomStudents(classroomName);

    if (!students) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Classroom not found'
      });
    }

    for (const student of students) {
      if (student.account && student.solution_account) {
        const oldestTransactionDate = await getOldestTransaction(student.solution_account.classicAddress, student.account.classicAddress);
        if (oldestTransactionDate) {
          await UpdateStudentOldestTransaction(student.email, oldestTransactionDate);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating oldest transactions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update oldest transactions'
    });
  }
});
