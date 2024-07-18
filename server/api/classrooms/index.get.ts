import { ListClassrooms, Classroom } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const userInfo = event.context.user

  if (!userInfo || !['admin', 'teacher'].includes(userInfo.role)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
// ICI VERIF POUR AFFICHER UNIQUELMENT MES CLASSROOMS OU TOUTES LES CLASSROOMS SI JE SUIS ADMIN

  if (userInfo.role === 'admin') {
    return ListClassrooms()
  } else if (userInfo.role === 'teacher') {
    return ListClassrooms(userInfo.email as string)
  }
})