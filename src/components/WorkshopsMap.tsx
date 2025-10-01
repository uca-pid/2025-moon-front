import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { User } from '@/types/users.types'
import { Button } from './ui/button'

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
            <strong>{w.workshopName}</strong>
            <br />
            {w.address}
            <br />
            <Button variant="outline" size="sm" onClick={() => handleSelectWorkshop(w.id)}>Seleccionar taller</Button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
