import React, { useState, useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function SOSButton({ contacts }) {
  const [state, setState] = useState('idle') // idle | countdown | sending | sent
  const [countdown, setCountdown] = useState(3)
  const [location, setLocation] = useState(null)
  const [message, setMessage] = useState('')
  const intervalRef = useRef(null)

  const startSOS = () => {
    setState('countdown')
    setCountdown(3)
  }

  const cancelSOS = () => {
    clearInterval(intervalRef.current)
    setState('idle')
    setCountdown(3)
  }

  useEffect(() => {
    if (state === 'countdown') {
      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            triggerSOS()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [state])

  const triggerSOS = () => {
    setState('sending')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(loc)
        const msg = `🚨 SOS ALERT! I need help! My location: https://maps.google.com/?q=${loc.lat},${loc.lng}`
        setMessage(msg)
        simulateSendSMS(msg)
      },
      () => {
        const msg = `🚨 SOS ALERT! I need help! (Location unavailable)`
        setMessage(msg)
        simulateSendSMS(msg)
      },
      { timeout: 5000 }
    )
  }

  const simulateSendSMS = (msg) => {
    setTimeout(() => {
      setState('sent')
      setTimeout(() => setState('idle'), 4000)
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {state === 'idle' && (
        <div className="relative" onClick={startSOS}>
          <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping scale-110" />
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping animation-delay-500 scale-125" />
          <button className="relative w-44 h-44 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform border-4 border-red-400/50 hover:shadow-red-500/70 hover:shadow-2xl">
            <AlertTriangle size={40} className="text-white" strokeWidth={2.5} />
            <span className="text-white font-black text-2xl tracking-widest">SOS</span>
            <span className="text-red-200 text-xs font-medium">PRESS & HOLD</span>
          </button>
        </div>
      )}

      {state === 'countdown' && (
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-44 h-44 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex flex-col items-center justify-center shadow-2xl shadow-orange-500/50 border-4 border-orange-400/50">
            <span className="text-white font-black text-6xl">{countdown}</span>
            <span className="text-orange-200 text-sm font-semibold">seconds...</span>
          </div>
          <button
            onClick={cancelSOS}
            className="flex items-center gap-2 bg-gray-700/80 hover:bg-gray-600/80 text-white px-6 py-3 rounded-full font-semibold transition-all border border-gray-600"
          >
            <X size={18} />
            Cancel SOS
          </button>
        </div>
      )}

      {state === 'sending' && (
        <div className="w-44 h-44 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex flex-col items-center justify-center shadow-2xl shadow-yellow-500/50 border-4 border-yellow-400/50 animate-pulse">
          <span className="text-white font-bold text-lg text-center px-4">Sending Alert...</span>
        </div>
      )}

      {state === 'sent' && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-44 h-44 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex flex-col items-center justify-center shadow-2xl shadow-green-500/50 border-4 border-green-400/50">
            <span className="text-4xl">✓</span>
            <span className="text-white font-bold text-lg">Alert Sent!</span>
          </div>
          {contacts.length === 0 && (
            <p className="text-yellow-400 text-sm text-center px-4">⚠️ No emergency contacts saved!</p>
          )}
          {contacts.length > 0 && (
            <p className="text-green-400 text-sm text-center">
              Alert sent to {contacts.length} contact{contacts.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
