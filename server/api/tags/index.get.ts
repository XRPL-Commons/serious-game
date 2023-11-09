import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'

interface filterProjects {
  visible?: boolean,
  tags?: any,
  status?: any,
  grants?: any
}
interface queryObject {
  tags?: string,
  status?: string,
  grants?: string
}
export default defineEventHandler(async () => {
  console.log('listing tags...')

  const Projects = await ProjectsCollection()
  const result = await Projects.find({}, { projection: { tags: 1 } }).toArray()
  const report = result.map((r) => r.tags).flat().filter((t: string) => t !== '')
    .filter((item, index, self) => self.indexOf(item) === index)
    .filter((item) => item !== undefined)
    .sort((a, b) => a.localeCompare(b))

  console.log(report)
  return report
})
