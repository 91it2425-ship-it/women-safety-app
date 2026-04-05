import React, { useState, useEffect } from 'react'
import { Phone, PhoneOff } from 'lucide-react'

export default function FakeCall({ callerName, onEnd }) {
  const [callState, setCallState] = useState('ringing') // ringing | active
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    let timer
    if (callState === 'active') {
      timer = setInterval(() => setDuration(d => d + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [callState])

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const accept = () => setCallState('active')
  const decline = () => onEnd()

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-between py-16 px-6">
      {/* Caller info */}
      <div className="flex flex-col items-center gap-6 mt-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50">
          <span className="text-5xl font-bold text-white">{callerName.charAt(0).toUpperCase()}</span>
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">{callerName}</h2>
          {callState === 'ringing' ? (
            <p className="text-gray-400 mt-2 text-lg animate-pulse">Incoming call...</p>
          ) : (
            <p className="text-green-400 mt-2 text-lg">{formatTime(duration)}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="w-full">
        {callState === 'ringing' ? (
          <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={decline}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-xl shadow-red-500/50 active:scale-95 transition-transform"
              >
                <PhoneOff size={32} className="text-white" />
              </button>
              <span className="text-gray-400 font-medium">Decline</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={accept}
                className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-xl shadow-green-500/50 active:scale-95 transition-transform animate-bounce"
              >
                <Phone size={32} className="text-white" />
              </button>
              <span className="text-gray-400 font-medium">Accept</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={onEnd}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-xl shadow-red-500/50 active:scale-95 transition-transform"
              >
                <PhoneOff size={32} className="text-white" />
              </button>
              <span className="text-gray-400 font-medium">End Call</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
