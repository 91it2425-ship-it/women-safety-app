import React, { useState, useEffect } from 'react'
import { Shield, Phone, MapPin, Clock, Bell, Wifi } from 'lucide-react'
import SOSButton from '../components/SOSButton'

const tips = [
  "Always share your live location with a trusted contact when traveling alone.",
  "Trust your instincts — if something feels wrong, leave immediately.",
  "Keep your phone charged and emergency numbers saved.",
  "Walk confidently and stay aware of your surroundings.",
  "Use well-lit and populated routes, especially at night.",
  "Let someone know your expected route and arrival time.",
]

export default function Home({ onFakeCall }) {
  const [contacts, setContacts] = useState([])
  const [timerActive, setTimerActive] = useState(false)
  const [locationStatus, setLocationStatus] = useState('unknown')
  const [tipIndex, setTipIndex] = useState(0)
  const [shakeDetected, setShakeDetected] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('emergencyContacts')
    if (saved) setContacts(JSON.parse(saved))

    const timerEnd = localStorage.getItem('timerEnd')
    if (timerEnd && parseInt(timerEnd) > Date.now()) setTimerActive(true)

    // Check location availability
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationStatus('available'),
        () => setLocationStatus('denied'),
        { timeout: 3000 }
      )
    }

    // Tip carousel
    const tipTimer = setInterval(() => setTipIndex(i => (i + 1) % tips.length), 4000)

    // Shake detection
    let lastTime = 0
    let lastX = 0, lastY = 0, lastZ = 0
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity
      if (!acc) return
      const now = Date.now()
      if (now - lastTime > 100) {
        const dx = Math.abs(acc.x - lastX)
        const dy = Math.abs(acc.y - lastY)
        const dz = Math.abs(acc.z - lastZ)
        if (dx + dy + dz > 30) {
          setShakeDetected(true)
          setTimeout(() => setShakeDetected(false), 3000)
        }
        lastX = acc.x; lastY = acc.y; lastZ = acc.z
        lastTime = now
      }
    }
    window.addEventListener('devicemotion', handleMotion)

    return () => {
      clearInterval(tipTimer)
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen px-4 py-6 gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">SafeGuard</h1>
            <p className="text-xs text-purple-400 -mt-0.5">Your safety companion</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/30">
          <Wifi size={12} className="text-green-400" />
          <span className="text-green-400 text-xs font-medium">Active</span>
        </div>
      </div>

      {/* Shake alert */}
      {shakeDetected && (
        <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-3 text-center animate-pulse">
          <p className="text-orange-300 font-semibold text-sm">📳 Shake detected! Press SOS if you need help.</p>
        </div>
      )}

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
          <MapPin size={18} className={locationStatus === 'available' ? 'text-green-400' : 'text-gray-500'} />
          <p className="text-xs text-gray-400">Location</p>
          <p className={`text-xs font-semibold ${locationStatus === 'available' ? 'text-green-400' : 'text-gray-500'}`}>
            {locationStatus === 'available' ? 'On' : locationStatus === 'denied' ? 'Denied' : 'Checking'}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
          <Phone size={18} className={contacts.length > 0 ? 'text-purple-400' : 'text-gray-500'} />
          <p className="text-xs text-gray-400">Contacts</p>
          <p className={`text-xs font-semibold ${contacts.length > 0 ? 'text-purple-400' : 'text-yellow-400'}`}>
            {contacts.length > 0 ? `${contacts.length} saved` : 'None'}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
          <Clock size={18} className={timerActive ? 'text-blue-400' : 'text-gray-500'} />
          <p className="text-xs text-gray-400">Timer</p>
          <p className={`text-xs font-semibold ${timerActive ? 'text-blue-400' : 'text-gray-500'}`}>
            {timerActive ? 'Running' : 'Off'}
          </p>
        </div>
      </div>

      {/* SOS Button */}
      <div className="flex flex-col items-center py-6 gap-3">
        <p className="text-gray-400 text-sm font-medium">EMERGENCY SOS</p>
        <SOSButton contacts={contacts} />
        <p className="text-gray-500 text-xs mt-2">Tap to send alert to emergency contacts</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onFakeCall}
          className="bg-gradient-to-br from-purple-600/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform hover:border-purple-500/60"
        >
          <Phone size={24} className="text-purple-400" />
          <span className="text-xs text-gray-300 font-medium text-center">Fake Call</span>
        </button>
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                pos => {
                  const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
                  navigator.clipboard.writeText(url).then(() => alert('Location link copied!'))
                },
                () => alert('Could not get location. Please enable GPS permissions.')
              )
            } else {
              alert('Geolocation is not supported by your browser.')
            }
          }}
          className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border border-blue-500/30 rounded-xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform hover:border-blue-500/60"
        >
          <MapPin size={24} className="text-blue-400" />
          <span className="text-xs text-gray-300 font-medium text-center">Share Location</span>
        </button>
        <a
          href="#/timer"
          className="bg-gradient-to-br from-pink-600/30 to-pink-800/30 border border-pink-500/30 rounded-xl p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform hover:border-pink-500/60 no-underline"
        >
          <Clock size={24} className="text-pink-400" />
          <span className="text-xs text-gray-300 font-medium text-center">Safe Timer</span>
        </a>
      </div>

      {/* Safety tip */}
      <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={16} className="text-yellow-400" />
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider">Safety Tip</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{tips[tipIndex]}</p>
        <div className="flex gap-1 mt-3">
          {tips.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i === tipIndex ? 'bg-purple-400' : 'bg-gray-700'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
