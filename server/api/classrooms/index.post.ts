import { AddClassroom } from '~/server/connectors/mongo'

export default defineEventHandler(async (event) => {

  const classroomInfo = await readBody(event) 
  return AddClassroom(classroomInfo) 
})