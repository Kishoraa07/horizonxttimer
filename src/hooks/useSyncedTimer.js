import { useState, useEffect, useRef, useCallback } from 'react'

export const TOTAL_36_HOURS_SECONDS = 36 * 3600 // 129,600s (36 Hours)

export function useSyncedTimer() {
  const [totalSeconds, setTotalSeconds] = useState(() => {
    const saved = localStorage.getItem('horizonxt_36h_total') || localStorage.getItem('medaithon_50h_total')
    // If previous saved total was 50 hours, migrate to 36 hours
    if (saved && parseInt(saved, 10) === 180000) {
      return TOTAL_36_HOURS_SECONDS
    }
    return saved ? parseInt(saved, 10) : TOTAL_36_HOURS_SECONDS
  })

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    const savedTarget = localStorage.getItem('horizonxt_36h_target_end')
    const savedRunning = localStorage.getItem('horizonxt_36h_is_running')
    const isRunning = savedRunning === 'true'

    if (savedTarget && isRunning) {
      const target = parseInt(savedTarget, 10)
      const diff = Math.max(0, Math.floor((target - Date.now()) / 1000))
      return diff
    }

    const savedRemaining = localStorage.getItem('horizonxt_36h_remaining')
    return savedRemaining ? parseInt(savedRemaining, 10) : TOTAL_36_HOURS_SECONDS
  })

  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    const savedRunning = localStorage.getItem('horizonxt_36h_is_running')
    return savedRunning !== null ? savedRunning === 'true' : false
  })

  const [targetEndTime, setTargetEndTime] = useState(() => {
    const savedTarget = localStorage.getItem('horizonxt_36h_target_end')
    return savedTarget ? parseInt(savedTarget, 10) : null
  })

  const [tenths, setTenths] = useState(0)
  const [serverOffset, setServerOffset] = useState(0)
  const [syncStatus, setSyncStatus] = useState('syncing') // 'syncing' | 'synced' | 'offline'

  const audioCtxRef = useRef(null)

  // Initialize Web Audio API for telemetry audio
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx()
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  // Cosmic telemetry ping (smooth futuristic tone)
  const playBeep = useCallback((freq = 880, type = 'sine', duration = 0.09, gainVal = 0.12) => {
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(gainVal, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Audio playback silently suppressed if blocked by autoplay policy
    }
  }, [getAudioContext])

  // Space touchdown resonance chord
  const playGong = useCallback(() => {
    try {
      const ctx = getAudioContext()
      if (!ctx) return
      const freqs = [220, 329.63, 440, 659.25] // A3, E4, A4, E5 harmonic chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05)
        gain.gain.setValueAtTime(0.2 / freqs.length, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + idx * 0.05)
        osc.stop(ctx.currentTime + 3.5)
      })
    } catch {
      // silent
    }
  }, [getAudioContext])

  // Fetch the authoritative timer state from the Vercel /api/timer endpoint
  const fetchTimerState = useCallback(async () => {
    try {
      const res = await fetch('/api/timer')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (data && data.success) {
        const now = Date.now()
        const offset = typeof data.serverTime === 'number' ? (data.serverTime - now) : 0
        setServerOffset(offset)

        const srvTarget = data.targetEndTime
        const srvRunning = Boolean(data.isRunning)
        const srvTotal = data.totalSeconds || TOTAL_36_HOURS_SECONDS

        setTargetEndTime(srvTarget)
        setIsTimerRunning(srvRunning)
        setTotalSeconds(srvTotal)

        let calculatedRemaining = data.remainingSeconds
        if (srvRunning && srvTarget) {
          const nowAdjusted = now + offset
          calculatedRemaining = Math.max(0, Math.floor((srvTarget - nowAdjusted) / 1000))
        }

        setRemainingSeconds(calculatedRemaining)
        setSyncStatus('synced')

        // Sync to localStorage
        localStorage.setItem('horizonxt_36h_target_end', String(srvTarget))
        localStorage.setItem('horizonxt_36h_is_running', String(srvRunning))
        localStorage.setItem('horizonxt_36h_remaining', String(calculatedRemaining))
        localStorage.setItem('horizonxt_36h_total', String(srvTotal))
      }
    } catch (err) {
      console.warn('Could not sync with /api/timer, using local fallback:', err.message)
      setSyncStatus('offline')
    }
  }, [])

  // Initial fetch on mount & background polling every 6 seconds to keep all devices in sync
  useEffect(() => {
    fetchTimerState()

    const pollInterval = setInterval(() => {
      fetchTimerState()
    }, 6000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchTimerState()
      }
    }

    const handleFocus = () => {
      fetchTimerState()
    }

    const handleStorage = (e) => {
      if (e.key === 'horizonxt_36h_target_end' || e.key === 'horizonxt_36h_is_running') {
        fetchTimerState()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorage)

    return () => {
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorage)
    }
  }, [fetchTimerState])

  // Precise 100ms ticker for tenths of a second
  useEffect(() => {
    if (!isTimerRunning) return

    const interval = setInterval(() => {
      if (targetEndTime) {
        const nowAdjusted = Date.now() + serverOffset
        const diffMs = targetEndTime - nowAdjusted
        if (diffMs > 0) {
          const t = Math.floor((diffMs % 1000) / 100)
          setTenths(t)
        } else {
          setTenths(0)
        }
      } else {
        setTenths((prev) => (prev <= 0 ? 9 : prev - 1))
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isTimerRunning, targetEndTime, serverOffset])

  // 1-second countdown ticker
  useEffect(() => {
    if (!isTimerRunning) return

    const interval = setInterval(() => {
      if (targetEndTime) {
        const nowAdjusted = Date.now() + serverOffset
        const remaining = Math.max(0, Math.floor((targetEndTime - nowAdjusted) / 1000))
        setRemainingSeconds(remaining)
        localStorage.setItem('horizonxt_36h_remaining', String(remaining))

        if (remaining <= 0) {
          setIsTimerRunning(false)
          localStorage.setItem('horizonxt_36h_is_running', 'false')
          playGong()
        }
      } else {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            localStorage.setItem('horizonxt_36h_is_running', 'false')
            playGong()
            return 0
          }
          const next = prev - 1
          localStorage.setItem('horizonxt_36h_remaining', String(next))
          return next
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning, targetEndTime, serverOffset, playGong])

  // Play / Pause toggle with serverless API persistence
  const togglePlayPause = useCallback(async () => {
    const action = isTimerRunning ? 'pause' : 'resume'
    playBeep(isTimerRunning ? 440 : 880, 'sine', 0.1, 0.15)

    // Optimistic local update
    const nextRunning = !isTimerRunning
    setIsTimerRunning(nextRunning)
    localStorage.setItem('horizonxt_36h_is_running', String(nextRunning))

    try {
      const res = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.targetEndTime) {
          setTargetEndTime(data.targetEndTime)
          localStorage.setItem('horizonxt_36h_target_end', String(data.targetEndTime))
        }
        if (typeof data.remainingSeconds === 'number') {
          setRemainingSeconds(data.remainingSeconds)
          localStorage.setItem('horizonxt_36h_remaining', String(data.remainingSeconds))
        }
      }
    } catch (err) {
      console.warn('Failed to post /api/timer action:', err.message)
    }
  }, [isTimerRunning, playBeep])

  // Reset timer to 36 hours (or custom total)
  const resetTimer = useCallback(async (customTotal = TOTAL_36_HOURS_SECONDS) => {
    playBeep(523.25, 'triangle', 0.15, 0.15)
    setTotalSeconds(customTotal)
    setRemainingSeconds(customTotal)
    setIsTimerRunning(true)
    const newTarget = Date.now() + (customTotal * 1000)
    setTargetEndTime(newTarget)

    localStorage.setItem('horizonxt_36h_total', String(customTotal))
    localStorage.setItem('horizonxt_36h_remaining', String(customTotal))
    localStorage.setItem('horizonxt_36h_is_running', 'true')
    localStorage.setItem('horizonxt_36h_target_end', String(newTarget))

    try {
      await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset', totalSeconds: customTotal }),
      })
    } catch (err) {
      console.warn('Failed to reset /api/timer:', err.message)
    }
  }, [playBeep])

  // Adjust remaining time (+1h / -1h, etc.)
  const adjustTime = useCallback(async (deltaSeconds) => {
    playBeep(deltaSeconds > 0 ? 987.77 : 330, 'sine', 0.08, 0.12)
    setRemainingSeconds((prev) => Math.max(0, prev + deltaSeconds))

    try {
      const res = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'adjust', deltaSeconds }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.targetEndTime) {
          setTargetEndTime(data.targetEndTime)
          localStorage.setItem('horizonxt_36h_target_end', String(data.targetEndTime))
        }
        if (typeof data.remainingSeconds === 'number') {
          setRemainingSeconds(data.remainingSeconds)
          localStorage.setItem('horizonxt_36h_remaining', String(data.remainingSeconds))
        }
      }
    } catch (err) {
      console.warn('Failed to adjust /api/timer:', err.message)
    }
  }, [playBeep])

  // Format helpers
  const hours = Math.floor(remainingSeconds / 3600)
  const minutes = Math.floor((remainingSeconds % 3600) / 60)
  const seconds = remainingSeconds % 60
  const elapsedSeconds = Math.max(0, totalSeconds - remainingSeconds)
  const progressPercent = Math.min(100, Math.max(0, ((elapsedSeconds / totalSeconds) * 100).toFixed(1)))

  return {
    remainingSeconds,
    totalSeconds,
    elapsedSeconds,
    hours,
    minutes,
    seconds,
    tenths,
    progressPercent,
    isTimerRunning,
    targetEndTime,
    syncStatus,
    togglePlayPause,
    resetTimer,
    adjustTime,
    playBeep,
  }
}
