import { ListUsers, User , ListUsersTeacher , ListUsersStudent} from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {

  const userInfo = event.context.user

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