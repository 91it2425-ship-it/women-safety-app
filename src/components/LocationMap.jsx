import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix default marker icons for Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView(center, 15)
  }, [center, map])
  return null
}

export default function LocationMap({ position }) {
  const defaultCenter = [20.5937, 78.9629] // India center
  const center = position ? [position.lat, position.lng] : defaultCenter

  return (
    <MapContainer
      center={center}
      zoom={position ? 15 : 4}
      className="w-full h-full rounded-xl"
      style={{ minHeight: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <Marker position={[position.lat, position.lng]}>
          <Popup>
            <div className="text-center">
              <strong>📍 You are here</strong>
              <br />
              {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </div>
          </Popup>
        </Marker>
      )}
      <MapUpdater center={position ? [position.lat, position.lng] : null} />
    </MapContainer>
  )
}
