import { LoginUser, User } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  console.log('coucou')
  const { email, password } = await readBody(event)
  console.log({ email, password })
  const result = await LoginUser({ email, password })
  if (result) {
    return true
  } else {
    return false
  }
  //return AddUser(userInfo)
})