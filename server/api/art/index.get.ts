import { GetCollection } from '~/server/connectors/mongo'

const listArt = async ({ hallOfFame = true }) => {
  // list existing art

  const Arts = GetCollection("art")
  console.log('Arts', await Arts.find({}).fetch())
  return []
}

export default defineEventHandler((event) => {
  console.log('listArt')
  return listArt({ hallOfFame: true })
})
