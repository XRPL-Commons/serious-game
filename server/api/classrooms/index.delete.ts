import { DeleteClassroom, Classroom } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
    
  return DeleteClassroom(body.name)
})