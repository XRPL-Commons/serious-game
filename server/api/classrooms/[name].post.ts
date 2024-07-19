import { AddStudentToClassroom } from '~/server/connectors/mongo';

export default defineEventHandler(async (event) => {
    try {
    const { name : classroomName } = getRouterParams(event)
    const userInfo = event.context.user;
    if (!userInfo || !['admin', 'teacher'].includes(userInfo.role)) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
        })
      }
    const { name, email } = await readBody(event);
    const student = {
        name,
        email,
        rank: undefined, 
        account: undefined, 
        solution_account: undefined, 
      };
    await AddStudentToClassroom(classroomName, student);
    } catch (error) {
      console.error('Error adding student to classroom:', error);
    }
});
      
