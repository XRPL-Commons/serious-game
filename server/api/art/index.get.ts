import { GetObjects } from '~/server/connectors/mongo'

const listArt = async ({ xrplAddress, hallOfFame }: { xrplAddress: string, hallOfFame: boolean }) => {
  // list existing art
  let arts = await GetObjects(xrplAddress);
  return arts;
}

export default defineEventHandler(async (event) => {
  try {
    const { xrplAddress }: { xrplAddress: any } = getQuery(event)
    return listArt({ xrplAddress, hallOfFame: true })
  } catch (e) {
    throw createError({
      status: 500,
      statusMessage: 'Unable to fetch art'
    })
  }
})
