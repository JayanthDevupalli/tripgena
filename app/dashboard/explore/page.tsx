"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowUpRight, Loader2, Navigation, Search, CloudSun, Wind, Droplets, Globe } from "lucide-react"
import Link from "next/link"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useRouter } from "next/navigation"
import { useWeather } from "@/hooks/useWeather"
import { motion, AnimatePresence } from "framer-motion"

// Expanded Category image mapping
const categoryImages: Record<string, string> = {
    "Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800",
    "Hill Station": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800",
    "City": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800",
    "Heritage": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800",
    "Adventure": "https://images.unsplash.com/photo-1533130061792-649d45df8c2d?auto=format&fit=crop&w=800",
    "Nature": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800",
    "Pilgrimage": "https://images.unsplash.com/photo-1566830646394-7b9045763266?auto=format&fit=crop&w=800",
    "Spiritual": "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800",
    "Wildlife": "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800",
    "Trekking": "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800",
    "Relaxation": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800",
    "History": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800"
}

// Interactive Story Card
function StoryCard({ dest, onClick }: { dest: any, onClick: () => void }) {
    const { weather, loading } = useWeather(dest.weather_city || dest.name)
    const WeatherIcon = weather?.icon || CloudSun

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            onClick={onClick}
            className="group relative rounded-[2rem] overflow-hidden cursor-pointer aspect-[3/4] shadow-lg shadow-indigo-500/10"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${categoryImages[dest.category] || categoryImages["Nature"]}')` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

            {/* Top Left Badges (Budget & Distance) */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                <span className="self-start bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                    ~{dest.budget}
                </span>
                {dest.distance && (
                    <span className="self-start bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {dest.distance}
                    </span>
                )}
            </div>

            {/* Weather Badge (Floating Glass) */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col items-center text-white shadow-lg z-20">
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                ) : weather ? (
                    <>
                        <WeatherIcon className="w-5 h-5 mb-1 text-amber-300" />
                        <span className="text-xs font-bold">{weather.temp}°</span>
                    </>
                ) : <CloudSun className="w-5 h-5 text-white/50" />}
            </div>

            {/* Content Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                <div className="mb-2">
                    <span className="inline-block bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border border-indigo-400 max-w-[200px] truncate">
                        {dest.category}
                    </span>
                </div>

                <h3 className="text-2xl font-black leading-tight mb-2 drop-shadow-lg group-hover:text-indigo-300 transition-colors">
                    {dest.name}
                </h3>

                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed opacity-90 mb-4 font-medium">
                    {dest.desc}
                </p>

                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 group-hover:text-white transition-colors">
                    Plan this Trip <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>
        </motion.div>
    )
}

export default function ExplorePage() {
    const { profile } = useUserProfile()
    const router = useRouter()
    const [origin, setOrigin] = useState("Mumbai")
    const [destinations, setDestinations] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [locating, setLocating] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [activeFilter, setActiveFilter] = useState("All")

    const filters = ["All", "Beach", "Hill Station", "Adventure", "Heritage", "Spiritual"]

    // Hydrate from cache
    useEffect(() => {
        const cached = localStorage.getItem("explore_cache")
        if (cached) {
            try {
                const { origin: cachedOrigin, destinations: cachedDestinations } = JSON.parse(cached)
                setOrigin(cachedOrigin)
                setDestinations(cachedDestinations)
                setHasSearched(true)
            } catch (e) { console.error("Cache error") }
        }
    }, [])

    const handleLocateMe = () => {
        if (!navigator.geolocation) return alert("Geolocation unavailable")
        setLocating(true)
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                const data = await res.json()
                const city = data.address.city || data.address.town || data.address.state_district
                if (city) setOrigin(city)
            } catch (e) { console.error(e) }
            finally { setLocating(false) }
        }, () => setLocating(false))
    }

    const fetchSuggestions = async () => {
        // Check cache first
        const cached = localStorage.getItem("explore_cache")
        if (cached) {
            try {
                const { origin: cachedOrigin, destinations: cachedDestinations } = JSON.parse(cached)
                if (cachedOrigin.toLowerCase() === origin.trim().toLowerCase() && cachedDestinations.length > 0) {
                    setDestinations(cachedDestinations)
                    setHasSearched(true)
                    return
                }
            } catch (e) { }
        }

        setLoading(true)
        setHasSearched(true)
        try {
            const res = await fetch("/api/trip/suggest", {
                method: "POST",
                body: JSON.stringify({
                    origin,
                    style: profile?.preferences?.style || "General"
                })
            })
            const data = await res.json()
            if (Array.isArray(data)) {
                setDestinations(data)
                localStorage.setItem("explore_cache", JSON.stringify({ origin, destinations: data }))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePlanTrip = (destName: string) => {
        localStorage.setItem("trip_starter_prompt", `Plan a budget trip to ${destName} from ${origin}`)
        router.push("/dashboard/create")
    }

    const filteredDestinations = activeFilter === "All"
        ? destinations
        : destinations.filter(d => d.category === activeFilter)

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black text-slate-900 tracking-tighter mb-2 flex items-center gap-3"
                    >
                        Find your Vibe <Globe className="w-8 h-8 text-indigo-600 animate-spin-slow" />
                    </motion.h1>
                    <p className="text-slate-500 font-medium text-lg">Curated getaways just overnight from you.</p>
                </div>

                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
                    <div className="flex items-center gap-2 px-3 flex-1 border-r border-slate-100">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <input
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="font-bold text-slate-900 bg-transparent focus:outline-none w-32 placeholder:text-slate-300 text-sm"
                            placeholder="Your City"
                        />
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLocateMe} disabled={locating} className="text-slate-400 hover:text-indigo-600 rounded-xl">
                        {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                    </Button>
                    <Button onClick={fetchSuggestions} disabled={loading} className="rounded-xl bg-slate-900 text-white font-bold h-10 px-6 shadow-md transition-transform active:scale-95">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                        Discover
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === filter
                            ? "bg-slate-900 text-white shadow-lg scale-105"
                            : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {!hasSearched && (
                <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-slate-100">
                        <Navigation className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Let's start here</h3>
                    <p className="text-slate-500 font-medium">Enter your city to unlock the best weekend spots near you.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredDestinations.map((dest) => (
                        <StoryCard key={dest.name} dest={dest} onClick={() => handlePlanTrip(dest.name)} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
