import { DeleteUserFromClassroom} from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    await DeleteUserFromClassroom(body.email);
} catch (error) {
    console.error('Error deleting user:', error);
  }
    })