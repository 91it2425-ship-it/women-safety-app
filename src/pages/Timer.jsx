import React, { useState, useEffect, useRef } from 'react'
import { Clock, Play, Square, CheckCircle, AlertTriangle } from 'lucide-react'

export default function Timer() {
  const [duration, setDuration] = useState(30)
  const [timeLeft, setTimeLeft] = useState(null)
  const [running, setRunning] = useState(false)
  const [expired, setExpired] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const timerEnd = localStorage.getItem('timerEnd')
    if (timerEnd) {
      const end = parseInt(timerEnd)
      const left = Math.floor((end - Date.now()) / 1000)
      if (left > 0) {
        setTimeLeft(left)
        setRunning(true)
      } else {
        localStorage.removeItem('timerEnd')
        setExpired(true)
      }
    }
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setExpired(true)
            localStorage.removeItem('timerEnd')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const start = () => {
    const secs = duration * 60
    const end = Date.now() + secs * 1000
    localStorage.setItem('timerEnd', end.toString())
    setTimeLeft(secs)
    setRunning(true)
    setExpired(false)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setTimeLeft(null)
    localStorage.removeItem('timerEnd')
    setExpired(false)
  }

  const checkIn = () => {
    const secs = duration * 60
    const end = Date.now() + secs * 1000
    localStorage.setItem('timerEnd', end.toString())
    setTimeLeft(secs)
    setExpired(false)
  }

  const formatTime = (s) => {
    if (s === null || s === undefined) return '00:00'
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const progress = timeLeft !== null ? (timeLeft / (duration * 60)) * 100 : 0
  const circumference = 2 * Math.PI * 80

  return (
    <div className="px-4 py-6 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-white">Safe Timer</h2>
        <p className="text-gray-400 text-sm mt-0.5">Auto-trigger SOS if you don't check in time</p>
      </div>

      {expired && (
        <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle size={24} className="text-red-400 shrink-0" />
          <div>
            <p className="text-red-300 font-bold">Timer Expired!</p>
            <p className="text-red-400 text-sm">SOS alert would have been triggered. Stay safe!</p>
          </div>
        </div>
      )}

      {/* Circular countdown */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="80" fill="none" stroke="#ffffff10" strokeWidth="8" />
            <circle
              cx="90" cy="90" r="80"
              fill="none"
              stroke={expired ? '#ef4444' : running ? '#8B5CF6' : '#374151'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * progress) / 100}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Clock size={24} className={running ? 'text-purple-400' : 'text-gray-600'} />
            <span className={`text-3xl font-black mt-1 ${expired ? 'text-red-400' : running ? 'text-white' : 'text-gray-500'}`}>
              {running || expired ? formatTime(timeLeft) : '--:--'}
            </span>
            {running && <span className="text-purple-400 text-xs font-medium mt-1">remaining</span>}
          </div>
        </div>

        {!running && (
          <div className="flex flex-col items-center gap-2 w-full">
            <label className="text-gray-400 text-sm">Set duration (minutes)</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDuration(d => Math.max(1, d - 5))}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold text-lg transition-colors"
              >-</button>
              <span className="text-white text-3xl font-black w-16 text-center">{duration}</span>
              <button
                onClick={() => setDuration(d => Math.min(240, d + 5))}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold text-lg transition-colors"
              >+</button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        {!running ? (
          <button
            onClick={start}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-all shadow-lg shadow-purple-500/30"
          >
            <Play size={22} />
            Start Safe Timer
          </button>
        ) : (
          <>
            <button
              onClick={checkIn}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-all shadow-lg shadow-green-500/30"
            >
              <CheckCircle size={22} />
              Check In (Reset Timer)
            </button>
            <button
              onClick={stop}
              className="flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold active:scale-95 transition-all"
            >
              <Square size={18} />
              Stop Timer
            </button>
          </>
        )}
      </div>

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-400 text-xs font-semibold mb-1">ℹ️ How Safe Timer works</p>
        <p className="text-gray-400 text-xs leading-relaxed">Start the timer when you begin your journey. If you don't check in before it expires, an SOS alert will be automatically sent to your emergency contacts.</p>
      </div>
    </div>
  )
}
