import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'
import { useAuth } from '@/lib/auth'

interface filterProjects {
  visible?: boolean,
  tags?: any,
  status?: any,
  grants?: any
}
interface queryObject {
  tags?: string,
  status?: string,
  grants?: string,
  visible?: string
}

export default defineEventHandler(async (event) => {
  console.log('listing projects...')
  const query: queryObject = getQuery(event)
  const auth = useAuth(event?.context?.auth)
  const filter: filterProjects = {}
  if (query?.tags && query.tags !== '') {
    filter.tags = { $in: query.tags.split(',') }
  }
  if (query?.status && query.status !== '') {
    filter.status = { $in: query.status.split(',') }
  }
  if (query?.grants && query.grants !== '') {
    filter.grants = { $in: query.grants.split(',') }
  }
  if (query?.visible === '' && auth.isContributor) {
    // only authenticated users can see hidden items
    filter.visible = true
  }

  console.log(filter)

  const Projects = await ProjectsCollection()
  const result = await Projects.find(filter).toArray()
  console.log(result.length)
  return result
})
