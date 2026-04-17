"use client"

import "leaflet/dist/leaflet.css"
import * as React from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"

// Leaflet pierde el path de los iconos por defecto en bundlers modernos — se fija manualmente
const markerIcon = L.icon({
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  popupAnchor: [1, -34],
})

// Mueve el mapa al nuevo centro sin recrear la instancia
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  React.useEffect(() => { map.setView(center, zoom) }, [center, zoom, map])
  return null
}

interface MapaInmuebleProps {
  coordenadas: [number, number] | null
}

const COLOMBIA_CENTER: [number, number] = [4.5709, -74.2973]

export function MapaInmueble({ coordenadas }: MapaInmuebleProps) {
  const center = coordenadas ?? COLOMBIA_CENTER
  const zoom   = coordenadas ? 15 : 5

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="w-full h-48 rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordenadas && <Marker position={coordenadas} icon={markerIcon} />}
      <MapUpdater center={center} zoom={zoom} />
    </MapContainer>
  )
}
