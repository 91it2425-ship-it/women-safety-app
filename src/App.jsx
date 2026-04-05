import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import FakeCall from './components/FakeCall'
import Home from './pages/Home'
import Contacts from './pages/Contacts'
import Timer from './pages/Timer'
import Location from './pages/Location'
import Settings from './pages/Settings'

export default function App() {
  const [fakeCallActive, setFakeCallActive] = useState(false)
  const [callerName, setCallerName] = useState(() => localStorage.getItem('callerName') || 'Mom')

  useEffect(() => {
    const handler = (e) => {
      if (e.detail) setCallerName(e.detail)
    }
    window.addEventListener('callerNameChange', handler)
    return () => window.removeEventListener('callerNameChange', handler)
  }, [])

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0f0a1a] to-[#1a0a2e] text-white">
        {fakeCallActive && (
          <FakeCall callerName={callerName} onEnd={() => setFakeCallActive(false)} />
        )}
        <div className="flex-1 overflow-y-auto pb-20">
          <Routes>
            <Route path="/" element={<Home onFakeCall={() => setFakeCallActive(true)} />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/location" element={<Location />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </HashRouter>
  )
}
