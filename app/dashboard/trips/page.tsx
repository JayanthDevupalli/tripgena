"use client"

import { useUserTrips } from "@/hooks/useUserTrips"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Calendar, ArrowRight, Search, Filter, Clock, Sparkles } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { motion } from "framer-motion"

export default function MyTripsPage() {
    const { trips, loading } = useUserTrips()

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-slate-900 tracking-tighter mb-2"
                    >
                        Travel Journal
                    </motion.h1>
                    <p className="text-slate-500 font-medium text-lg">Every adventure tells a story. Here are yours.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your memories..."
                            className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm w-full focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium shadow-sm hover:shadow-md"
                        />
                    </div>
                </div>
            </div>

            {trips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
                        <Sparkles className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Blank Canvas</h3>
                    <p className="text-slate-500 mb-8 max-w-md text-center text-lg">Your journal is waiting for its first entry. Let's plan something epic.</p>
                    <Link href="/dashboard/create">
                        <Button className="bg-slate-900 hover:bg-black text-white rounded-2xl h-14 px-10 font-bold text-lg shadow-2xl transition-all hover:scale-105">
                            Start Planning
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={trip.id}
                        >
                            <Link href={`/dashboard/trips/${trip.id}`} className="group h-full block">
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 overflow-hidden h-full flex flex-col hover:-translate-y-2 group-hover:border-indigo-100">

                                    {/* Image Header (Parallax-ish) */}
                                    <div className="h-64 relative overflow-hidden bg-slate-100">
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800')` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                        <div className="absolute top-5 right-5 z-10">
                                            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                                                {trip.status || 'Draft'}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-6 left-6 right-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-3xl font-black leading-tight mb-2 drop-shadow-lg">{trip.tripName}</h3>
                                            <div className="flex items-center gap-4 text-sm font-bold text-white/90">
                                                <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg"><MapPin className="w-3.5 h-3.5" /> {trip.destination}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50 px-3 py-1 rounded-full">
                                                <Clock className="w-3.5 h-3.5" /> {trip.duration}
                                            </div>
                                            <div className="text-xl font-black text-slate-900 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl">
                                                ₹{trip.totalCost?.toLocaleString()}
                                            </div>
                                        </div>

                                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8 flex-1">
                                            {trip.summary}
                                        </p>

                                        <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto">
                                            <span className="text-xs font-bold text-slate-400">
                                                {trip.createdAt?.seconds ? format(new Date(trip.createdAt.seconds * 1000), 'MMM d, yyyy') : 'Just now'}
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
