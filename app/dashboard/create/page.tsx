"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send, Sparkles, Bot, User, ArrowRight, MapPin,
    Navigation, Loader2, Calendar as CalIcon, Users,
    Wallet, Train, Bus, Plane, Car, Settings2, X,
    ChevronLeft, ChevronRight, Clock, IndianRupee,
    Briefcase, Home, Sun, Utensils
} from "lucide-react"
import dynamic from "next/dynamic"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { PlannerLoader } from "@/components/PlannerLoader"

// Dynamically import Map to avoid SSR issues
const TripMap = dynamic(() => import("@/components/TripMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-50 animate-pulse flex items-center justify-center text-slate-300">Loading Map...</div>
})

type Message = {
    role: "user" | "ai"
    content: string | any
    type: "text" | "itinerary"
}

export default function CreateTripPage() {
    const { profile } = useUserProfile()
    const router = useRouter()

    // Layout State
    const [activeTab, setActiveTab] = useState<"settings" | "map" | null>("settings")

    // Core State
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Trip Settings State
    const [origin, setOrigin] = useState("Mumbai")
    const [isLocating, setIsLocating] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [travelers, setTravelers] = useState(1)
    const [budget, setBudget] = useState<number | "">("")
    const [transportMode, setTransportMode] = useState("Any")

    // New Advanced Settings
    const [accommodation, setAccommodation] = useState("Any")
    const [pace, setPace] = useState("Balanced")

    const [dietary, setDietary] = useState("Any")

    // Dynamic Resizing State
    const [sidebarWidth, setSidebarWidth] = useState(320)
    const [isResizing, setIsResizing] = useState(false)

    // Resizing Handlers
    const startResizing = (e: React.MouseEvent) => {
        setIsResizing(true)
        e.preventDefault()
    }

    useEffect(() => {
        if (!isResizing) return

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = window.innerWidth - e.clientX - 60
            if (newWidth > 280 && newWidth < 800) {
                setSidebarWidth(newWidth)
            }
        }

        const handleMouseUp = () => {
            setIsResizing(false)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isResizing])

    // Check for auto-start prompt from Explore page
    useEffect(() => {
        const starter = localStorage.getItem("trip_starter_prompt")
        if (starter) {
            setInput(starter)
            localStorage.removeItem("trip_starter_prompt")
        }
    }, [])

    // Track the latest itinerary to show on the map
    const activeItinerary = useMemo(() => {
        const lastMsg = messages.filter(m => m.type === "itinerary").pop()
        return lastMsg ? lastMsg.content : null
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser")
            return
        }

        setIsLocating(true)
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                const data = await res.json()
                const city = data.address.city || data.address.town || data.address.village || data.address.state_district
                if (city) setOrigin(city)
            } catch (error) {
                console.error("Error finding location:", error)
            } finally {
                setIsLocating(false)
            }
        }, () => {
            setIsLocating(false)
        })
    }

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = { role: "user", content: input, type: "text" }
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setLoading(true)

        try {
            const response = await fetch("/api/trip/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    userProfile: profile,
                    origin: origin,
                    tripOptions: {
                        startDate: startDate || "Tomorrow",
                        travelers: travelers,
                        budget: budget || profile?.preferences?.budget,
                        transport: transportMode,
                        // Pass new options
                        accommodation,
                        pace,
                        dietary
                    }
                }),
            })

            const data = await response.json()

            if (data.error) throw new Error(data.error)

            setMessages((prev) => [...prev, { role: "ai", content: data, type: "itinerary" }])
        } catch (error) {
            console.error("Error:", error)
            setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error connecting to my brain. Please check your API Key.", type: "text" }])
        } finally {
            setLoading(false)
        }
    }

    const handleSaveTrip = async (tripData: any) => {
        if (!profile?.uid) return
        try {
            await addDoc(collection(db, "users", profile.uid, "trips"), {
                ...tripData,
                status: "draft",
                createdAt: serverTimestamp(),
                origin: origin,
                travelers: travelers,
                startDate: startDate
            })
            router.push("/dashboard")
        } catch (error) {
            console.error("Error saving trip:", error)
            alert("Failed to save trip. Please try again.")
        }
    }

    return (
        <div className="flex h-[calc(100vh-100px)] gap-0 overflow-hidden relative bg-white rounded-3xl border border-slate-200 shadow-sm">

            {/* --- MAIN CONTENT AREA (Chat) --- */}
            <div className="flex-1 flex flex-col relative bg-slate-50/50">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100">
                                <Sparkles className="w-10 h-10 text-indigo-500" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Plan with AI</h2>
                            <p className="max-w-md text-slate-500 font-medium text-lg leading-relaxed">
                                Tell me your dream destination, or configure your preferences in the sidebar.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex gap-4 max-w-[90%] lg:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-white border border-slate-100" : "bg-gradient-to-tr from-indigo-600 to-purple-600"}`}>
                                    {msg.role === "user" ? <User className="w-5 h-5 text-slate-600" /> : <Bot className="w-5 h-5 text-white" />}
                                </div>

                                <div className={`rounded-2xl p-5 shadow-sm ${msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-tr-sm"
                                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-[0_2px_20px_rgba(0,0,0,0.02)]"
                                    }`}>
                                    {msg.type === "text" ? (
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                            <p className="leading-relaxed whitespace-pre-wrap text-sm font-medium">{msg.content}</p>
                                        </div>
                                    ) : (
                                        <ItineraryCard data={msg.content} onSave={handleSaveTrip} />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {loading && (
                        <div className="flex justify-start w-full">
                            <div className="flex gap-4 w-full">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex-shrink-0 flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-white/80 backdrop-blur border border-indigo-50 p-6 rounded-2xl rounded-tl-none w-full max-w-sm shadow-xl">
                                    <PlannerLoader />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100">
                    <div className="bg-white p-2 pl-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center gap-4 transition-all focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-200">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type a destination or prompt..."
                            className="flex-1 bg-transparent py-4 focus:outline-none text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium text-lg"
                            disabled={loading}
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl w-14 h-14 flex-shrink-0 shadow-lg shadow-indigo-200 transition-transform active:scale-95"
                        >
                            <Send className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* --- RIGHT DOCKING PANEL --- */}
            <AnimatePresence initial={false}>
                {activeTab && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: sidebarWidth, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={isResizing ? { type: "tween", duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                        className="border-l border-slate-200 bg-white relative z-10 flex flex-col h-full shadow-2xl"
                    >
                        {/* Drag Handle */}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-50 hover:bg-indigo-500/20 active:bg-indigo-600 transition-colors"
                            onMouseDown={startResizing}
                        />
                        {/* Header */}
                        <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50">
                            <span className="font-black text-slate-700 uppercase tracking-widest text-xs flex items-center gap-2">
                                {activeTab === "settings" && <><Settings2 className="w-4 h-4" /> Trip Properties</>}
                                {activeTab === "map" && <><MapPin className="w-4 h-4" /> Map Preview</>}
                            </span>
                            <button onClick={() => setActiveTab(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">

                            {/* SETTINGS CONTENT */}
                            {activeTab === "settings" && (
                                <div className="space-y-6">
                                    {/* Section: Basics */}
                                    <div className="space-y-4">

                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Basics</h4>

                                        {/* Origin */}
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400 ml-1" />
                                            <input
                                                type="text"
                                                value={origin}
                                                onChange={(e) => setOrigin(e.target.value)}
                                                className="bg-transparent w-full text-xs font-bold text-slate-700 focus:outline-none"
                                                placeholder="Starting City..."
                                            />
                                            <button onClick={handleLocateMe} disabled={isLocating} className="text-indigo-500 hover:bg-slate-200 rounded p-1">
                                                {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                                            </button>
                                        </div>

                                        {/* Date & Travelers Row */}
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="bg-transparent w-full text-xs font-bold text-slate-700 focus:outline-none"
                                                />
                                            </div>
                                            <div className="flex items-center bg-slate-50 px-2 rounded-xl border border-slate-100 gap-2">
                                                <Users className="w-3 h-3 text-slate-400" />
                                                <input
                                                    type="number"
                                                    min="1" max="20"
                                                    value={travelers}
                                                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                                                    className="bg-transparent w-8 text-xs font-bold text-slate-700 focus:outline-none text-center"
                                                />
                                            </div>
                                        </div>

                                        {/* Budget */}
                                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                                            <span className="text-slate-400 font-bold text-xs pl-2">₹</span>
                                            <input
                                                type="number"
                                                value={budget}
                                                onChange={(e) => setBudget(e.target.value ? parseInt(e.target.value) : "")}
                                                placeholder="Total Budget"
                                                className="bg-transparent w-full text-xs font-bold text-slate-700 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-slate-100 my-2" />

                                    {/* Section: Preferences */}
                                    <div className="space-y-5">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Preferences</h4>

                                        {/* Pace */}
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Trip Pace</label>
                                            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                                                {["Relaxed", "Balanced", "Packed"].map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPace(p)}
                                                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${pace === p ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Accommodation */}
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Stay Type</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {[
                                                    { id: "Any", icon: Home },
                                                    { id: "Hotel", icon: Briefcase },
                                                    { id: "Hostel", icon: Users },
                                                    { id: "Resort", icon: Sun }
                                                ].map(acc => (
                                                    <button
                                                        key={acc.id}
                                                        onClick={() => setAccommodation(acc.id)}
                                                        className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ${accommodation === acc.id ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}
                                                        title={acc.id}
                                                    >
                                                        <acc.icon className="w-4 h-4 mb-0.5" />
                                                        <span className="text-[9px] font-bold">{acc.id}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Transport */}
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Transport</label>
                                            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100 gap-1 overflow-x-auto">
                                                {[
                                                    { id: "Any", icon: Navigation },
                                                    { id: "Train", icon: Train },
                                                    { id: "Bus", icon: Bus },
                                                    { id: "Car", icon: Car },
                                                    { id: "Flight", icon: Plane }
                                                ].map((mode) => (
                                                    <button
                                                        key={mode.id}
                                                        onClick={() => setTransportMode(mode.id)}
                                                        className={`flex-1 min-w-[30px] py-1.5 flex items-center justify-center rounded-md transition-all ${transportMode === mode.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                                        title={mode.id}
                                                    >
                                                        <mode.icon className="w-3.5 h-3.5" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Dietary */}
                                        <div>
                                            <label className="text-[11px] font-bold text-slate-500 mb-1.5 block">Food</label>
                                            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                                                {["Any", "Veg", "Non-Veg", "Local"].map(d => (
                                                    <button
                                                        key={d}
                                                        onClick={() => setDietary(d)}
                                                        className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${dietary === d ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                                                    >
                                                        {d}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* MAP CONTENT */}
                            {activeTab === "map" && (
                                <div className="h-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-100">
                                    {activeItinerary ? (
                                        <div className="absolute inset-0">
                                            <TripMap tripData={activeItinerary} />
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8 text-center">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                                <MapPin className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="font-bold text-slate-400">Map Unavailable</p>
                                            <p className="text-xs mt-2 text-slate-400">
                                                Generate an itinerary in the chat to see the route here.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- RIGHT SIDEBAR ICONS (Compact) --- */}
            <div className="w-[60px] bg-slate-50 border-l border-slate-200 flex flex-col items-center py-6 gap-6 z-20">

                <button
                    onClick={() => setActiveTab(activeTab === "settings" ? null : "settings")}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === "settings" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:bg-white hover:shadow-sm"}`}
                    title="Properties"
                >
                    <Settings2 className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setActiveTab(activeTab === "map" ? null : "map")}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === "map" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-400 hover:bg-white hover:shadow-sm"}`}
                    title="Map"
                >
                    <MapPin className="w-5 h-5" />
                </button>
            </div>

        </div>
    )
}

// --- Helper Components ---

const ModeIcon = ({ mode }: { mode: string }) => {
    const m = mode?.toLowerCase() || ""
    if (m.includes("train")) return <Train className="w-3.5 h-3.5" />
    if (m.includes("bus")) return <Bus className="w-3.5 h-3.5" />
    if (m === "car" || m.includes("taxi")) return <Car className="w-3.5 h-3.5" />
    if (m.includes("flight")) return <Plane className="w-3.5 h-3.5" />
    return <Navigation className="w-3.5 h-3.5" />
}

function ItineraryCard({ data, onSave }: { data: any, onSave: (data: any) => void }) {
    const [saving, setSaving] = useState(false)
    const [selectedTransport, setSelectedTransport] = useState<any>(data.transportOptions?.[0] || null)
    const [expanded, setExpanded] = useState(false)

    // Calculate dynamic cost based on selection
    // Base assumption: The API returns totalCost usually for the cheapest/recommended one.
    // We try to deduce Land Cost = Total - Default Transport.
    const totalCostNumber = typeof data.totalCost === 'string' ? parseInt(data.totalCost.replace(/[^0-9]/g, '')) : data.totalCost

    // Find the default transport cost (first one usually)
    const defaultTransportCost = data.transportOptions?.[0]?.cost || 0
    const landCost = useMemo(() => Math.max(0, totalCostNumber - defaultTransportCost), [totalCostNumber, defaultTransportCost])

    const currentTotal = useMemo(() => {
        if (!selectedTransport) return totalCostNumber
        return landCost + selectedTransport.cost
    }, [landCost, selectedTransport, totalCostNumber])

    return (

        <div className="w-full min-w-[320px] max-w-lg">
            {/* Ticket Header (Dynamic) */}
            <div className="bg-slate-900 text-white p-5 rounded-3xl mb-6 shadow-xl relative overflow-hidden group transition-all">
                <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider">{data.duration}</span>
                            <motion.span
                                key={currentTotal}
                                initial={{ scale: 1.1, color: "#ffffff" }}
                                animate={{ scale: 1, color: "#6ee7b7" }}
                                className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20"
                            >
                                ₹{currentTotal.toLocaleString()}
                            </motion.span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-1">{data.tripName}</h3>
                        <p className="text-sm text-slate-400 font-medium flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" /> {data.destination}
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Transport Options */}
            {data.transportOptions && (
                <div className="mb-6">
                    <p className="text-xs uppercase font-black text-slate-400 mb-3 pl-1">Select Travel Mode</p>
                    <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                        {data.transportOptions.map((opt: any, i: number) => {
                            const isSelected = selectedTransport?.mode === opt.mode
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedTransport(opt)}
                                    className={`flex items-center gap-3 p-3 pr-5 rounded-2xl border transition-all shrink-0 ${isSelected
                                        ? "bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-500"
                                        : "bg-white border-slate-100 hover:border-slate-300"
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-500"}`}>
                                        <ModeIcon mode={opt.mode} />
                                    </div>
                                    <div className="text-left">
                                        <p className={`text-sm font-bold leading-tight ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                                            {opt.mode}
                                        </p>
                                        <p className="text-xs font-medium text-emerald-600">₹{opt.cost}</p>
                                    </div>
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 ml-1" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="space-y-6 relative pl-4">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-slate-200" />

                {/* Dynamic Arrival Step */}
                {selectedTransport && (
                    <div className="relative flex gap-5 opacity-100 transition-opacity">
                        <div className="w-11 h-11 shrink-0 bg-indigo-50 border-4 border-white shadow-sm rounded-full flex items-center justify-center z-10 text-indigo-600">
                            <Navigation className="w-5 h-5" />
                        </div>
                        <div className="flex-1 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
                            <h4 className="font-bold text-indigo-900 text-sm mb-1">Travel via {selectedTransport.mode}</h4>
                            <p className="text-xs text-indigo-700/80 leading-relaxed">{selectedTransport.details}</p>
                            <div className="flex gap-3 mt-2 opacity-80">
                                <span className="flex items-center gap-1 text-xs font-bold text-indigo-700"><Clock className="w-3.5 h-3.5" /> {selectedTransport.duration}</span>
                            </div>
                        </div>
                    </div>
                )}

                {data.itinerary.slice(0, expanded ? undefined : 3).map((day: any, idx: number) => (
                    <div key={idx} className="relative flex gap-5">
                        <div className="w-11 h-11 shrink-0 bg-white border-4 border-slate-50 shadow-sm rounded-full flex items-center justify-center z-10 font-black text-sm text-slate-400">
                            {day.day}
                        </div>
                        <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
                            <h4 className="font-bold text-slate-900 text-base mb-3">{day.title}</h4>
                            <div className="space-y-3">
                                {day.activities.slice(0, 2).map((act: any, aIdx: number) => (
                                    <div key={aIdx} className="flex items-start gap-3 text-sm">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                        <div>
                                            <span className="font-medium text-slate-700 block mb-0.5">{act.activity}</span>
                                            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.time}</span>
                                                {act.cost > 0 && <span className="flex items-center gap-1">₹ {act.cost}</span>}
                                            </div>
                                            {act.logistics && <p className="text-[10px] text-slate-400 mt-1 leading-tight">{act.logistics}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {data.itinerary.length > 3 && (
                    <div className="text-center pt-2">
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline bg-indigo-50 px-4 py-2 rounded-full transition-colors"
                        >
                            {expanded ? "Show Less" : `+ ${data.itinerary.length - 3} more days`}
                        </button>
                    </div>
                )}
            </div>

            <Button
                onClick={() => { setSaving(true); onSave({ ...data, totalCost: currentTotal, selectedTransport }); }}
                disabled={saving}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 text-base rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
                {saving ? "Saving to Trips..." : "Save & View Full Plan"}
            </Button>
        </div>
    )
}
