const crypto = require('crypto')
const { TokenCollection } = require('../server/connectors/mongo')

async function generateAndSaveKey({ userName, email }) {
  const key = crypto.randomBytes(32).toString('hex')
  const createdAt = new Date()

  try {
    const collection = await TokenCollection()
    const result = await collection.insertOne({ key, userName, email, createdAt })

    console.log(`Key saved with ID: ${result.insertedId}`)
  } catch (err) {
    console.error(`Failed to save key: ${err}`)
  } finally {
    await client.close()
  }
}

generateAndSaveKey()