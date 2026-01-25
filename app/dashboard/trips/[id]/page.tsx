"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Loader2, Clock, Train, Bus, Car, Plane, Hotel, Camera, Utensils, Navigation, ChevronLeft, ChevronRight, Wallet, Sun, Cloud, CloudRain, CheckSquare, FileText, Download, Share2, Plus, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"

// Dynamic Map import
const TripMap = dynamic(() => import("@/components/TripMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
})

const getTripImage = (destination: string) => {
    return "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920"
}

export default function TripDetailsPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const router = useRouter()
    const [trip, setTrip] = useState<any>(null)
    const [showMap, setShowMap] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeDay, setActiveDay] = useState(1)

    // --- Smart Packing Logic State ---
    const [newItem, setNewItem] = useState("")
    const [isAddingItem, setIsAddingItem] = useState(false)

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
                    const data = docSnap.data()
                    // Initialize packing list if not present
                    if (!data.packingList) {
                        data.packingList = [
                            { item: "Passport / ID", checked: true },
                            { item: "Power Bank", checked: false },
                            { item: "Sunscreen", checked: false },
                            { item: "Comfortable Shoes", checked: true },
                            { item: "Camera", checked: false }
                        ]
                    }
                    setTrip({ id: docSnap.id, ...data })
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

    const handleDayChange = (day: number) => {
        setActiveDay(day)
        window.scrollTo({ top: 400, behavior: "smooth" })
    }

    // --- Smart Packing Logic ---
    // (State moved to top level)

    const togglePackingItem = async (index: number) => {
        if (!trip || !user) return
        const updatedList = [...trip.packingList]
        updatedList[index].checked = !updatedList[index].checked
        setTrip({ ...trip, packingList: updatedList }) // Optimistic update

        try {
            const docRef = doc(db, "users", user.uid, "trips", trip.id)
            await updateDoc(docRef, { packingList: updatedList })
        } catch (error) {
            console.error("Error updating packing list:", error)
        }
    }

    const addPackingItem = async () => {
        if (!newItem.trim() || !trip || !user) return
        const updatedList = [...trip.packingList, { item: newItem, checked: false }]
        setTrip({ ...trip, packingList: updatedList })
        setNewItem("")
        setIsAddingItem(false)

        try {
            const docRef = doc(db, "users", user.uid, "trips", trip.id)
            await updateDoc(docRef, { packingList: updatedList })
        } catch (error) {
            console.error("Error adding packing item:", error)
        }
    }

    const removePackingItem = async (index: number) => {
        if (!trip || !user) return
        const updatedList = trip.packingList.filter((_: any, i: number) => i !== index)
        setTrip({ ...trip, packingList: updatedList })

        try {
            const docRef = doc(db, "users", user.uid, "trips", trip.id)
            await updateDoc(docRef, { packingList: updatedList })
        } catch (error) {
            console.error("Error removing packing item:", error)
        }
    }

    // --- Share Logic ---
    const handleShare = async () => {
        const shareData = {
            title: `Trip to ${trip.destination}`,
            text: `Check out my trip plan to ${trip.destination} on TripGena!`,
            url: window.location.href,
        }

        if (navigator.share) {
            try {
                await navigator.share(shareData)
            } catch (error) {
                console.error("Error sharing:", error)
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href)
                alert("Link copied to clipboard!")
            } catch (err) {
                alert("Failed to copy link.")
            }
        }
    }

    const currentDayData = trip.itinerary.find((d: any) => d.day === activeDay)

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50" ref={scrollRef}>

            {/* 1. Parallax Hero */}
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
                    <div className="max-w-7xl mx-auto">
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

            {/* 2. Content Layout (Grid) */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 -mt-16 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

                    {/* LEFT COLUMN: Itinerary & Details */}
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</span>
                                <span className="text-xl font-black text-slate-800">{trip.duration}</span>
                            </div>
                            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Travelers</span>
                                <span className="text-xl font-black text-slate-800">{trip.travelers || 1}</span>
                            </div>
                            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col items-center justify-center text-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</span>
                                <span className="text-xl font-black text-emerald-600">₹{trip.totalCost?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 relative z-10">
                                <Sparkles className="w-5 h-5 text-amber-400" /> Trip Overview
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg relative z-10 font-medium">
                                {trip.summary}
                            </p>
                        </div>

                        {/* Selected Transport */}
                        {trip.selectedTransport && (
                            <div className="bg-indigo-600 text-white p-6 rounded-[2rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                <div className="relative z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                            <ModeIcon mode={trip.selectedTransport.mode} />
                                        </div>
                                        <div>
                                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Travel Mode</p>
                                            <h3 className="text-2xl font-black">{trip.selectedTransport.mode}</h3>
                                            <p className="text-indigo-100 text-sm font-medium opacity-80">{trip.selectedTransport.details}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black">₹{trip.selectedTransport.cost}</p>
                                        <p className="text-indigo-200 text-sm font-medium">{trip.selectedTransport.duration}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- DAY TABS --- */}
                        <div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar sticky top-4 z-40 bg-slate-50/95 backdrop-blur py-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:bg-transparent lg:backdrop-filter-none">
                                {trip.itinerary.map((day: any) => (
                                    <button
                                        key={day.day}
                                        onClick={() => handleDayChange(day.day)}
                                        className={`shrink-0 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm border ${activeDay === day.day
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-200"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                            }`}
                                    >
                                        Day {day.day}
                                    </button>
                                ))}
                            </div>

                            {/* --- ACTIVE DAY CONTENT --- */}
                            <AnimatePresence mode="wait">
                                {currentDayData && (
                                    <motion.div
                                        key={activeDay}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[400px]"
                                    >
                                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl shadow-sm">
                                                {currentDayData.day}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900">{currentDayData.title}</h3>
                                                <p className="text-slate-400 font-medium">Daily Plan</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8 relative">
                                            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-dashed border-l-2 border-slate-200 border-dashed z-0" />

                                            {currentDayData.activities.map((act: any, idx: number) => (
                                                <div key={idx} className="relative z-10 grid grid-cols-[auto_1fr] gap-6 group">
                                                    <div className="w-14 h-14 rounded-full bg-white border-4 border-slate-50 shadow-md flex items-center justify-center z-10 relative">
                                                        <ActivityIcon type={act.type || 'Activity'} />
                                                    </div>
                                                    <div className="bg-slate-50/50 hover:bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all group-hover:scale-[1.01] duration-300">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-slate-900 text-lg">{act.activity}</h4>
                                                            <span className="text-xs font-bold bg-white text-slate-500 px-3 py-1 rounded-full border border-slate-100 shadow-sm">{act.time}</span>
                                                        </div>
                                                        {act.logistics && (
                                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100/50 text-indigo-700 rounded-lg text-xs font-bold mb-4">
                                                                <Navigation className="w-3 h-3" /> {act.logistics}
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                                                            <span className="flex items-center gap-1.5"><Wallet className="w-4 h-4 text-emerald-500" /> ₹{act.cost}</span>
                                                            {act.locationName && (
                                                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-rose-500" /> {act.locationName}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-50">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleDayChange(Math.max(1, activeDay - 1))}
                                                disabled={activeDay === 1}
                                                className="text-slate-400 hover:text-slate-900"
                                            >
                                                <ChevronLeft className="w-4 h-4 mr-2" /> Previous Day
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleDayChange(Math.min(trip.itinerary.length, activeDay + 1))}
                                                disabled={activeDay === trip.itinerary.length}
                                                className="text-slate-400 hover:text-slate-900"
                                            >
                                                Next Day <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Utilities Sidebar */}
                    <div className="space-y-6">

                        {/* 1. Map Card (Small) */}
                        <div onClick={() => setShowMap(true)} className="group bg-white rounded-3xl p-2 border border-slate-100 shadow-lg shadow-slate-200/50 cursor-pointer transition-transform hover:scale-[1.02]">
                            <div className="h-40 bg-slate-100 rounded-2xl relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors">
                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold text-xs shadow-sm flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-indigo-600" /> View Map
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Weather Widget (Mocked) */}
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
                            <div className="relative z-10">
                                <h4 className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-4">Forecast</h4>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-4xl font-black mb-1">28°C</div>
                                        <p className="font-medium text-blue-100 flex items-center gap-1"><Sun className="w-4 h-4" /> Sunny</p>
                                    </div>
                                    <Sun className="w-12 h-12 text-yellow-300 animate-pulse-slow" />
                                </div>
                                <div className="mt-6 flex justify-between text-center gap-2">
                                    {['Mon', 'Tue', 'Wed'].map(d => (
                                        <div key={d} className="bg-white/10 rounded-xl p-2 flex-1 backdrop-blur-sm">
                                            <p className="text-[10px] font-bold opacity-80 mb-1">{d}</p>
                                            <Cloud className="w-4 h-4 mx-auto mb-1 opacity-80" />
                                            <p className="text-xs font-bold">26°</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Packing List (Interactive) */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/20">
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-indigo-500" /> Smart Packing
                            </h4>
                            <div className="space-y-3">
                                {trip.packingList?.map((p: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                        <button
                                            onClick={() => togglePackingItem(i)}
                                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${p.checked ? "bg-indigo-500 border-indigo-500" : "bg-white border-slate-300 hover:border-indigo-400"}`}
                                        >
                                            {p.checked && <span className="text-white text-xs">✓</span>}
                                        </button>
                                        <span className={`flex-1 text-sm font-bold truncate ${p.checked ? "text-slate-400 line-through" : "text-slate-700"}`}>{p.item}</span>
                                        <button onClick={() => removePackingItem(i)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {isAddingItem ? (
                                <div className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addPackingItem()}
                                        placeholder="Add item..."
                                        autoFocus
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                    <Button size="sm" onClick={addPackingItem} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Add</Button>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAddingItem(true)}
                                    className="w-full mt-4 text-indigo-600 text-xs font-bold hover:bg-indigo-50"
                                >
                                    + Add Item
                                </Button>
                            )}
                        </div>

                        {/* 4. Docs Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-14 rounded-2xl border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex flex-col items-center justify-center gap-1">
                                <FileText className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase">Tickets</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleShare}
                                className="h-14 rounded-2xl border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex flex-col items-center justify-center gap-1"
                            >
                                <Share2 className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase">Share</span>
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* 4. Map Overlay (Floating button removed in favor of sidebar widget, OR keep focused map) */}
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
    const m = mode?.toLowerCase() || ""
    if (m.includes("train")) return <Train className="w-5 h-5" />
    if (m.includes("bus")) return <Bus className="w-5 h-5" />
    if (m === "car" || m.includes("taxi")) return <Car className="w-5 h-5" />
    if (m.includes("flight")) return <Plane className="w-5 h-5" />
    return <Navigation className="w-5 h-5" />
}

const ActivityIcon = ({ type }: { type: string }) => {
    if (!type) return <Camera className="w-6 h-6 text-slate-400" />
    const t = type.toLowerCase()
    if (t === 'travel') return <Navigation className="w-6 h-6 text-blue-500" />
    if (t === 'stay') return <Hotel className="w-6 h-6 text-purple-500" />
    if (t === 'food') return <Utensils className="w-6 h-6 text-orange-500" />
    return <Camera className="w-6 h-6 text-emerald-500" />
}
