import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  console.log('listing projects...')
  const Projects = await ProjectsCollection()
  const result = await Projects.find().toArray();
  return result
})
