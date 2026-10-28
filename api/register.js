import { MongoClient } from 'mongodb'

// Hardcoded fallback for seamless deployment without Vercel dashboard env setup
const uri = process.env.MONGODB_URI || 'mongodb+srv://814724104075_db_user:eZASHzHoR2WzQJ8y@cluster0.qi9waxe.mongodb.net/'
const options = {}

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(uri, options)
  await client.connect()
  const dbName = process.env.MONGODB_DB || 'horizonxt'
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db.collection('registrations')

    if (req.method === 'POST') {
      return res.status(403).json({
        success: false,
        error: 'Registrations are now closed. Results will be announced soon.'
      })
    }

    if (req.method === 'GET') {
      const registrations = await collection.find({}).sort({ createdAt: -1 }).toArray()
      return res.status(200).json({
        success: true,
        count: registrations.length,
        registrations
      })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('MongoDB API Error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to connect to MongoDB'
    })
  }
}
