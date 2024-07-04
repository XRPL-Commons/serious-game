import { DeleteUser, User } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // const { email } = await readBody(event)
  return DeleteUser(body.email)
})