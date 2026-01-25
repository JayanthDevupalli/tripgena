"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, MapPin, CloudSun, TrainFront, Sparkles } from "lucide-react"

const loadingStates = [
    { text: "Analyzing your request...", icon: Sparkles },
    { text: "Scanning map for destinations...", icon: MapPin },
    { text: "Checking real-time weather...", icon: CloudSun },
    { text: "Comparing train vs bus costs...", icon: TrainFront },
    { text: "Designing your itinerary...", icon: Sparkles },
]

export function PlannerLoader() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % loadingStates.length)
        }, 1200)
        return () => clearInterval(timer)
    }, [])

    const CurrentIcon = loadingStates[index].icon

    return (
        <div className="flex flex-col items-center justify-center p-8 w-full">
            <div className="w-16 h-16 bg-white/50 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg mb-6 relative">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <CurrentIcon className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>

            <div className="h-8 relative w-full flex justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-slate-600 font-medium text-sm absolute"
                    >
                        {loadingStates[index].text}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>
    )
}
