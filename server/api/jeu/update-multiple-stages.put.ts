import { defineEventHandler, createError, readBody } from 'h3';
import { Client } from 'xrpl';
import { GetClassroomStudents, UpdateStudentGameStages } from '~/server/connectors/mongo';

const generateGameStages = async (client: Client, n: number) => {
  const stages = [];
  for (let i = 1; i <= n; i++) {
    const { wallet } = await client.fundWallet();
    stages.push({
      stage: i,
      solutionAccount: wallet.classicAddress,
      status: 'not_started',
    });
  }
  return stages;
};

export default defineEventHandler(async (event) => {
  const { classroomName, numStages } = await readBody(event);

  if (!classroomName || !numStages) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Classroom name and number of stages are required',
    });
  }

  const students = await GetClassroomStudents(classroomName);

  if (!students) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Classroom not found',
    });
  }

  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  for (const student of students) {
    if (student.account) {
      const gameStages = await generateGameStages(client, numStages);
      await UpdateStudentGameStages(student.email, gameStages);
    }
  }

  await client.disconnect();

  return { success: true };
});
