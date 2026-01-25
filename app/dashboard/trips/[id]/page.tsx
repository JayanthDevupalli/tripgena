"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, MapPin, Calendar, Wallet, Loader2, Clock, Train, Bus, Car, Plane, Hotel, Camera, Utensils, Navigation } from "lucide-react"
import dynamic from "next/dynamic"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

// Dynamic Map import
const TripMap = dynamic(() => import("@/components/TripMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
})

const getTripImage = (destination: string) => {
    // Placeholder - real app would use Google Places Photo API or Unsplash API
    return "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920"
}

export default function TripDetailsPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const router = useRouter()
    const [trip, setTrip] = useState<any>(null)
    const [showMap, setShowMap] = useState(false)
    const [loading, setLoading] = useState(true)
    const scrollRef = useRef(null)
    const { scrollY } = useScroll()
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
    const heroScale = useTransform(scrollY, [0, 300], [1, 1.1])

    useEffect(() => {
        if (!user || !id) return

        const fetchTrip = async () => {
            try {
                const docRef = doc(db, "users", user.uid, "trips", id as string)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setTrip({ id: docSnap.id, ...docSnap.data() })
                } else {
                    alert("Trip not found")
                    router.push("/dashboard")
                }
            } catch (error) {
                console.error("Error fetching trip:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTrip()
    }, [user, id, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        )
    }

    if (!trip) return null

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50" ref={scrollRef}>

            {/* 1. Parallax Hero Story */}
            <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
                <div className="absolute top-4 left-4 z-50">
                    <Button variant="secondary" size="icon" onClick={() => router.back()} className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-900 border border-white/20">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </div>

                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="absolute inset-0 bg-cover bg-center"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${getTripImage(trip.destination)}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-900/20">
                                {trip.status || 'Draft'}
                            </span>
                            <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {trip.duration}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl"
                        >
                            {trip.tripName}
                        </motion.h1>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-2 text-indigo-200 text-lg font-medium"
                        >
                            <MapPin className="w-5 h-5 text-indigo-400" />
                            {trip.origin} <ArrowLeft className="w-4 h-4 rotate-180" /> {trip.destination}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* 2. Content Layout (Single Column) */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 lg:p-8 -mt-16 relative z-30">
                <div className="space-y-8">

                    {/* Summary Card */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-amber-400" /> Trip Overview
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg mb-6">
                            {trip.summary}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Estimated Cost</p>
                                <p className="text-3xl font-black text-emerald-600 tracking-tight">₹{trip.totalCost?.toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Travelers</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tight">{trip.travelers || 1} Pax</p>
                            </div>
                        </div>
                    </div>

                    {/* Transport Options */}
                    {trip.transportOptions && (
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 px-2">How to reach</h3>
                            <div className="space-y-3">
                                {trip.transportOptions.map((opt: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                <ModeIcon mode={opt.mode} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{opt.mode} <span className="text-slate-400 font-normal ml-2 text-xs">{opt.details}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">₹{opt.cost}</p>
                                            <p className="text-xs text-slate-500">{opt.duration}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="pl-4">
                        {trip.itinerary.map((day: any) => (
                            <div key={day.day} className="relative pb-12 last:pb-0">
                                {/* Sticky Day Header */}
                                <div className="sticky top-24 z-20 mb-8 -ml-4">
                                    <div className="inline-flex items-center gap-3 bg-slate-900/90 backdrop-blur-md py-2 px-5 rounded-full text-white shadow-xl shadow-slate-900/20 border border-white/10">
                                        <span className="font-black">Day {day.day}</span>
                                        <span className="w-1 h-1 bg-white/50 rounded-full" />
                                        <span className="font-medium text-slate-200">{day.title}</span>
                                    </div>
                                </div>

                                {/* Vertical Connector */}
                                <div className="absolute left-[26px] top-14 bottom-0 w-0.5 bg-dashed border-l-2 border-slate-200 border-dashed z-0" />

                                <div className="space-y-6 relative z-10 pl-2">
                                    {day.activities.map((act: any, idx: number) => (
                                        <div key={idx} className="flex gap-6 group">
                                            {/* Icon Node */}
                                            <div className="shrink-0 w-12 h-12 rounded-full border-4 border-slate-50 bg-white shadow-sm flex items-center justify-center relative translate-y-2 z-10">
                                                <ActivityIcon type={act.type || 'Activity'} />
                                            </div>

                                            {/* Card */}
                                            <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all cursor-default relative overflow-hidden group-hover:bg-slate-50/50">
                                                <div className="flex justify-between items-start mb-3 relative z-10">
                                                    <h4 className="font-bold text-slate-900 text-lg leading-tight">{act.activity}</h4>
                                                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg shrink-0 ml-2">{act.time}</span>
                                                </div>

                                                {act.logistics && (
                                                    <div className="mb-4 px-4 py-3 bg-indigo-50/80 rounded-xl text-xs font-medium text-indigo-800 flex items-start gap-2 border border-indigo-100/50 relative z-10">
                                                        <Navigation className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-600" />
                                                        {act.logistics}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-400 relative z-10">
                                                    <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> ₹{act.cost}</span>
                                                    {act.locationName && (
                                                        <span className="flex items-center gap-1 text-slate-500"><MapPin className="w-3 h-3" /> {act.locationName}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Floating Map Button */}
            <div className="fixed bottom-8 right-8 z-40">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMap(true)}
                    className="bg-slate-900 text-white rounded-full h-16 px-6 shadow-2xl shadow-indigo-500/30 flex items-center gap-3 border-2 border-white/10 backdrop-blur-xl"
                >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg pr-1">Map</span>
                </motion.button>
            </div>

            {/* 4. Map Overlay */}
            <AnimatePresence>
                {showMap && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 md:p-8"
                        onClick={() => setShowMap(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            className="bg-white w-full h-full max-w-7xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-6 right-6 z-10">
                                <Button onClick={() => setShowMap(false)} variant="secondary" className="rounded-full shadow-lg bg-white hover:bg-slate-100 font-bold px-6">
                                    Close
                                </Button>
                            </div>
                            <div className="flex-1 relative">
                                <TripMap tripData={trip} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Helpers
const ModeIcon = ({ mode }: { mode: string }) => {
    const m = mode.toLowerCase()
    if (m.includes("train")) return <Train className="w-5 h-5" />
    if (m.includes("bus")) return <Bus className="w-5 h-5" />
    if (m === "car" || m.includes("taxi")) return <Car className="w-5 h-5" />
    if (m.includes("flight")) return <Plane className="w-5 h-5" />
    return <Navigation className="w-5 h-5" />
}

const ActivityIcon = ({ type }: { type: string }) => {
    if (!type) return <Camera className="w-5 h-5 text-slate-500" />
    const t = type.toLowerCase()
    if (t === 'travel') return <Navigation className="w-5 h-5 text-blue-500" />
    if (t === 'stay') return <Hotel className="w-5 h-5 text-purple-500" />
    if (t === 'food') return <Utensils className="w-5 h-5 text-orange-500" />
    return <Camera className="w-5 h-5 text-emerald-500" />
}

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M7 3v4" /><path d="M3 7h4" /><path d="M3 5h4" /></svg>
)
