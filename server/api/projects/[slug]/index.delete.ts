import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  console.log('deleting', slug)

  const Projects = await ProjectsCollection()

  try {
    const result = await Projects.deleteOne({ slug })
    console.log('deleted', result)
    return true
  } catch (e) {
    console.error(e)
    throw new Error('An error occured!')
    return false
  }
})
