"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Star, Navigation, Camera, Utensils, Hotel, ArrowDown, CheckCircle2, Circle } from "lucide-react"

export function LiveItineraryTimeline({ activities }: { activities: any[] }) {
    if (!activities || activities.length === 0) return null

    return (
        <div className="relative py-4 pl-4">
            {/* Continuous Vertical Line - Elegant & Thin */}
            <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-indigo-100/50" />

            <div className="space-y-8">
                {activities.map((act, index) => (
                    <TimelineItem key={index} activity={act} index={index} isLast={index === activities.length - 1} />
                ))}
            </div>

            {/* End of Day Marker - Minimalist */}
            <div className="relative flex items-center gap-4 mt-8 opacity-40 hover:opacity-100 transition-opacity">
                <div className="w-[54px] flex justify-center z-10">
                    <div className="w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of Day</p>
            </div>
        </div>
    )
}

function TimelineItem({ activity, index, isLast }: { activity: any, index: number, isLast: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative grid grid-cols-[auto_1fr] gap-6 group"
        >
            {/* Time Node - The 'Royal' Anchor */}
            <div className="relative z-10 flex flex-col items-center">
                <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center 
                    bg-white border text-indigo-600 shadow-sm transition-all duration-300
                    group-hover:border-indigo-200 group-hover:shadow-md group-hover:scale-105
                    ${index === 0 ? 'border-2 border-indigo-600 text-indigo-700 bg-indigo-50' : 'border-slate-100'}
                `}>
                    <ActivityIcon type={activity.type} className="w-6 h-6" />
                </div>
                {/* Time Display below icon for clean vertical rhythm */}
                <div className="mt-2 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded-md border border-slate-100 shadow-sm group-hover:text-indigo-500 group-hover:border-indigo-100 transition-colors">
                    {activity.time}
                </div>
            </div>

            {/* Card Content - Clean & Spacious */}
            <div className="relative pt-1 pb-4 border-b border-slate-50 last:border-0">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors leading-tight">
                            {activity.activity}
                        </h4>

                        {/* Location & Cost Tags */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                            {activity.locationName && (
                                <span className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[200px]">{activity.locationName}</span>
                                </span>
                            )}
                            {activity.cost > 0 && (
                                <span className="flex items-center gap-1 text-slate-400">
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span>₹{activity.cost}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Logistics / Notes - Elegant typography */}
                {activity.logistics && (
                    <div className="mt-3 text-sm leading-relaxed text-slate-600 pl-4 border-l-2 border-indigo-50 bg-slate-50/50 p-3 rounded-r-lg group-hover:bg-indigo-50/30 group-hover:border-indigo-200 transition-colors">
                        {activity.logistics}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

const ActivityIcon = ({ type, className }: { type: string, className?: string }) => {
    if (!type) return <Camera className={className} />
    const t = type.toLowerCase()

    // Premium Icon Mapping
    if (t.includes('travel') || t.includes('commute')) return <Navigation className={className} />
    if (t.includes('stay') || t.includes('check-in')) return <Hotel className={className} />
    if (t.includes('food') || t.includes('lunch') || t.includes('dinner')) return <Utensils className={className} />

    return <Camera className={className} />
}

