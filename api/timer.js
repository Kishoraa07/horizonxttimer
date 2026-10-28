import { connectToDatabase } from './_db.js'

const TOTAL_36_HOURS_SECONDS = 36 * 3600 // 129,600 seconds

// Hardcoded fallback timestamps for seamless Vercel deployment (Sharp 9:10 AM end)
const HARDCODED_START_TIME = '2026-10-26T21:10:00+05:30'
const HARDCODED_TARGET_END_TIME = '2026-10-28T09:10:00+05:30'

// Resolve authoritative target end time (defaults to Sharp 9:10 AM)
function resolveTargetEndTime() {
  const envVal = process.env.HORIZONXT_TARGET_END_TIME || process.env.MEDAITHON_TARGET_END_TIME || HARDCODED_TARGET_END_TIME
  if (envVal) {
    if (envVal.toLowerCase() === 'sharp9' || envVal.toLowerCase() === 'sharp9am') {
      const d = new Date()
      d.setHours(9, 0, 0, 0)
      if (d.getTime() <= Date.now()) {
        d.setDate(d.getDate() + 1)
        d.setHours(9, 0, 0, 0)
      }
      return d.getTime()
    }
    if (envVal.toLowerCase() === 'sharp910' || envVal.toLowerCase() === 'sharp910am' || envVal.toLowerCase() === '9:10') {
      const d = new Date()
      d.setHours(9, 10, 0, 0)
      if (d.getTime() <= Date.now()) {
        d.setDate(d.getDate() + 1)
        d.setHours(9, 10, 0, 0)
      }
      return d.getTime()
    }
    const parsed = new Date(envVal).getTime()
    if (!isNaN(parsed)) return parsed
  }
  return new Date(HARDCODED_TARGET_END_TIME).getTime()
}

function resolveStartTime(targetEndTime) {
  const envVal = process.env.HORIZONXT_START_TIME || process.env.MEDAITHON_START_TIME || HARDCODED_START_TIME
  if (envVal) {
    const parsed = new Date(envVal).getTime()
    if (!isNaN(parsed)) return parsed
  }
  return targetEndTime - TOTAL_36_HOURS_SECONDS * 1000
}

// In-memory fallback if MongoDB is not connected
if (!global.__HORIZONXT_TIMER_FALLBACK__) {
  const fallbackEnd = resolveTargetEndTime()
  const fallbackStart = resolveStartTime(fallbackEnd)

  global.__HORIZONXT_TIMER_FALLBACK__ = {
    totalSeconds: TOTAL_36_HOURS_SECONDS,
    startTime: fallbackStart,
    targetEndTime: fallbackEnd,
    isRunning: true,
    pausedRemainingSeconds: null,
    updatedAt: Date.now(),
  }
}

