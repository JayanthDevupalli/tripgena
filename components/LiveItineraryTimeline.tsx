"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Star, Navigation, Camera, Utensils, Hotel, ArrowDown, CheckCircle2, Circle } from "lucide-react"

// Real-time Simulation Helper
const getLiveStatus = (index: number) => {
    // For demo: 
    // Index 0 = Completed
    // Index 1 = Active (Live)
    // Other = Upcoming
    if (index === 0) return 'completed'
    if (index === 1) return 'active'
    return 'upcoming'
}

export function LiveItineraryTimeline({ activities }: { activities: any[] }) {
    if (!activities || activities.length === 0) return null

    return (
        <div className="relative py-4 pl-4">
            {/* Continuous Vertical Line */}
            <div className="absolute left-[38px] top-4 bottom-0 w-1 bg-slate-100 rounded-full" />

            {/* Current Time Indicator (Visual Flourish) */}
            <motion.div
                className="absolute left-[34px] w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm z-20"
                initial={{ top: "15%" }}
                animate={{ top: "18%" }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />

            <div className="space-y-10">
                {activities.map((act, index) => {
                    const status = getLiveStatus(index)
                    return (
                        <TimelineItem key={index} activity={act} status={status} index={index} />
                    )
                })}
            </div>

            {/* End of Day Marker */}
            <div className="relative flex items-center gap-4 mt-8 opacity-50">
                <div className="w-12 flex justify-center z-10">
                    <div className="w-4 h-4 rounded-full bg-slate-200" />
                </div>
                <p className="text-sm font-bold text-slate-400">End of Day Plan</p>
            </div>
        </div>
    )
}

function TimelineItem({ activity, status, index }: { activity: any, status: string, index: number }) {
    const isLive = status === 'active'
    const isDone = status === 'completed'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative grid grid-cols-[auto_1fr] gap-6 group ${isDone ? 'opacity-60 saturate-50' : 'opacity-100'}`}
        >
            {/* Icon Node */}
            <div className={`
                w-16 h-16 rounded-2xl border-4 flex items-center justify-center z-10 transition-all duration-500 relative
                ${isLive ? 'bg-indigo-600 border-indigo-100 shadow-xl shadow-indigo-200 scale-110' :
                    isDone ? 'bg-slate-100 border-white text-slate-400' : 'bg-white border-slate-50 shadow-sm'}
            `}>
                {isLive && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
                <ActivityIcon type={activity.type} className={`w-7 h-7 ${isLive ? 'text-white' : isDone ? 'text-slate-400' : 'text-slate-600'}`} />
            </div>

            {/* Card Content */}
            <div className={`
                relative p-6 rounded-[1.5rem] border transition-all duration-300
                ${isLive ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-2xl shadow-indigo-200 scale-[1.02] border-indigo-500' :
                    'bg-white hover:bg-slate-50 border-slate-100 shadow-lg shadow-slate-100/50'}
            `}>
                {/* Live Status Badge */}
                {isLive && (
                    <div className="absolute -top-3 left-6 bg-red-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Live
                    </div>
                )}

                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className={`text-xl font-black mb-1 ${isLive ? 'text-white' : 'text-slate-900 group-hover:text-indigo-600 transition-colors'}`}>
                            {activity.activity}
                        </h4>
                        <div className={`flex flex-wrap items-center gap-3 text-sm font-medium ${isLive ? 'text-indigo-100' : 'text-slate-500'}`}>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 opacity-70" /> {activity.time}</span>
                            {activity.locationName && (
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 opacity-70" /> {activity.locationName}</span>
                            )}
                            {activity.cost > 0 && (
                                <span className="flex items-center gap-1.5"><span className="opacity-70">₹</span> {activity.cost}</span>
                            )}
                        </div>
                        {/* Logistics / Notes */}
                        {activity.logistics && (
                            <p className={`mt-2 text-xs leading-relaxed opacity-80 ${isLive ? 'text-indigo-200' : 'text-slate-500'}`}>
                                {activity.logistics}
                            </p>
                        )}
                    </div>
                </div>

                {/* Contextual Meta Info (Mocked Real-time) */}
                <div className={`mt-4 pt-4 border-t flex items-center justify-between ${isLive ? 'border-white/20' : 'border-slate-100'}`}>
                    <div className="flex gap-2">
                        <Tag label="Open" color={isLive ? "bg-emerald-500/20 text-emerald-100" : "bg-emerald-50 text-emerald-600"} />
                        <Tag label={isLive ? "Crowded" : "Quiet"} color={isLive ? "bg-amber-500/20 text-amber-100" : "bg-slate-100 text-slate-500"} />
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-wider ${isLive ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {isDone ? "Completed" : isLive ? "Happening Now" : "Recommended"}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

function Tag({ label, color }: any) {
    return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${color}`}>
            {label}
        </span>
    )
}

const ActivityIcon = ({ type, className }: { type: string, className?: string }) => {
    if (!type) return <Camera className={className} />
    const t = type.toLowerCase()
    if (t === 'travel') return <Navigation className={className} />
    if (t === 'stay') return <Hotel className={className} />
    if (t === 'food') return <Utensils className={className} />
    return <Camera className={className} />
}
