import { GetObjects } from '~/server/connectors/mongo'

const listArt = async (xrplAddress?: string, hallOfFame = true) => {
  // list existing art
  let arts = await GetObjects(xrplAddress);
  return arts;  
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  return listArt(query.xrplAddress, true)
})
