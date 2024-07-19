import { defineEventHandler, createError, readBody } from 'h3';
import { Client, Wallet, Payment } from 'xrpl';
import { GetClassroomStudents } from '~/server/connectors/mongo';

export const sendTransaction = async (account: any, solution_account: any) => {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  try {
    await client.connect();

    const wallet = Wallet.fromSeed(account.seed);

    const tx: Payment = {
      TransactionType: "Payment",
      Account: wallet.classicAddress,
      Destination: solution_account.classicAddress,
      Amount: "42"  // 42 drops
    };
    const result = await client.submitAndWait(tx, {
      autofill: true,
      wallet
    });

    await client.disconnect();

    if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
      throw new Error(`Transaction failed: ${result.result.meta.TransactionResult}`);
    }
    return result;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
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
        await sendTransaction(student.account, student.solution_account);
      }
    }
    return { success: true };
  } catch (error) {
    console.error('Error sending transactions:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send transactions'
    });
  }
});
