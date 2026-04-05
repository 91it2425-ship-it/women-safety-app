import React, { useState, useEffect } from 'react'
import { Phone, MessageSquare, Info, Shield } from 'lucide-react'

export default function Settings() {
  const [callerName, setCallerName] = useState('')
  const [alertMsg, setAlertMsg] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setCallerName(localStorage.getItem('callerName') || 'Mom')
    setAlertMsg(localStorage.getItem('alertMessage') || '🚨 SOS! I need help! My location: {location}')
  }, [])

  const saveSettings = () => {
    localStorage.setItem('callerName', callerName)
    localStorage.setItem('alertMessage', alertMsg)
    window.dispatchEvent(new CustomEvent('callerNameChange', { detail: callerName }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const emergencyNumbers = [
    { title: 'National Women Helpline', value: '1091', icon: '📞' },
    { title: 'Police Emergency', value: '100', icon: '🚔' },
    { title: 'Ambulance', value: '108', icon: '🚑' },
    { title: 'Women in Distress', value: '1090', icon: '🆘' },
  ]

  return (
    <div className="px-4 py-6 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-white">Settings</h2>
        <p className="text-gray-400 text-sm mt-0.5">Customize your safety preferences</p>
      </div>

      {/* Fake Call Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Phone size={18} className="text-purple-400" />
          <span className="text-white font-semibold">Fake Call Settings</span>
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1.5 block">Caller Name</label>
          <input
            type="text"
            value={callerName}
            onChange={e => setCallerName(e.target.value)}
            placeholder="e.g., Mom, Sister, Friend"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full"
          />
        </div>
      </div>

      {/* Alert Message Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-pink-400" />
          <span className="text-white font-semibold">SOS Alert Message</span>
        </div>
        <div>
          <label className="text-gray-400 text-sm mb-1.5 block">Message template</label>
          <textarea
            value={alertMsg}
            onChange={e => setAlertMsg(e.target.value)}
            rows={3}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full resize-none"
          />
          <p className="text-gray-600 text-xs mt-1">Use {'{location}'} as placeholder for GPS coordinates</p>
        </div>
      </div>

      <button
        onClick={saveSettings}
        className={`py-4 rounded-xl font-bold text-lg active:scale-95 transition-all shadow-lg ${
          saved
            ? 'bg-green-600 shadow-green-500/30 text-white'
            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30 text-white'
        }`}
      >
        {saved ? '✓ Settings Saved!' : 'Save Settings'}
      </button>

      {/* Emergency Numbers */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <Info size={18} className="text-blue-400" />
          <span className="text-white font-semibold">Emergency Numbers (India)</span>
        </div>
        {emergencyNumbers.map(t => (
          <div key={t.value} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <span className="text-xl">{t.icon}</span>
              <span className="text-gray-300 text-sm">{t.title}</span>
            </div>
            <a href={`tel:${t.value}`} className="text-purple-400 font-bold font-mono">{t.value}</a>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-4 flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-2">
          <Shield size={28} className="text-white" />
        </div>
        <h3 className="text-white font-black text-lg">SafeGuard</h3>
        <p className="text-gray-400 text-xs text-center">Women's Safety App v1.0.0</p>
        <p className="text-gray-500 text-xs text-center mt-1">Built with ❤️ for safety and empowerment</p>
      </div>
    </div>
  )
}
