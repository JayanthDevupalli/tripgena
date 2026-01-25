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
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-10 md:p-14 w-full max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-orange-400" />
                                Ready for adventure?
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-lg">
                            Hey, {profile?.displayName?.split(" ")[0] || "Traveler"}. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Where next?</span>
                        </h1>

                        <p className="text-slate-200 text-lg font-medium mb-8 max-w-lg leading-relaxed shadow-sm">
                            Your budget of <span className="text-white font-bold">₹{profile?.preferences?.budget?.toLocaleString()}</span> is ready. Let's find you a hidden gem.
                        </p>

                        {/* Interactive Quick Input */}
                        <div className="bg-white/10 backdrop-blur-xl p-2 pl-6 rounded-2xl border border-white/20 flex items-center gap-4 transition-all focus-within:bg-white/20 focus-within:border-white/40 focus-within:scale-[1.02] shadow-2xl">
                            <input
                                type="text"
                                value={quickPrompt}
                                onChange={(e) => setQuickPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleQuickStart()}
                                placeholder="Type a vibe (e.g., 'Chill beach trip')..."
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

            {/* --- 2. Floating Stats (Glassmorphism) --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-16 relative z-20 px-4">
                <StatWidget icon={Wallet} label="Budget" value={`₹${profile?.preferences?.budget?.toLocaleString()}`} color="text-emerald-400" />
                <StatWidget icon={Compass} label="Style" value={profile?.preferences?.style} color="text-violet-400" />
                <div className="col-span-2 md:col-span-2 bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-xl flex items-center justify-between group cursor-pointer hover:border-indigo-500 transition-colors"
                    onClick={() => router.push("/dashboard/explore")}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <MapIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Explore Map</p>
                            <p className="text-slate-400 text-xs">Find places near you</p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
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
                                <div className="bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Sparkles className="w-24 h-24 text-indigo-600" />
                                    </div>

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl font-black text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {trip.tripName.charAt(0)}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${trip.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {trip.status || 'Draft'}
                                        </span>
                                    </div>

                                    <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{trip.tripName}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{trip.summary}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <p className="font-bold text-slate-900">₹{trip.totalCost?.toLocaleString()}</p>
                                        <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )) : (
                        <div className="col-span-3 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 p-12 text-center">
                            <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Your travel journal is empty.</p>
                            <p className="text-sm text-slate-400">Start a new chat to plan your first trip!</p>
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
    return (
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg flex flex-col items-center text-center justify-center gap-2 hover:scale-105 transition-transform cursor-default">
            <Icon className={`w-6 h-6 ${color}`} />
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-black text-slate-800 truncate px-2">{value}</p>
            </div>
        </div>
    )
}
