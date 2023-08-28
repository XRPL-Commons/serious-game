import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')

  await client.connect();
  const collection = client.db('map').collection('Projects');
  const result = await collection.findOne({ _id: new ObjectId(projectId) });
  return result || []
})

