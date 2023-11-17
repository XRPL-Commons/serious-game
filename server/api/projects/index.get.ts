import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'
import { useAuth } from '~/lib/auth'

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
  if (query?.tags && query.tags !== 'all') {
    filter.tags = { $in: query.tags.split(',') }
  }
  if (query?.status && query.status !== 'all') {
    filter.status = { $in: query.status.split(',') }
  }
  if (query?.grants && query.grants !== 'all') {
    filter.grants = { $in: query.grants.split(',') }
  }
  if (query?.visible === 'all' && auth.isContributor) {
    // only authenticated users can see hidden items
    filter.visible = true
  }

  const Projects = await ProjectsCollection()
  const result = await Projects.find(filter).toArray()
  //console.log(result)
  return result
})
