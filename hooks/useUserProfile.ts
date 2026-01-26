"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/AuthProvider"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type UserProfile = {
    uid: string
    displayName: string
    email: string
    photoURL: string
    onboardingCompleted: boolean
    preferences?: {
        budget: number
        style: string
        interests: string[]
        dietary?: "Veg" | "Non-Veg" | "Vegan" | "Other"
        allergies?: string
        bio?: string
        pace?: string
        companions?: string
        accommodation?: string
        transportation?: string
    }
}

export function useUserProfile() {
    const { user } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            setProfile(null)
            setLoading(false)
            return
        }

        const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
            if (doc.exists()) {
                setProfile(doc.data() as UserProfile)
            } else {
                setProfile(null)
            }
            setLoading(false)
        }, (error) => {
            console.error("Error fetching user profile:", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    return { profile, loading }
}
