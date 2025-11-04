import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { User } from '@/types/users.types'
import { SubCategroriesEnum } from '@/types/users.types'
import { Star } from 'lucide-react'
import { Button } from './ui/button'
import { getSubcategoryCounts, subLabel, toStars } from '@/helpers/reviews'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

type MapProps = {
  workshops: User[]
  handleSelectWorkshop: (id: number) => void
}

export const WorkshopsMap = ({ workshops, handleSelectWorkshop }: MapProps) => {
  const validWorkshops = workshops.filter(
    (w) => w.addressLatitude && w.addressLongitude
  )

  const defaultCenter: [number, number] =
    validWorkshops.length > 0
      ? [Number(validWorkshops[0].addressLatitude), Number(validWorkshops[0].addressLongitude)]
      : [-34.6037, -58.3816]

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      attributionControl={false}
      zoomControl={false}
      className='h-full w-full'
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validWorkshops.map((w) => (
        <Marker
          key={w.id}
          position={[Number(w.addressLatitude), Number(w.addressLongitude)]}
          icon={defaultIcon}
        >
          <Popup>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 220 }}>
              <strong>{w.workshopName}</strong>
              <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>{w.address}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {(() => {
                  const { avg, filled } = toStars(w.reviews)
                  return (
                    <>
                      {[0,1,2,3,4].map((i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < filled ? 'text-yellow-500' : 'text-muted-foreground/30'}`} fill={i < filled ? 'currentColor' : 'none'} />
                      ))}
                      <span style={{ fontSize: 10, marginLeft: 4 }}>{avg.toFixed(1)}/5</span>
                    </>
                  )
                })()}
              </div>
              {(() => {
                const counts = getSubcategoryCounts(w.subCategories)
                const entries = Object.entries(counts) as [SubCategroriesEnum, number][]
                if (entries.length === 0) return null
                return (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 10, color: 'var(--muted-foreground)' }}>
                    {entries.map(([k, v]) => (
                      <span key={k}>{subLabel(k)}: {v}</span>
                    ))}
                  </div>
                )
              })()}
              <Button variant="outline" size="sm" onClick={() => handleSelectWorkshop(w.id)}>Seleccionar taller</Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
