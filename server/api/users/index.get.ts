import { ListUsers, User , ListUsersTeacher , ListUsersStudent} from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  console.log(event.context.user)

  const userInfo = event.context.user
  console.log("mon event est", event.context.user, "fin du event")

  // if (!userInfo || !['admin', 'teacher'].includes(userInfo.role)) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'Unauthorized',
  //   })
  // }  
  if (userInfo.role === 'admin') {
    return ListUsers()
  } else if (userInfo.role === 'teacher') {
    return ListUsersTeacher(userInfo.email as string)
  }
  else if (userInfo.role === 'student') {
    return ListUsersStudent(userInfo.email as string);
    }

  return ListUsers()
})