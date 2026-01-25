"use client"

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect } from "react"

// Fix Leaflet's default icon issue in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

// Component to update map view when props change
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center, zoom)
    }, [center, zoom, map])
    return null
}

export default function TripMap({ tripData }: { tripData: any }) {
    if (!tripData || !tripData.coordinates) return null

    const destination: [number, number] = [tripData.coordinates.lat, tripData.coordinates.lng]
    const activities = tripData.itinerary.flatMap((day: any) =>
        day.activities
            .filter((a: any) => a.coordinates && a.coordinates.lat)
            .map((a: any) => ({
                name: a.locationName || a.activity,
                coords: [a.coordinates.lat, a.coordinates.lng] as [number, number]
            }))
    )

    const allPoints = [destination, ...activities.map((a: any) => a.coords)]

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border border-slate-200 z-0">
            <MapContainer
                center={destination}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
            >
                <ChangeView center={destination} zoom={10} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Destination Marker */}
                <Marker position={destination} icon={icon}>
                    <Popup>
                        <span className="font-bold">{tripData.destination}</span>
                    </Popup>
                </Marker>

                {/* Activity Markers */}
                {activities.map((act: any, idx: number) => (
                    <Marker key={idx} position={act.coords} icon={icon}>
                        <Popup>{act.name}</Popup>
                    </Marker>
                ))}

                {/* Route Line */}
                <Polyline positions={allPoints} color="#4F46E5" weight={4} opacity={0.7} />

            </MapContainer>
        </div>
    )
}
