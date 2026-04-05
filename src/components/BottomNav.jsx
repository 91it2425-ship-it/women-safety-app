import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Users, Clock, MapPin, Settings } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/timer', icon: Clock, label: 'Timer' },
  { to: '/location', icon: MapPin, label: 'Location' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1030]/90 backdrop-blur-lg border-t border-purple-900/50 z-40">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-purple-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-purple-500/20' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
