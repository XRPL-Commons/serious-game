import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGO_URI || ''
const client = new MongoClient(uri)

export const DB = async () => {
  await client.connect()
  return client.db('albers')
}

export const GetCollection = async (collectionName: string) => {
  await client.connect()
  return client.db('map').collection(collectionName)
}

export { ObjectId }

export default {
  DB,
  MongoClient,
  ObjectId,
  GetCollection
}