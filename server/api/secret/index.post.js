
const checkSecret = async ({ secret }) => {
  console.log(secret, process.env.MAG_SECRET, secret === process.env.MAG_SECRET)
  return secret === process.env.MAG_SECRET
}

export default defineEventHandler(async (event) => {
  console.log('checkSecret')
  const body = await readBody(event)
  console.log(body, process.env.MAG_SECRET)
  const secret = body.secret
  console.log({ secret })
  if (!secret) {
    throw new createError(
      { statusCode: 401, statusMessage: 'Please provide the secret' })
  }
  return checkSecret({ secret })
})
