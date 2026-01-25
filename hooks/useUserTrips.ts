"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type Trip = {
    id: string
    tripName: string
    destination: string
    duration: string
    totalCost: number
    status: 'draft' | 'confirmed'
    createdAt: any
    summary?: string
    coordinates?: { lat: number, lng: number }
    itinerary?: any[]
    origin?: string
}

export function useUserTrips() {
    const { user } = useAuth()
    const [trips, setTrips] = useState<Trip[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setTrips([])
            setLoading(false)
            return
        }

        // Query trips subcollection
        const tripsRef = collection(db, "users", user.uid, "trips")
        const q = query(tripsRef, orderBy("createdAt", "desc"))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tripsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Trip[]
            setTrips(tripsData)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching trips:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    return { trips, loading }
}
