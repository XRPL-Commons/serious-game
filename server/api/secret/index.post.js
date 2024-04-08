export default defineEventHandler(async (event) => {
  console.log('checkSecret')
  const runtimeConfig = useRuntimeConfig(event)

  const body = await readBody(event)
  const secret = body.secret
  if (!secret) {
    throw new createError(
      { statusCode: 401, statusMessage: 'Please provide the secret' })
  }
  return (secret === runtimeConfig.mag_secret_1) || (secret === runtimeConfig.mag_secret_2)
})
