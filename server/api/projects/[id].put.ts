import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')
  const body = await readBody(event)

  await client.connect();
  const collection = client.db('map').collection('Projects');

  console.log({ $set: body })
  const result = await collection.updateOne({ _id: new ObjectId(projectId) }, { $set: body });
  if (result.matchedCount === 0) return false;
  const record = await collection.findOne({ _id: new ObjectId(projectId) }) // Return the updated project
  return record
})
