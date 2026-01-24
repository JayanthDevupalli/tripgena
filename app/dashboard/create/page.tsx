"use client"

import { useState, useRef, useEffect } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Bot, User, ArrowRight, MapPin, Clock, Wallet } from "lucide-react"

type Message = {
    role: "user" | "ai"
    content: string | any // string for user, JSON object for AI results
    type: "text" | "itinerary"
}

export default function CreateTripPage() {
    const { profile } = useUserProfile()
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

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
                    userProfile: profile
                }),
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            const aiMessage: Message = {
                role: "ai",
                content: data,
                type: "itinerary"
            }
            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error("Error:", error)
            setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error connecting to my brain. Please check your API Key.", type: "text" }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] relative">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">AI Planner</h1>
                    <p className="text-slate-500">Chat with your personal travel agent.</p>
                </div>
            </div>

            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-6">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Sparkles className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Where are we going, {profile?.displayName?.split(" ")[0]}?</h2>
                        <p className="max-w-md text-slate-500 mt-2">
                            I know you like <strong>{profile?.preferences?.style}</strong> vibes and have a budget of <strong>₹{profile?.preferences?.budget?.toLocaleString()}</strong>.
                        </p>
                        <div className="mt-8 grid gap-3 w-full max-w-sm">
                            {["Plan a weekend trip near Mumbai", "Cheap beach getaway", "Adventure in Himalayas"].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => setInput(suggestion)}
                                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors text-left flex items-center justify-between group"
                                >
                                    {suggestion}
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-slate-900 text-white" : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"}`}>
                                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </div>

                            {/* Bubble */}
                            <div className={`p-4 rounded-2xl shadow-sm ${msg.role === "user" ? "bg-white text-slate-900 rounded-tr-none" : "bg-white/80 backdrop-blur-md border border-white/50 text-slate-900 rounded-tl-none"}`}>
                                {msg.type === "text" ? (
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                ) : (
                                    <ItineraryCard data={msg.content} />
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[70%]">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex-shrink-0 flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div className="bg-white/80 backdrop-blur-md border border-white/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                                <span className="text-xs font-medium text-slate-500 ml-2">Planning your trip...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-2 relative z-20">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Describe your dream trip..."
                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-slate-900 font-medium placeholder:text-slate-400"
                    disabled={loading}
                />
                <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-12 h-12 flex-shrink-0 shadow-md shadow-indigo-200"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </div>

        </div>
    )
}

// --- Sub-component: Itinerary Card Render ---
function ItineraryCard({ data }: { data: any }) {
    return (
        <div className="space-y-4 min-w-[300px] md:min-w-[500px]">
            {/* Header */}
            <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{data.duration} Trip</span>
                    <span className="align-top text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">₹{data.totalCost}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{data.tripName}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {data.destination}
                </p>
            </div>

            <p className="text-sm text-slate-600 italic border-l-2 border-indigo-200 pl-3">
                "{data.summary}"
            </p>

            <div className="space-y-3">
                {data.itinerary.map((day: any) => (
                    <div key={day.day} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                            <span className="bg-slate-900 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                                {day.day}
                            </span>
                            {day.title}
                        </h4>
                        <div className="space-y-2 pl-2 border-l border-slate-200 ml-2.5">
                            {day.activities.map((act: any, idx: number) => (
                                <div key={idx} className="relative pl-4 pb-2 text-sm">
                                    <div className="absolute left-[-5px] top-1.5 w-2 h-2 bg-indigo-400 rounded-full ring-2 ring-white"></div>
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-slate-700">{act.activity}</span>
                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{act.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">Approx. ₹{act.cost}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Button className="w-full bg-slate-900 text-white font-bold h-10 rounded-xl shadow-lg mt-2">
                Save to My Trips
            </Button>
        </div>
    )
}
