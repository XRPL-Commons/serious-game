import { ListUsers, User } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  // if (event?.context?.user?.role !== 'admin') {
  //   // If the user is not an admin, return an unauthorized response
  //   event.node.res.statusCode = 403; // Forbidden
  //   return { message: 'Forbidden' };
  // }
  return ListUsers()
})