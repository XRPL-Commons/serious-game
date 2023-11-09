// User roles:
//    - reader (no credentials)
//    - contributor (can propose new projects and edits to existing projects)
//       x owner (can edit a specific project)
//    - admin (can approve changes from contributors)
import { TokensCollection, ObjectId } from '@/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get('Authorization')
  const authToken = authHeader && authHeader.includes('Bearer') && authHeader.replace('Bearer ', '')

  // validate authToken
  if (authToken) {
    try {
      const Tokens = await TokensCollection()
      const userInfo = await Tokens.findOne({ key: authToken })
      console.log('... auth', authHeader, authToken, userInfo)

      if (userInfo) {
        // this is the money
        console.log(userInfo)
        event.context.auth = userInfo
      }
    } catch (err) {
      console.error(err)
    }
  } else {
    console.log('no authentication')
  }
})
