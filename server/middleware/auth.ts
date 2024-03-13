// User roles:
//    - reader (no credentials)
//    - contributor (can propose new projects and edits to existing projects)
//       x owner (can edit a specific project)
//    - admin (can approve changes from contributors)


// import { useRateLimit } from 'rate-limiter-flexible';

// // Define rate limiting rules
// const rateLimiter = new useRateLimit({
//   store: 'memory', // In-memory storage
//   points: 5, // Number of points
//   duration: 1, // Per second(s)
// });

// // Middleware to check rate limit
// const rateLimitMiddleware = async (event) => {
//   try {
//     // Consume 1 point for each request from the same IP
//     await rateLimiter.consume(event.context.ip);
//   } catch (rateLimiterRes) {
//     // Not enough points to consume, add headers and throw error
//     event.res.setHeader('Retry-After', String(Math.round(rateLimiterRes.msBeforeNext / 1000)) || 1);
//     event.res.statusCode = 429;
//     throw new Error('Too Many Requests');
//   }
// };

// // Apply rate limiting to admin routes
// if (event.req.url.startsWith('/admin')) {
//   await rateLimitMiddleware(event);
// }

import { GetCollection } from '@/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const authHeader = event.headers.get('Authorization')
  const authToken = authHeader && authHeader.includes('Bearer') && authHeader.replace('Bearer ', '')

  // validate authToken
  if (authToken) {
    try {
      const Tokens = await GetCollection('Tokens')
      const userInfo = await Tokens.findOne({ key: authToken })
      console.log('... auth', authHeader, authToken, userInfo)

      if (userInfo) {
        // this is the money
        event.context.auth = {
          ...userInfo,
          isReader: true,
          isContributor: userInfo.role === 'contributor' || userInfo.role === 'admin',
          isAdmin: userInfo.role === 'admin'
        }
      } else {
        event.context.auth = {
          isReader: true,
          isContributor: false,
          isAdmin: false
        }
      }
    } catch (err) {
      console.error(err)
    }
  } else {
    console.log('no authentication')
  }
})
