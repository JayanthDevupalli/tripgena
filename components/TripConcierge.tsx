"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Send, X, Bot, MapPin, Coffee, Zap, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini (We'll use the existing env var logic if possible, or pass it in)
// For now, we assume the API key is available via process.env in a Client Component 
// (Note: In production, you'd route this through a Server Action to hide the key, 
// but for this "Ultra" demo we'll keep it direct or use the server action pattern later. 
// I'll stick to the existing pattern seen in lib/gemini.ts but adapting for client side if needed,
// OR better yet, let's use a Server Action for the actual call to be safe.)

import { chatWithConcierge } from "@/app/actions/concierge" // We will create this

interface Message {
    role: 'user' | 'model'
    text: string
    timestamp: Date
    type?: 'text' | 'suggestion' | 'alert'
}

export function TripConcierge({ tripContext }: { tripContext: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: `Hi! I'm your travel concierge for ${tripContext?.destination || 'your trip'}. I can help you find nearby gems, re-plan your day, or translate local phrases.`,
            timestamp: new Date(),
            type: 'text'
        }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg = input
        setInput("")
        setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }])
        setIsTyping(true)

        try {
            // Call the AI
            const response = await chatWithConcierge(userMsg, tripContext)

            setMessages(prev => [...prev, {
                role: 'model',
                text: response,
                timestamp: new Date()
            }])
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'model',
                text: "I'm having trouble connecting to the network right now. Try again?",
                timestamp: new Date(),
                type: 'alert'
            }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <>
            {/* The Trigger Orb (Premium Midnight Look) */}
            <motion.div
                className="fixed bottom-6 right-6 z-50 pointer-events-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="relative group">
                    {/* Subtle Glow Ring */}
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[2px] opacity-70" />

                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/10 transition-colors duration-500 overflow-hidden ${isOpen ? "bg-slate-800 rotate-90" : "bg-slate-900 rotate-0 hover:bg-slate-800"
                            }`}
                    >
                        {/* Shine Reflection */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />

                        <div className="relative z-10">
                            {isOpen ? (
                                <X className="w-5 h-5 text-slate-400" />
                            ) : (
                                <Bot className="w-5 h-5 text-white drop-shadow-sm" />
                            )}
                        </div>
                    </motion.button>

                    {/* Label (Only visible on hover) */}
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-white/10 pointer-events-none">
                        AI Concierge
                    </div>
                </div>
            </motion.div>

            {/* The Chat Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                        className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[600px] max-h-[70vh] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden flex flex-col z-50"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Concierge AI</h3>
                                    <p className="text-indigo-100 text-xs font-medium flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online & Ready
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                                            } ${msg.type === 'alert' ? "bg-red-50 text-red-600 border-red-100" : ""}`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex gap-1">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions (Contextual) */}
                        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                            <QuickButton icon={Navigation} label="Re-route" onClick={() => setInput("Can you re-plan my afternoon?")} />
                            <QuickButton icon={Coffee} label="Food nearby" onClick={() => setInput("Best food spots nearby?")} />
                            <QuickButton icon={Zap} label="Surprise me" onClick={() => setInput("Give me a hidden gem nearby.")} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="bg-slate-50 flex items-center gap-2 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything..."
                                    className="bg-transparent flex-1 px-2 py-1 text-slate-800 placeholder:text-slate-400 focus:outline-none text-sm font-medium"
                                />
                                <Button
                                    size="icon"
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="h-10 w-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function QuickButton({ icon: Icon, label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold whitespace-nowrap transition-colors"
        >
            <Icon className="w-3 h-3" /> {label}
        </button>
    )
}
