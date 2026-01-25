"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Bot, User, ArrowRight, MapPin, Navigation, Loader2, Calendar as CalIcon, Users, Wallet, Train, Bus, Plane, Car } from "lucide-react"
import dynamic from "next/dynamic"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { PlannerLoader } from "@/components/PlannerLoader"

// Dynamically import Map to avoid SSR issues
const TripMap = dynamic(() => import("@/components/TripMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>
})

type Message = {
    role: "user" | "ai"
    content: string | any
    type: "text" | "itinerary"
}

export default function CreateTripPage() {
    const { profile } = useUserProfile()
    const router = useRouter()

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
                        transport: transportMode
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

    // Helper to open date picker
    const dateInputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">

            {/* --- Left Panel: Chat & Itinerary --- */}
            <div className="flex-1 flex flex-col relative h-full">

                {/* --- Trip Settings Bar (Premium) --- */}
                <div className="mb-3 bg-white p-3 rounded-3xl border border-slate-100 shadow-sm shrink-0 space-y-3">

                    {/* Top Row: Origin & Date */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Origin */}
                        <div className="flex-1 min-w-[140px] flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all group hover:border-indigo-200">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From</p>
                                <input
                                    type="text"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    className="bg-transparent text-sm font-bold text-slate-900 w-full focus:outline-none placeholder:text-slate-300"
                                    placeholder="City"
                                />
                            </div>
                            <button onClick={handleLocateMe} disabled={isLocating} className="text-slate-400 hover:text-indigo-600 transition-colors">
                                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                            </button>
                        </div>

                        {/* Date Picker (Custom Trigger) */}
                        <div
                            className="flex-1 min-w-[140px] flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-all relative group hover:border-indigo-200"
                            onClick={() => dateInputRef.current?.showPicker()}
                        >
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                                <CalIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starting On</p>
                                <p className="text-sm font-bold text-slate-900">
                                    {startDate ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : "Tomorrow"}
                                </p>
                            </div>
                            <input
                                ref={dateInputRef}
                                type="date"
                                className="absolute inset-0 opacity-0 cursor-pointer text-sm"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Bottom Row: Travelers, Budget, Transport */}
                    <div className="flex flex-wrap items-center gap-3">

                        {/* Travelers Counter */}
                        <div className="flex items-center gap-3 bg-slate-50 px-2 py-2 rounded-2xl border border-slate-200">
                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm ml-1">
                                <Users className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-2 pr-2">
                                <button
                                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 font-bold"
                                >-</button>
                                <span className="text-sm font-bold text-slate-900 w-4 text-center">{travelers}</span>
                                <button
                                    onClick={() => setTravelers(Math.min(10, travelers + 1))}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 font-bold"
                                >+</button>
                            </div>
                        </div>

                        {/* Budget Input */}
                        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                <Wallet className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Max Budget</p>
                                <div className="flex items-center">
                                    <span className="text-xs font-bold text-slate-500 mr-1">₹</span>
                                    <input
                                        type="number"
                                        placeholder={profile?.preferences?.budget?.toString() || "5000"}
                                        className="bg-transparent text-sm font-bold text-slate-900 w-full focus:outline-none"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value ? parseInt(e.target.value) : "")}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Transport Selector */}
                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
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
                                    className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${transportMode === mode.id ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
                                    title={mode.id}
                                >
                                    <mode.icon className="w-4 h-4" />
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Chat Stream */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4 min-h-0">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Sparkles className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Where next?</h2>
                            <p className="max-w-md text-slate-500 mt-2 text-sm">
                                Configure your specific dates and budget above, then tell me where you want to go.
                            </p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`flex gap-3 max-w-[95%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-slate-100 border border-slate-200" : "bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md shadow-indigo-200"}`}>
                                    {msg.role === "user" ? <User className="w-4 h-4 text-slate-600" /> : <Sparkles className="w-4 h-4 text-white" />}
                                </div>
                                <div className={`p-4 rounded-2xl shadow-sm max-w-[85%] ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-md"}`}>
                                    {msg.type === "text" ? (
                                        <p className="leading-relaxed text-sm">{msg.content}</p>
                                    ) : (
                                        <ItineraryCard data={msg.content} onSave={handleSaveTrip} />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start w-full">
                            <div className="flex gap-3 w-full">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex-shrink-0 flex items-center justify-center">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-white/90 backdrop-blur-md border border-indigo-50 p-4 rounded-2xl rounded-tl-none w-full max-w-sm shadow-lg">
                                    <PlannerLoader />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-2 relative z-20 shrink-0 mt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Describe your dream trip (e.g. 'Chill beach vibes in Gokarna')..."
                        className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-slate-900 font-medium placeholder:text-slate-400 text-sm"
                        disabled={loading}
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-10 h-10 flex-shrink-0 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* --- Right Panel: Interactive Map --- */}
            <div className="hidden lg:block w-[450px] shrink-0 sticky top-4 h-full">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full overflow-hidden relative">
                    {activeItinerary ? (
                        <TripMap tripData={activeItinerary} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50 text-center">
                            <MapPin className="w-12 h-12 mb-4 opacity-50" />
                            <p className="font-bold">Enhanced Map Preview</p>
                            <p className="text-xs mt-2 text-slate-400">
                                Set your preferences on the left.<br />
                                We will plot specific routes and costs.
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div >
    )
}

// Comparison Helper Icons
const ModeIcon = ({ mode }: { mode: string }) => {
    const m = mode.toLowerCase()
    if (m.includes("train")) return <Train className="w-4 h-4" />
    if (m.includes("bus")) return <Bus className="w-4 h-4" />
    if (m === "car" || m.includes("taxi")) return <Car className="w-4 h-4" />
    if (m.includes("flight")) return <Plane className="w-4 h-4" />
    return <Navigation className="w-4 h-4" />
}

function ItineraryCard({ data, onSave }: { data: any, onSave: (data: any) => void }) {
    const [saving, setSaving] = useState(false)

    return (
        <div className="space-y-6 w-full">
            {/* Header */}
            <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{data.duration} Trip</span>
                    <span className="align-top text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">₹{data.totalCost} Total</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{data.tripName}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {data.destination}
                </p>
            </div>

            {/* Transport Comparison Section (NEW) */}
            {data.transportOptions && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Transport Options (Est.)</h4>
                    <div className="space-y-2">
                        {data.transportOptions.map((opt: any, i: number) => (
                            <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <ModeIcon mode={opt.mode} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 leading-tight">
                                            {opt.mode}
                                            {opt.recommended && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold">Recommended</span>}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{opt.details}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold text-slate-900">₹{opt.cost}</p>
                                    <p className="text-[10px] text-slate-400">{opt.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Itinerary */}
            <div className="space-y-4">
                {data.itinerary.map((day: any) => (
                    <div key={day.day} className="bg-white rounded-xl p-0 border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center gap-2">
                            <span className="bg-slate-900 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold">
                                {day.day}
                            </span>
                            <span className="text-xs font-bold text-slate-700">{day.title}</span>
                        </div>
                        <div className="p-3 space-y-3">
                            {day.activities.map((act: any, idx: number) => (
                                <div key={idx} className="relative pl-3 pb-0 text-xs">
                                    <div className="absolute left-[-6px] top-1.5 w-2 h-2 bg-indigo-400 rounded-full ring-2 ring-white"></div>
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-slate-700">{act.activity}</span>
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{act.time}</span>
                                    </div>
                                    {act.logistics && (
                                        <div className="mt-1 flex items-start gap-1 text-[10px] text-indigo-600 bg-indigo-50 p-1.5 rounded-md">
                                            <Navigation className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                            <span>{act.logistics}</span>
                                        </div>
                                    )}
                                    <p className="text-[10px] text-slate-400 mt-1">Est. Cost: ₹{act.cost}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Button
                onClick={() => {
                    setSaving(true)
                    onSave(data)
                }}
                disabled={saving}
                className="w-full bg-slate-900 text-white font-bold h-10 text-xs rounded-xl shadow-lg mt-2 hover:bg-slate-800"
            >
                {saving ? "Saving Trip..." : "Save to My Trips"}
            </Button>
        </div>
    )
}
