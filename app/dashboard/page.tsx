"use client"

import { Button } from "@/components/ui/button"
import { useUserProfile } from "@/hooks/useUserProfile"
import { motion } from "framer-motion"
import Link from "next/link"
import {
    Plus,
    Wallet,
    Map as MapIcon,
    Compass,
    MoreHorizontal,
    Calendar,
    Clock,
    ArrowUpRight,
    MapPin,
    CreditCard,
    Search
} from "lucide-react"

export default function DashboardPage() {
    const { profile, loading } = useUserProfile()

    if (loading) return null // faster perceived load

    const budgetLabel = profile?.preferences?.budget
        ? profile.preferences.budget > 25000 ? "Luxury"
            : profile.preferences.budget > 10000 ? "Comfort"
                : "Budget"
        : "Standard"

    return (
        <div className="space-y-6">

            {/* --- Top Bar Stats (High Density) --- */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Trips</span>
                        <MapIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">0</div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">+0% this month</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget Limit</span>
                        <Wallet className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">₹{profile?.preferences?.budget?.toLocaleString()}</div>
                    <div className="text-xs text-emerald-600 mt-1 font-bold flex items-center gap-1">
                        <span className="bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] uppercase">Strict</span>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vibe</span>
                        <Compass className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 capitalize">{profile?.preferences?.style}</div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">Updated just now</div>
                </div>

                <Link href="/dashboard/create" className="bg-gradient-to-br from-indigo-600 to-violet-700 p-4 rounded-xl border border-indigo-500/50 shadow-md text-white flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <Plus className="w-4 h-4" />
                            <span className="text-sm font-bold">New Trip</span>
                        </div>
                        <p className="text-[10px] text-indigo-200 leading-tight">Plan a new itinerary with AI.</p>
                    </div>
                </Link>
            </div>

            {/* --- Main Content Split --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                {/* Left Column: Recent Trips & Itineraries (2 cols) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Active Trip Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 text-sm">Active Itinerary</h3>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500 font-medium">View All</Button>
                        </div>

                        {/* Empty State Action */}
                        <div className="p-8 text-center flex flex-col items-center justify-center min-h-[200px] border-b border-dashed border-slate-200">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                <MapPin className="w-5 h-5 text-slate-400" />
                            </div>
                            <h4 className="text-slate-900 font-bold mb-1">No active trips</h4>
                            <p className="text-slate-500 text-xs mb-4 max-w-xs">You haven't created any itineraries yet. Use the AI planner to generate one in seconds.</p>
                            <Link href="/dashboard/create">
                                <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-4 h-9">
                                    <Plus className="w-3.5 h-3.5 mr-2" />
                                    Create Itinerary
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Generations Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 text-sm">Recent Drafts</h3>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" placeholder="Search..." className="h-7 w-32 bg-slate-50 border border-slate-200 rounded-md pl-7 px-2 text-[10px] focus:outline-none focus:border-indigo-500" />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3">Destination</th>
                                        <th className="px-6 py-3">Dates</th>
                                        <th className="px-6 py-3">Budget</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[1, 2].map((i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
                                                <span className="text-slate-400 italic">Draft Job #{i}</span>
                                            </td>
                                            <td className="px-6 py-3 text-slate-500">--</td>
                                            <td className="px-6 py-3 text-slate-500">--</td>
                                            <td className="px-6 py-3">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                                                    Not Started
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-indigo-600">
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Widgets */}
                <div className="space-y-6">

                    {/* Map Widget */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-64 relative group">
                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                            <div className="text-center opacity-40">
                                <MapIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Map View</p>
                            </div>
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-bold">Explore Destinations</p>
                        </div>
                    </div>

                    {/* Savings / Cost Estimator Mini Widget */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Trip Fund</h4>
                                <p className="text-[10px] text-slate-500">Estimated savings needed</p>
                            </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-emerald-500 w-[0%]" />
                        </div>
                        <div className="flex justify-between text-[10px] font-medium text-slate-400">
                            <span>₹0 saved</span>
                            <span>Target: ₹{profile?.preferences?.budget?.toLocaleString()}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4 h-8 text-xs font-bold">
                            Connect Wallet
                        </Button>
                    </div>

                    {/* Quick Actions List */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h4>
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start h-8 text-xs text-slate-600 font-medium hover:bg-slate-50 hover:text-indigo-600">
                                <Clock className="w-3.5 h-3.5 mr-2" /> View History
                            </Button>
                            <Button variant="ghost" className="w-full justify-start h-8 text-xs text-slate-600 font-medium hover:bg-slate-50 hover:text-indigo-600">
                                <Calendar className="w-3.5 h-3.5 mr-2" /> Calendar View
                            </Button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}
