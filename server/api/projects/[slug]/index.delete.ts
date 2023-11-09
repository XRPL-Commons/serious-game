import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'
import { useAuth } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  console.log('deleting', slug)

  // requires authentication
  const auth = useAuth(event?.context?.auth)

  if (!auth.isAdmin) {
    throw createError({ statusCode: 401, statusMessage: 'Not authorized' })
  }

  const Projects = await ProjectsCollection()

  try {
    const result = await Projects.deleteOne({ slug })
    console.log('deleted', result)
    return true
  } catch (e) {
    console.error(e)
    throw new Error('An error occured!')
  }
})
