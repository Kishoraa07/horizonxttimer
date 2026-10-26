import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
}

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (!uri) {
    return { client: null, db: null }
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    const client = new MongoClient(uri, options)
    await client.connect()
    const dbName = process.env.MONGODB_DB || 'horizonxt'
    const db = client.db(dbName)

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    return { client: null, db: null, error: err }
  }
}
