import React, { useState, useEffect } from 'react'
import { Users, Plus, Trash2, Edit3, Phone, Check, X } from 'lucide-react'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState({ name: '', phone: '' })
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('emergencyContacts')
    if (saved) setContacts(JSON.parse(saved))
  }, [])

  const save = (list) => {
    setContacts(list)
    localStorage.setItem('emergencyContacts', JSON.stringify(list))
  }

  const addContact = () => {
    setError('')
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone number are required.')
      return
    }
    if (contacts.length >= 5 && !editId) {
      setError('Maximum 5 contacts allowed.')
      return
    }
    if (editId !== null) {
      save(contacts.map(c => c.id === editId ? { ...c, ...form } : c))
      setEditId(null)
    } else {
      save([...contacts, { id: Date.now(), ...form }])
    }
    setForm({ name: '', phone: '' })
    setShowForm(false)
  }

  const deleteContact = (id) => save(contacts.filter(c => c.id !== id))

  const startEdit = (c) => {
    setForm({ name: c.name, phone: c.phone })
    setEditId(c.id)
    setShowForm(true)
    setError('')
  }

  const cancelForm = () => {
    setForm({ name: '', phone: '' })
    setEditId(null)
    setShowForm(false)
    setError('')
  }

  return (
    <div className="px-4 py-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Emergency Contacts</h2>
          <p className="text-gray-400 text-sm mt-0.5">{contacts.length}/5 contacts saved</p>
        </div>
        {!showForm && contacts.length < 5 && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold text-sm active:scale-95 transition-all shadow-lg shadow-purple-500/30"
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-bold text-purple-300">{editId ? 'Edit Contact' : 'New Contact'}</h3>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full"
          />
          <div className="flex gap-3">
            <button onClick={addContact} className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-all active:scale-95">
              <Check size={16} />
              {editId ? 'Save Changes' : 'Add Contact'}
            </button>
            <button onClick={cancelForm} className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl font-semibold transition-all active:scale-95">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {contacts.length === 0 && !showForm ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-900/30 border border-purple-500/20 flex items-center justify-center">
            <Users size={36} className="text-purple-400" />
          </div>
          <div>
            <p className="text-gray-300 font-semibold text-lg">No contacts yet</p>
            <p className="text-gray-500 text-sm mt-1">Add up to 5 emergency contacts who will receive SOS alerts</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold active:scale-95 transition-all shadow-lg shadow-purple-500/30"
          >
            <Plus size={18} />
            Add First Contact
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {contacts.map((c) => (
            <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                <span className="text-white font-bold text-lg">{c.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{c.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Phone size={12} className="text-gray-500" />
                  <p className="text-gray-400 text-sm">{c.phone}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(c)} className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors">
                  <Edit3 size={16} />
                </button>
                <button onClick={() => deleteContact(c.id)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-4 mt-2">
        <p className="text-yellow-400 text-xs font-semibold mb-1">📱 How it works</p>
        <p className="text-gray-400 text-xs leading-relaxed">When you press SOS, an alert message with your GPS location will be simulated as sent to all saved contacts via SMS.</p>
      </div>
    </div>
  )
}
