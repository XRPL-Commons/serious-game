import { defineEventHandler, createError, readBody } from 'h3';
import { Client, Wallet, xrpToDrops, convertStringToHex } from 'xrpl';
import { GetClassroomStudents } from '~/server/connectors/mongo';

export default defineEventHandler(async (event) => {
  const { classroomName } = await readBody(event);

  if (!classroomName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Classroom name is required'
    });
  }

  const students = await GetClassroomStudents(classroomName);

  if (!students) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Classroom not found'
    });
  }

  const client = new Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  // Create a temporary wallet with funds
  const { wallet: tempWallet } = await client.fundWallet();

  for (const student of students) {
    if (student.account && student.solution_account) {
      const memo = `Send a transaction to your solution account: ${student.solution_account.classicAddress}`;
      const memoHex = convertStringToHex(memo);

      const transaction = {
        TransactionType: "Payment",
        Account: tempWallet.classicAddress,
        Destination: student.account.classicAddress,
        Amount: xrpToDrops("10"), // Amount in drops
        Memos: [
          {
            Memo: {
              MemoData: memoHex
            }
          }
        ]
      };

      try {
        const result = await client.submitAndWait(transaction, { wallet: tempWallet });
        if (result.result.meta.TransactionResult !== 'tesSUCCESS') {
          console.error(`Failed to send transaction for student ${student.email}:`, result.result.meta.TransactionResult);
        } else {
          console.log(`Transaction successful for student ${student.email}:`, result.result.hash);
        }
      } catch (error) {
        console.error(`Failed to send transaction for student ${student.email}:`, error);
      }
    }
  }

  await client.disconnect();

  return { success: true };
});
