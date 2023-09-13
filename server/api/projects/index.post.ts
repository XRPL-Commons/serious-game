import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'
import { generateSlug } from '@/server/lib/generateSlug'

export default defineEventHandler(async (event) => {
  console.log('creating project...')
  const body = await readBody(event)
  const projectName = body?.projectName

  if (!projectName) {
    throw createError({ statusCode: 400, statusMessage: 'Project name is required' })
  }
  const slug = generateSlug(projectName)
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug should be non empty, please choose another name' })
  }


  try {
    const Projects = await ProjectsCollection()

    // is the slug unique?
    const findRecord = await Projects.findOne({ slug })
    if (findRecord) {
      throw createError({ statusCode: 400, statusMessage: `Slug ${slug} already exists!` })
    }

    // lets set some default to get things going
    const record = {
      name: projectName,
      description: 'Description of the project',
      section: 'Main',
      category: 'New',
      grants: false,
      status: 'Pre-launch',
      visible: false
    }

    // insert
    const result = {
      ...await Projects.insertOne(record),
      slug
    }
    return result
  } catch (e) {
    console.error(e)
    throw createError({ statusCode: 500, statusMessage: 'A server side error occured' })
  }
})
