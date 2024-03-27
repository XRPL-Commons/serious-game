// makes sure the secret is set when a route needs it

export default defineEventHandler(async (event) => {
  const secret = event.headers.get('x-secret')
  if (secret === 'community') {
    event.context.secretIsKnown = true
  }
})
