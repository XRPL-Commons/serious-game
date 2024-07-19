import { Client } from "xrpl";
import { defineEventHandler, createError, readBody } from 'h3';
import { UpdateStudentAccounts, GetClassroomStudents } from '~/server/connectors/mongo';

export const generateRippleAccounts = async () => {
  const client = new Client("wss://s.altnet.rippletest.net:51233");
  try {
    await client.connect();
    const { wallet: wallet1 } = await client.fundWallet();
    const { wallet: wallet2 } = await client.fundWallet();
    await client.disconnect();
    return {
      account: {
        classicAddress: wallet1.classicAddress,
        seed: wallet1.seed
      },
      solution_account: {
        classicAddress: wallet2.classicAddress,
        seed: wallet2.seed
      }
    };
  } catch (error) {
    console.error('Error generating Ripple accounts:', error);
    throw error;
  }
};
export default defineEventHandler(async (event) => {
  try {
    const { classroomName } = await readBody(event);
    const students = await GetClassroomStudents(classroomName); // Assurez-vous que cette fonction existe pour récupérer les étudiants d'une classe
    for (const student of students) {
      const accounts = await generateRippleAccounts();
      await UpdateStudentAccounts(student.email, accounts.account, accounts.solution_account);
    }
    return { success: true };
  } catch (error) {
    console.error('Error generating and updating Ripple accounts:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate and update Ripple accounts',
    });
  }
});
