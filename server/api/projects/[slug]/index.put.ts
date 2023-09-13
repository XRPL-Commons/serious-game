import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'
import { generateSlug } from '@/server/lib/generateSlug'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const record = await readBody(event)

  const Projects = await ProjectsCollection()

  // some sanity tests
  record.slug = generateSlug(record.name)
  if (record.slug !== slug) {
    const findRecord = await Projects.findOne({ slug: record.slug })
    if (findRecord) {
      throw createError({ statusCode: 400, statusMessage: `Can't update record: th slug ${record.slug} already exists! Please change the name and try again` })
    }
  }

  console.log({ $set: record })
  const result = await Projects.updateOne({ slug }, { $set: record });
  if (result.matchedCount === 0) return false;
  const recordInfo = await Projects.findOne({ slug }) // Return the updated project
  return recordInfo
})
