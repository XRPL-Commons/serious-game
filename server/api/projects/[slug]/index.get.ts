import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  console.log('fetching project info')
  const slug = getRouterParam(event, 'slug')
  const Projects = await ProjectsCollection()
  const result = await Projects.findOne({ slug })
  return result || []
})

