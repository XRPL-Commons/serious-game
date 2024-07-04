import { AddUser, User } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const userInfo = await readBody(event)
  return AddUser(userInfo)
})