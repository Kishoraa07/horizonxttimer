/**
 * Image service for MedAIthon Live Photo Feed.
 * Communicates with /api/images serverless function on Vercel to upload
 * images directly to Cloudinary and retrieve live event shots.
 */

export async function fetchLivePhotos() {
  try {
    const res = await fetch('/api/images')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.success && Array.isArray(data.photos)) {
      return {
        photos: data.photos,
        hasCloudinary: data.hasCloudinary,
        storage: data.storage,
      }
    }
    return { photos: [], hasCloudinary: false, storage: 'none' }
  } catch (err) {
    console.warn('Could not fetch live photos from /api/images:', err.message)
    // Fallback to local storage
    try {
      const saved = localStorage.getItem('medaithon_live_photos')
      return { photos: saved ? JSON.parse(saved) : [], hasCloudinary: false, storage: 'local_storage_fallback' }
    } catch {
      return { photos: [], hasCloudinary: false, storage: 'none' }
    }
  }
}

export async function uploadLivePhoto({ image, title, category, location, description }) {
  try {
    const res = await fetch('/api/images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image,
        title,
        kanji: '新着実況',
        category,
        location,
        description,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || `HTTP ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (err) {
    console.warn('Server upload failed, falling back to local storage:', err.message)
    // Fallback local creation
    const localPhoto = {
      id: `local_${Date.now()}`,
      title: title || 'Live Arena Capture',
      kanji: '新着実況',
      category: category || 'Ideation & Code',
      time: 'Just Now • Local Capture',
      location: location || 'Main Floor',
      img: image,
      description: description || 'Captured live directly from the MedAIthon arena.',
      likes: 1,
      isUserUploaded: true,
      createdAt: new Date().toISOString(),
    }
    return { success: true, photo: localPhoto, isFallback: true, error: err.message }
  }
}

export async function deleteLivePhoto(photoId) {
  try {
    const res = await fetch(`/api/images?id=${encodeURIComponent(photoId)}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || `HTTP ${res.status}`)
    }
    const data = await res.json()

    // Also update localStorage
    try {
      const saved = localStorage.getItem('medaithon_live_photos')
      if (saved) {
        const parsed = JSON.parse(saved)
        const updated = parsed.filter((p) => String(p.id) !== String(photoId))
        localStorage.setItem('medaithon_live_photos', JSON.stringify(updated))
      }
    } catch {
      // ignore
    }
    return data
  } catch (err) {
    console.warn('Server delete failed, updating local cache:', err.message)
    try {
      const saved = localStorage.getItem('medaithon_live_photos')
      if (saved) {
        const parsed = JSON.parse(saved)
        const updated = parsed.filter((p) => String(p.id) !== String(photoId))
        localStorage.setItem('medaithon_live_photos', JSON.stringify(updated))
      }
    } catch {
      // ignore
    }
    return { success: true, deletedId: photoId, localOnly: true }
  }
}
