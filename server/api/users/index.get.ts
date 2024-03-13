
import { GetCollection } from '@/server/connectors/mongo'

const getUserList = async () => {
  const Tokens = await GetCollection('Tokens')
  const users = await Tokens.find({}).project({ name: 1, role: 1, email: 1 }).toArray()
  return users
}

export default defineEventHandler(async (event) => {
  console.log('listing users...')
  const userInfo = event?.context?.auth

  if (!userInfo.isAdmin) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unauthorized',
    })
  }

  const users = await getUserList()
  return users
})
