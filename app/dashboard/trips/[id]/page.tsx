"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Loader2, Clock, Train, Bus, Car, Plane, Hotel, Camera, Utensils, Navigation, ChevronLeft, ChevronRight, Wallet, Sun, Cloud, CloudRain, CheckSquare, FileText, Download, Share2, Plus, Trash2, ArrowDown, CheckCircle2 } from "lucide-react"
import dynamic from "next/dynamic"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useWeather } from "@/hooks/useWeather"
import { getWeatherIcon } from "@/lib/weather"
import { TripConcierge } from "@/components/TripConcierge"
import { LiveItineraryTimeline } from "@/components/LiveItineraryTimeline"


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
    const { weather } = useWeather(trip?.destination)

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
                    <div className="space-y-8 min-w-0">
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

                        {/* Selected Transport - Royal Card */}
                        {trip.selectedTransport && (
                            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/20 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-slate-900 opacity-90" />
                                <div className="absolute top-0 right-0 p-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-colors duration-700" />

                                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
                                            <ModeIcon mode={trip.selectedTransport.mode} />
                                        </div>
                                        <div>
                                            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2">Primary Transport</p>
                                            <h3 className="text-3xl font-black tracking-tight">{trip.selectedTransport.mode}</h3>
                                            <p className="text-indigo-100/80 text-lg font-medium mt-1">{trip.selectedTransport.details}</p>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-right bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                                        <p className="text-sm font-medium text-indigo-200 mb-1">Estimated Cost</p>
                                        <p className="text-3xl font-black tracking-tight text-white">₹{trip.selectedTransport.cost}</p>
                                        <div className="h-0.5 w-full bg-white/10 my-3" />
                                        <p className="text-sm font-bold text-white flex items-center justify-end gap-2">
                                            <Clock className="w-4 h-4 text-indigo-400" /> {trip.selectedTransport.duration}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- DAY TABS NAVIGATION --- */}
                        <div className="relative z-10 sticky top-4">
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-full shadow-lg shadow-slate-200/50 border border-slate-100/50" />

                            {/* Scroll Arrows - Desktop */}
                            {trip.itinerary.length > 7 && (
                                <>
                                    <button
                                        onClick={() => document.getElementById('day-tabs-container')?.scrollBy({ left: -200, behavior: 'smooth' })}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all border border-slate-100"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => document.getElementById('day-tabs-container')?.scrollBy({ left: 200, behavior: 'smooth' })}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all border border-slate-100"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}

                            {/* Tabs Container */}
                            <div
                                id="day-tabs-container"
                                className={`relative z-10 flex items-center gap-2 overflow-x-auto p-2 scrollbar-hide scroll-smooth ${trip.itinerary.length > 7 ? 'mx-10' : ''
                                    }`}
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                            >
                                {trip.itinerary.map((day: any) => (
                                    <button
                                        key={day.day}
                                        onClick={() => handleDayChange(day.day)}
                                        className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeDay === day.day
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30 scale-105"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                                            }`}
                                    >
                                        Day {day.day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* --- ACTIVE DAY CONTENT --- */}
                        <AnimatePresence mode="wait">
                            {currentDayData && (
                                <motion.div
                                    key={activeDay}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px] relative overflow-hidden"
                                >
                                    {/* Decorative Background Blur */}
                                    <div className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-slate-50/80 to-transparent pointer-events-none" />

                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 mb-12 border-b border-slate-100 pb-8">
                                        <div className="w-20 h-20 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-slate-900/20 rotate-3">
                                            {currentDayData.day}
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Daily Agenda</p>
                                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                                {currentDayData.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="relative z-10">
                                        <LiveItineraryTimeline activities={currentDayData.activities} />
                                    </div>

                                    <div className="flex items-center justify-between mt-16 pt-8 border-t border-slate-50 relative z-10">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleDayChange(Math.max(1, activeDay - 1))}
                                            disabled={activeDay === 1}
                                            className="text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full px-6"
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleDayChange(Math.min(trip.itinerary.length, activeDay + 1))}
                                            disabled={activeDay === trip.itinerary.length}
                                            className="text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full px-6"
                                        >
                                            Next <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT COLUMN: Utilities Sidebar */}
                    <div className="space-y-6">

                        {/* 1. Map Card (Small) - Premium Preview */}
                        <div onClick={() => setShowMap(true)} className="group relative h-48 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg shadow-slate-200/50 border border-slate-100">
                            <div className="absolute inset-0 bg-slate-100 transition-transform duration-700 group-hover:scale-110">
                                {/* Placeholder map pattern or image */}
                                <div className="absolute inset-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,2,0/400x400')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <span className="text-white font-bold text-sm">Trip Map</span>
                                <div className="bg-white text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <MapPin className="w-3 h-3" /> View
                                </div>
                            </div>
                        </div>

                        {/* 2. Weather Widget (Real-time) - Glass Design */}
                        <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 backdrop-blur-sm rounded-[2.5rem] p-8 border border-blue-100/50 shadow-xl shadow-blue-500/5 relative overflow-hidden group hover:border-blue-200 transition-colors">
                            <div className="absolute top-0 right-0 p-20 bg-blue-100/30 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-200/30 transition-colors" />

                            <h4 className="flex items-center gap-2 text-xs font-bold text-blue-900/60 uppercase tracking-widest mb-6 relative z-10">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Forecast
                            </h4>

                            {weather ? (
                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div>
                                            <div className="text-5xl font-black text-slate-800 tracking-tighter mb-1">{weather.temp}°</div>
                                            <p className="font-medium text-slate-500 flex items-center gap-1.5 capitalize">
                                                {weather.description}
                                            </p>
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-blue-50 text-blue-500">
                                            <weather.icon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {weather.forecast?.map((day: any, i: number) => {
                                            const ForecastIcon = getWeatherIcon(day.icon)
                                            return (
                                                <div key={i} className="flex flex-col items-center bg-white/60 p-3 rounded-2xl border border-white/50">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{day.day}</p>
                                                    <ForecastIcon className="w-4 h-4 text-slate-600 mb-2" />
                                                    <p className="text-xs font-black text-slate-700">{day.temp}°</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-32">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-300" />
                                </div>
                            )}
                        </div>

                        {/* 3. Packing List (Interactive) - Clean List */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30">
                            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                                    <CheckSquare className="w-4 h-4" />
                                </div>
                                Smart Packing
                            </h4>
                            <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {trip.packingList?.map((p: any, i: number) => (
                                    <div key={i} className="group flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer" onClick={() => togglePackingItem(i)}>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 ${p.checked ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-300 group-hover:border-indigo-400"}`}>
                                            {p.checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className={`flex-1 text-sm font-medium transition-colors ${p.checked ? "text-slate-400 line-through" : "text-slate-700"}`}>{p.item}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removePackingItem(i); }}
                                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {isAddingItem ? (
                                <div className="flex gap-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
                                    <input
                                        type="text"
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addPackingItem()}
                                        placeholder="Add new item..."
                                        autoFocus
                                        className="flex-1 bg-slate-50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder:text-slate-400"
                                    />
                                    <Button size="icon" onClick={addPackingItem} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-auto aspect-square">
                                        <ArrowDown className="w-4 h-4 -rotate-90" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAddingItem(true)}
                                    className="w-full justify-start text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl px-4 h-11"
                                >
                                    <span className="w-5 h-5 rounded-full border border-current mr-3 flex items-center justify-center text-[10px]">+</span>
                                    Add Item
                                </Button>
                            )}
                        </div>

                        {/* 4. Docs Actions - Outline Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-24 rounded-[2rem] border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-600 hover:text-indigo-600 flex flex-col items-center justify-center gap-3 transition-all duration-300 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Tickets</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleShare}
                                className="h-24 rounded-[2rem] border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-600 hover:text-indigo-600 flex flex-col items-center justify-center gap-3 transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Share</span>
                            </Button>
                        </div>
                    </div>
                </div>
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

            {/* Smart Concierge Overlay */}
            <TripConcierge tripContext={trip} />
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
