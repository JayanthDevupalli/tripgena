"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useUserTrips } from "@/hooks/useUserTrips"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Wallet,
    Map as MapIcon,
    Compass,
    ArrowRight,
    Loader2,
    Sparkles,
    Search,
    Flame
} from "lucide-react"

export default function DashboardPage() {
    const { profile, loading: profileLoading } = useUserProfile()
    const { trips, loading: tripsLoading } = useUserTrips()
    const router = useRouter()
    const [quickPrompt, setQuickPrompt] = useState("")

    if (profileLoading || tripsLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        )
    }

    const handleQuickStart = () => {
        if (!quickPrompt.trim()) return
        localStorage.setItem("trip_starter_prompt", quickPrompt)
        router.push("/dashboard/create")
    }

    return (
        <div className="space-y-12">


            {/* --- 1. Cinematic Hero Section --- */}
            <div className="relative rounded-[2.5rem] overflow-hidden min-h-[400px] flex items-center shadow-2xl shadow-indigo-500/20 group">
                {/* Background Image with Parallax-ish feel */}
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/60 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-10 md:p-14 w-full max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-yellow-300" />
                                AI-Powered Planner
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-lg">
                            Hi, {profile?.displayName?.split(" ")[0] || "Traveler"}. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Ready to explore?</span>
                        </h1>

                        <p className="text-slate-200 text-lg font-medium mb-8 max-w-lg leading-relaxed shadow-sm">
                            Let's turn your dream destination into a complete itinerary. Just tell us where you want to go.
                        </p>

                        {/* Interactive Quick Input */}
                        <div className="bg-white/10 backdrop-blur-xl p-2 pl-6 rounded-2xl border border-white/20 flex items-center gap-4 transition-all focus-within:bg-white/20 focus-within:border-white/40 focus-within:scale-[1.02] shadow-2xl">
                            <input
                                type="text"
                                value={quickPrompt}
                                onChange={(e) => setQuickPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleQuickStart()}
                                placeholder="Where do you want to go? (e.g. 'Paris in Spring')"
                                className="bg-transparent border-none text-white placeholder:text-white/60 text-lg font-medium w-full focus:outline-none"
                            />
                            <Button
                                onClick={handleQuickStart}
                                disabled={!quickPrompt.trim()}
                                className="h-12 w-12 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 hover:scale-105 transition-all shadow-lg flex-shrink-0"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- 2. Action Console --- */}
            <div className="px-4 mt-8">
                <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">

                    {/* Main Action: Plan New Trip */}
                    <div
                        className="col-span-1 md:col-span-2 bg-slate-900 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between group cursor-pointer hover:scale-[1.01] transition-all duration-300"
                        onClick={() => router.push("/dashboard/create")}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-white/10">
                                <Compass className="w-7 h-7 text-indigo-300" />
                            </div>
                            <div>
                                <p className="font-bold text-xl leading-tight">Plan New Trip</p>
                                <p className="text-slate-400 text-sm font-medium">Start from scratch</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Explore Map Card */}
                    <div
                        className="col-span-1 md:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all hover:-translate-y-1"
                        onClick={() => router.push("/dashboard/explore")}
                    >
                        <div className="flex justify-between items-start mb-1 leading-none">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <MapIcon className="w-6 h-6 text-orange-500" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-lg">Explore</p>
                            <p className="text-slate-500 text-xs font-medium">Discover Places</p>
                        </div>
                    </div>

                    {/* Budget Stat */}
                    <StatWidget
                        icon={Wallet}
                        label="Travel Budget"
                        value={`₹${profile?.preferences?.budget?.toLocaleString()}`}
                        color="text-emerald-500 bg-emerald-50"
                    />
                </div>
            </div>

            {/* --- 3. Inspiration Feed (Horizontal Scroll) --- */}
            <div>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Saves</h3>
                    <Link href="/dashboard/trips" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                        View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {trips.length > 0 ? trips.slice(0, 3).map((trip, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={trip.id}
                        >
                            <Link href={`/dashboard/trips/${trip.id}`} className="group block h-full">
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 h-full flex flex-col relative overflow-hidden group-hover:-translate-y-1">

                                    {/* Abstract Header Gradient */}
                                    <div className="h-32 bg-slate-900 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 mix-blend-overlay" />
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity" />

                                        <div className="absolute top-4 right-4 animate-fade-in">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 shadow-lg ${trip.status === 'draft' ? 'bg-amber-500/20 text-amber-200' : 'bg-emerald-500/20 text-emerald-200'
                                                }`}>
                                                {trip.status || 'Draft'}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-4 left-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-xl shadow-lg mb-2">
                                                {trip.tripName.charAt(0)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Body */}
                                    <div className="p-6 pt-4 flex flex-col flex-1">
                                        <h4 className="text-xl font-black text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{trip.tripName}</h4>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 font-medium leading-relaxed">
                                            {trip.summary || "No summary available for this trip yet. Click to view details."}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</span>
                                                <span className="font-black text-slate-900 text-lg">₹{trip.totalCost?.toLocaleString() ?? "0"}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-indigo-200">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Link>
                        </motion.div>
                    )) : (
                        <div className="col-span-3 bg-white rounded-[2rem] border border-dashed border-slate-200 p-12 text-center hover:bg-slate-50/50 transition-colors">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No trips saved yet</h3>
                            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start a conversation with our AI planner to generate your first custom itinerary.</p>
                            <Button onClick={() => router.push("/dashboard/create")} className="bg-slate-900 text-white rounded-xl font-bold font-sm">
                                Create New Trip
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative Blur Orbs */}
            <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -z-10" />

        </div>
    )
}

function StatWidget({ icon: Icon, label, value, color }: any) {
    const iconColor = color.includes("text-") ? color : "text-indigo-600"
    const bgClass = color.includes("bg-") ? color.split(" ").find((c: string) => c.startsWith("bg-")) : "bg-indigo-50"

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-default h-full hover:shadow-md hover:border-indigo-200">
            <div className="flex justify-between items-start mb-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgClass}`}>
                    <Icon className={`w-6 h-6 ${iconColor.replace(bgClass, "").trim()}`} />
                </div>
            </div>
            <div>
                <p className="text-lg font-black text-slate-900 truncate">{value}</p>
                <p className="text-xs font-medium text-slate-500">{label}</p>
            </div>
        </div>
    )
}