export default async function handler(req, res) {
  // CORS & Cache-Control headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { db } = await connectToDatabase()
    const collection = db ? db.collection('timer_state') : null

    // Helper to get active timer state
    async function getTimerDoc() {
      const targetEndTime = resolveTargetEndTime()
      const startTime = resolveStartTime(targetEndTime)

      if (collection) {
        let doc = await collection.findOne({ _id: 'horizonxt_36h_timer' })

        // Synchronize with authoritative target end time (9:10 AM)
        if (doc && doc.targetEndTime !== targetEndTime && targetEndTime > Date.now()) {
          await collection.updateOne(
            { _id: 'horizonxt_36h_timer' },
            {
              $set: {
                targetEndTime,
                startTime,
                isRunning: true,
                pausedRemainingSeconds: null,
                updatedAt: Date.now(),
              }
            }
          )
          doc = await collection.findOne({ _id: 'horizonxt_36h_timer' })
        }

        if (!doc) {
          doc = {
            _id: 'horizonxt_36h_timer',
            totalSeconds: TOTAL_36_HOURS_SECONDS,
            startTime,
            targetEndTime,
            isRunning: true,
            pausedRemainingSeconds: null,
            updatedAt: Date.now(),
          }

          try {
            await collection.insertOne(doc)
          } catch {
            // Already created by another concurrent request
            doc = await collection.findOne({ _id: 'horizonxt_36h_timer' })
          }
        }
        return doc
      }

      if (global.__HORIZONXT_TIMER_FALLBACK__) {
        global.__HORIZONXT_TIMER_FALLBACK__.targetEndTime = targetEndTime
        global.__HORIZONXT_TIMER_FALLBACK__.startTime = startTime
      }
      return global.__HORIZONXT_TIMER_FALLBACK__
    }

    // Helper to update timer state
    async function updateTimerDoc(updates) {
      updates.updatedAt = Date.now()
      if (collection) {
        await collection.updateOne(
          { _id: 'horizonxt_36h_timer' },
          { $set: updates },
          { upsert: true }
        )
      }
      global.__HORIZONXT_TIMER_FALLBACK__ = {
        ...global.__HORIZONXT_TIMER_FALLBACK__,
        ...updates,
      }
      return await getTimerDoc()
    }

    if (req.method === 'GET') {
      const doc = await getTimerDoc()
      const now = Date.now()
      let remainingSeconds = 0

      if (doc.isRunning) {
        remainingSeconds = Math.max(0, Math.floor((doc.targetEndTime - now) / 1000))
        if (remainingSeconds === 0 && doc.isRunning) {
          await updateTimerDoc({ isRunning: false, pausedRemainingSeconds: 0 })
        }
      } else {
        remainingSeconds = doc.pausedRemainingSeconds !== null && doc.pausedRemainingSeconds !== undefined
          ? doc.pausedRemainingSeconds
          : Math.max(0, Math.floor((doc.targetEndTime - (doc.updatedAt || now)) / 1000))
      }

      return res.status(200).json({
        success: true,
        startTime: doc.startTime,
        targetEndTime: doc.targetEndTime,
        totalSeconds: doc.totalSeconds || TOTAL_36_HOURS_SECONDS,
        isRunning: doc.isRunning,
        remainingSeconds,
        serverTime: now,
        storage: collection ? 'mongodb' : 'memory_fallback',
      })
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
      const { action } = body
      const doc = await getTimerDoc()
      const now = Date.now()

      if (action === 'pause') {
        const remaining = Math.max(0, Math.floor((doc.targetEndTime - now) / 1000))
        const updated = await updateTimerDoc({
          isRunning: false,
          pausedRemainingSeconds: remaining,
        })
        return res.status(200).json({
          success: true,
          ...updated,
          remainingSeconds: remaining,
          serverTime: now,
        })
      }

      if (action === 'resume') {
        const remaining = doc.pausedRemainingSeconds !== null && doc.pausedRemainingSeconds !== undefined
          ? doc.pausedRemainingSeconds
          : Math.max(0, Math.floor((doc.targetEndTime - now) / 1000))

        const newTargetEndTime = now + (remaining * 1000)
        const updated = await updateTimerDoc({
          isRunning: true,
          targetEndTime: newTargetEndTime,
          pausedRemainingSeconds: null,
        })
        return res.status(200).json({
          success: true,
          ...updated,
          remainingSeconds: remaining,
          serverTime: now,
        })
      }

      if (action === 'reset') {
        const totalSecs = body.totalSeconds || TOTAL_36_HOURS_SECONDS
        const newTargetEndTime = now + (totalSecs * 1000)
        const updated = await updateTimerDoc({
          startTime: now,
          targetEndTime: newTargetEndTime,
          totalSeconds: totalSecs,
          isRunning: true,
          pausedRemainingSeconds: null,
        })
        return res.status(200).json({
          success: true,
          ...updated,
          remainingSeconds: totalSecs,
          serverTime: now,
        })
      }

      if (action === 'adjust') {
        const deltaSeconds = parseInt(body.deltaSeconds, 10) || 0
        let newTargetEndTime = doc.targetEndTime
        let newPaused = doc.pausedRemainingSeconds

        if (doc.isRunning) {
          newTargetEndTime = doc.targetEndTime + (deltaSeconds * 1000)
        } else {
          newPaused = Math.max(0, (doc.pausedRemainingSeconds || 0) + deltaSeconds)
          newTargetEndTime = now + (newPaused * 1000)
        }

        const updated = await updateTimerDoc({
          targetEndTime: newTargetEndTime,
          pausedRemainingSeconds: newPaused,
        })

        const remaining = doc.isRunning
          ? Math.max(0, Math.floor((newTargetEndTime - now) / 1000))
          : newPaused

        return res.status(200).json({
          success: true,
          ...updated,
          remainingSeconds: remaining,
          serverTime: now,
        })
      }

      if (action === 'set_target' || action === 'set_end_time') {
        const targetEndTime = body.targetEndTime
          ? new Date(body.targetEndTime).getTime()
          : (body.targetTimestamp || (now + (body.remainingSeconds || 3600) * 1000))

        const totalSecs = body.totalSeconds || doc.totalSeconds || TOTAL_36_HOURS_SECONDS
        const startTime = body.startTime
          ? new Date(body.startTime).getTime()
          : (targetEndTime - totalSecs * 1000)

        const remaining = Math.max(0, Math.floor((targetEndTime - now) / 1000))
        const updated = await updateTimerDoc({
          startTime,
          targetEndTime,
          totalSeconds: totalSecs,
          isRunning: true,
          pausedRemainingSeconds: null,
        })
        return res.status(200).json({
          success: true,
          ...updated,
          remainingSeconds: remaining,
          serverTime: now,
        })
      }

      return res.status(400).json({ success: false, error: 'Unknown action' })
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' })
  } catch (error) {
    console.error('Timer API Error:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    })
  }
}
