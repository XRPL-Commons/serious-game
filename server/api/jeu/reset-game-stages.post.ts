import { defineEventHandler, createError, readBody } from 'h3';
import { GetClassroomStudents, ResetStudentGameStages } from '~/server/connectors/mongo';

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

  for (const student of students) {
    await ResetStudentGameStages(student.email);
  }

  return { success: true };
});
