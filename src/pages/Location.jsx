import React, { useState, useEffect } from 'react'
import { MapPin, Share2, RefreshCw, Navigation, CheckCheck } from 'lucide-react'
import LocationMap from '../components/LocationMap'

const LOCATION_TIMEOUT_MS = 10000

export default function Location() {
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [address, setAddress] = useState('')

  const getLocation = () => {
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosition(loc)
        setLoading(false)
        // Reverse geocode
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json`)
          const data = await res.json()
          setAddress(data.display_name || '')
        } catch (_) {
          // ignore geocoding errors
        }
      },
      () => {
        setError('Location access denied. Please enable GPS permissions.')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: LOCATION_TIMEOUT_MS }
    )
  }

  useEffect(() => { getLocation() }, [])

  const shareLocation = async () => {
    if (!position) return
    const url = `https://maps.google.com/?q=${position.lat},${position.lng}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (_) {
      alert(`Share this link: ${url}`)
    }
  }

  return (
    <div className="px-4 py-6 flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-black text-white">Live Location</h2>
        <p className="text-gray-400 text-sm mt-0.5">Your current GPS position</p>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-purple-900/50 shadow-2xl" style={{ height: '280px' }}>
        <LocationMap position={position} />
      </div>

      {/* Coordinates */}
      {position && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-purple-400" />
            <span className="text-purple-300 font-semibold text-sm">Current Coordinates</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Latitude</p>
              <p className="text-white font-mono font-semibold">{position.lat.toFixed(6)}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Longitude</p>
              <p className="text-white font-mono font-semibold">{position.lng.toFixed(6)}</p>
            </div>
          </div>
          {address && (
            <p className="text-gray-400 text-xs leading-relaxed">{address}</p>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-3 py-4">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Getting your location...</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={shareLocation}
          disabled={!position}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white py-3 rounded-xl font-semibold active:scale-95 transition-all shadow-lg shadow-purple-500/30"
        >
          {copied ? <CheckCheck size={18} className="text-green-400" /> : <Share2 size={18} />}
          {copied ? 'Link Copied!' : 'Share Location'}
        </button>
        <button
          onClick={getLocation}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-semibold active:scale-95 transition-all"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
  )
}
