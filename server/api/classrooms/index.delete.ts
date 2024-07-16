import { DeleteClassroom } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
    
  console.log("La classe suivante va etre supprime", body.name)
    
  return DeleteClassroom(body.name)
})