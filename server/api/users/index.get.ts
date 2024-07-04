import { ListUsers, User } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  return ListUsers()
})