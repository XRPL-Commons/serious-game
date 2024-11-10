import { DeleteUserFromClassroom} from '~/server/connectors/mongo'

/**
 * API endpoint to delete a user from a classroom
**/

export default defineEventHandler(async (event) => {

  // Read the request body which should contain the user's email
  const body = await readBody(event)
  try {
  
  // Call the mongo function to delete the user from the classroom
    await DeleteUserFromClassroom(body.email);
} catch (error) {
    console.error('Error deleting user:', error);
  }
    })