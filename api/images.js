import { v2 as cloudinary } from 'cloudinary'
import { connectToDatabase } from './_db.js'

// Configure Cloudinary if environment variables are present
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

const hasCloudinary = Boolean(cloudName && apiKey && apiSecret)

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

// In-memory fallback if neither Cloudinary nor MongoDB is configured yet
if (!global.__MEDAITHON_PHOTOS_FALLBACK__) {
  global.__MEDAITHON_PHOTOS_FALLBACK__ = []
}

export default async function handler(req, res) {
  // CORS & Cache-Control headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db ? db.collection('event_photos') : null

    // -------------------------------------------------------------
    // GET /api/images - Fetch all live photos
    // -------------------------------------------------------------
    if (req.method === 'GET') {
      let photos = []

      if (collection) {
        photos = await collection.find({}).sort({ createdAt: -1 }).toArray()
      } else if (hasCloudinary) {
        try {
          const result = await cloudinary.api.resources_by_tag('medaithon2026', {
            max_results: 50,
            direction: 'desc',
          })
          photos = (result.resources || []).map((item, idx) => ({
            id: item.public_id,
            title: `Live Capture #${result.resources.length - idx}`,
            kanji: '新着実況',
            category: 'Ideation & Code',
            time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: 'Arena Floor',
            img: item.secure_url,
            description: 'Direct live capture from MedAIthon 2026 battleground.',
            likes: 1,
            isUserUploaded: true,
            createdAt: item.created_at,
          }))
        } catch (cErr) {
          console.warn('Cloudinary tag fetch warning:', cErr.message)
          photos = global.__MEDAITHON_PHOTOS_FALLBACK__
        }
      } else {
        photos = global.__MEDAITHON_PHOTOS_FALLBACK__
      }

      return res.status(200).json({
        success: true,
        count: photos.length,
        photos,
        hasCloudinary,
        storage: collection ? 'mongodb' : (hasCloudinary ? 'cloudinary' : 'memory_fallback'),
      })
    }

    // -------------------------------------------------------------
    // POST /api/images - Upload live photo to Cloudinary
    // -------------------------------------------------------------
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
      const { image, title, kanji, category, location, description } = body

      if (!image) {
        return res.status(400).json({ success: false, error: 'Image data is required' })
      }

      let imageUrl = image
      let publicId = `local_${Date.now()}`

      // Upload to Cloudinary if credentials are provided
      if (hasCloudinary) {
        try {
          const uploadRes = await cloudinary.uploader.upload(image, {
            folder: 'medaithon2026/live-photos',
            tags: ['medaithon2026', category || 'Live Capture'],
            resource_type: 'image',
            transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }],
          })
          imageUrl = uploadRes.secure_url
          publicId = uploadRes.public_id
        } catch (uploadErr) {
          console.error('Cloudinary Upload Failed:', uploadErr)
          return res.status(500).json({
            success: false,
            error: `Cloudinary upload failed: ${uploadErr.message}`,
          })
        }
      }

      const newPhoto = {
        id: publicId,
        title: title?.trim() || 'Arena Floor Capture',
        kanji: kanji?.trim() || '新着実況',
        category: category || 'Ideation & Code',
        time: 'Just Now • Live Capture',
        location: location?.trim() || 'Main Arena Floor',
        img: imageUrl,
        description: description?.trim() || 'Captured live directly from the MedAIthon arena warfare.',
        likes: 1,
        isUserUploaded: true,
        createdAt: new Date().toISOString(),
      }

      // Persist in MongoDB if available
      if (collection) {
        await collection.insertOne({ ...newPhoto })
      } else {
        global.__MEDAITHON_PHOTOS_FALLBACK__.unshift(newPhoto)
      }

      return res.status(201).json({
        success: true,
        photo: newPhoto,
        hostedOnCloudinary: hasCloudinary,
      })
    }

    // -------------------------------------------------------------
    // DELETE /api/images - Delete photo from Cloudinary & Database
    // -------------------------------------------------------------
    if (req.method === 'DELETE' || (req.method === 'POST' && (req.body?.action === 'delete'))) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
      const urlObj = new URL(req.url, 'http://localhost')
      const photoId = urlObj.searchParams.get('id') || body.id

      if (!photoId) {
        return res.status(400).json({ success: false, error: 'Photo ID is required' })
      }

      let deletedFromCloudinary = false
      let deletedFromDb = false

      // 1. Delete from MongoDB if available
      if (collection) {
        try {
          const doc = await collection.findOne({ id: photoId })
          if (doc) {
            await collection.deleteOne({ id: photoId })
            deletedFromDb = true
            // If it had a Cloudinary public ID, destroy it on Cloudinary
            if (hasCloudinary && doc.id && !doc.id.startsWith('local_')) {
              try {
                await cloudinary.uploader.destroy(doc.id)
                deletedFromCloudinary = true
              } catch (cErr) {
                console.warn('Cloudinary destroy warning:', cErr.message)
              }
            }
          }
        } catch (dbErr) {
          console.error('MongoDB delete error:', dbErr.message)
        }
      }

      // 2. Direct Cloudinary delete if applicable
      if (hasCloudinary && !deletedFromCloudinary && typeof photoId === 'string' && !photoId.startsWith('local_')) {
        try {
          await cloudinary.uploader.destroy(photoId)
          deletedFromCloudinary = true
        } catch (cErr) {
          console.warn('Cloudinary direct destroy warning:', cErr.message)
        }
      }

      // 3. Remove from in-memory fallback
      global.__MEDAITHON_PHOTOS_FALLBACK__ = (global.__MEDAITHON_PHOTOS_FALLBACK__ || []).filter(
        (p) => String(p.id) !== String(photoId)
      )

      return res.status(200).json({
        success: true,
        deletedId: photoId,
        deletedFromDb,
        deletedFromCloudinary,
      })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('Images API Error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}
