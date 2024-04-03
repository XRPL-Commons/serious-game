import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGO_URI || ''
const collectionName = 'nfts'
const client = new MongoClient(uri)

export const DB = async () => {
  await client.connect()
  return client.db('albers')
}

// Define an interface for the NFT data
export interface NFT {
  xrplAddress: string;
  owner: string;
  uri: string;
  nftId: string;
  nftOfferId: string; 
  mintedAt: string; 
}

export const GetCollection = async (collectionName: string) => {
  await client.connect()
  return client.db('map').collection(collectionName)
}

export const AddObject = async (nftObject: NFT) => {
  try {
    await client.connect();
    const collection = client.db('albers').collection(collectionName);
    const result = await collection.insertOne({ nftObject });
    console.log(`New NFT inserted with id: ${result.insertedId}`);
    return result;
  } catch (error) {
    console.error('Error inserting NFT:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    await client.close(); // Consider when to close the connection based on your app's use case
  }
}

export const UpdateObject = async (nftId: string, nftObject: NFT) => {
  try {
    await client.connect();
    const collection = client.db('albers').collection('nfts');
    const result = await collection.updateOne(
      { nftId: nftId }, // Filter: Find a document with the matching nftId
      { $set: { nftOfferId: nftObject.nftOfferId } } // Update operation: Set the new offerId
    );

    if (result.matchedCount === 0) {
      console.log(`No document found with nftId: ${nftId}`);
      return null;
    }

    console.log(`Successfully updated offerId for nftId: ${nftId}`);
    return result;
  } catch (error) {
    console.error('Error updating offerId for NFT:', error);
    throw error; // Rethrow or handle as needed
  } finally {
    await client.close(); // Consider when to close the connection based on your app's use case
  }
}

export const GetObjects = async (xrplAddress?: string): Promise<Array<NFT>> => {
  try {
    await client.connect();
    const collection = client.db('albers').collection<NFT>('nfts');

    const query = xrplAddress ? { xrplAddress: xrplAddress } : {};
    const nfts = await collection.find(query).sort({ mintedAt: -1 }).toArray();

    return nfts;
  } catch (error) {
    console.error('Failed to fetch NFT objects:', error);
    throw error;
  } finally {
    await client.close();
  }
}

export default {
  DB,
  MongoClient,
  ObjectId,
  GetCollection,
  AddObject,
  UpdateObject,
  GetObjects
}