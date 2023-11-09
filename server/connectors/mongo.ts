import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGO_URI || ''
const client = new MongoClient(uri)

export const DB = async () => {
  await client.connect()
  return client.db('map')
}

export const ProjectsCollection = async () => {
  await client.connect()
  return client.db('map').collection('Projects')
}

export const TokensCollection = async () => {
  await client.connect()
  return client.db('map').collection('Tokens')
}

export { ObjectId }

export default {
  DB,
  MongoClient,
  ObjectId,
  ProjectsCollection,
  TokensCollection
}