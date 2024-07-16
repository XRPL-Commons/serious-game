import { GetClassroomStudents} from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
    const { name } = getRouterParams(event)
    console.log("mon name est", name, "fin du name")

    const userInfo = event.context.user;
  
    if (!userInfo || !['admin', 'teacher'].includes(userInfo.role)) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Unauthorized',
        })
      }
  
    const students = await GetClassroomStudents(name);
  
    if (!students) {
      console.error('Error getting students:');
    }
  
    return students;
  });

