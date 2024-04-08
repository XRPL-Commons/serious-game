import { GetObjects } from '~/server/connectors/mongo'

const listArt = async ({ xrplAddress, network }: { xrplAddress: string, network: string }) => {
  console.log('listArt', network)
  // list existing art
  let arts = await GetObjects({ xrplAddress, network });
  return arts;
}

export default defineEventHandler(async (event) => {
  try {
    const { xrplAddress, network }: { xrplAddress: any, network: string } = getQuery(event)
    return listArt({ xrplAddress, network })
  } catch (e) {
    throw createError({
      status: 500,
      statusMessage: 'Unable to fetch art'
    })
  }
})
