
export const checkSecret = async ({ secret }) => {
  return secret === process.env.MAG_SECRET
}

export default defineEventHandler(async (event) => {
  console.log('checkSecret')
  const body = await readBody(event)
  const secret = body.secret
  if (!secret) {
    throw new createError(
      { statusCode: 401, statusMessage: 'Please provide the secret' })
  }
  return checkSecret({ secret })
})
