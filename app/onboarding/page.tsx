"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useAuth } from "@/components/auth/AuthProvider"
import { ArrowRight, Wallet, Map, Sparkles, CheckCircle2, ChevronRight, Mountain, Palmtree, PartyPopper, Landmark, Coffee, Camera, Tent, Music, Utensils, ShoppingBag } from "lucide-react"

// Types
type OnboardingData = {
    budget: number
    style: string
    interests: string[]
}

export default function OnboardingPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState<OnboardingData>({
        budget: 5000,
        style: "",
        interests: []
    })

    // Variants for smooth slide transitions
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            filter: "blur(10px)",
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            filter: "blur(0px)",
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            filter: "blur(10px)",
        })
    }

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            if (!user) return
            setLoading(true)
            try {
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    preferences: data,
                    onboardingCompleted: true,
                    createdAt: serverTimestamp()
                })
                router.push("/dashboard")
            } catch (error) {
                console.error("Error saving profile:", error)
                setLoading(false)
            }
        }
    }

    return (
        <main className="min-h-screen bg-[#F5F5F7] text-slate-900 flex items-center justify-center p-6 font-sans selection:bg-indigo-500/20">

            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-100/50 rounded-full blur-[100px] mix-blend-multiply" />
            </div>

            <div className="w-full max-w-2xl relative z-10">

                {/* Header / Progress */}
                <div className="flex items-center justify-between mb-12 px-2">
                    <div className="flex gap-2">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={false}
                                animate={{
                                    width: step === i ? 32 : 8,
                                    backgroundColor: step >= i ? "#4F46E5" : "#E2E8F0"
                                }}
                                className="h-2 rounded-full transition-colors"
                            />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Step {step} of 3
                    </span>
                </div>

                {/* Content Card */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait" custom={1}>
                        {step === 1 && (
                            <StepBudget key="step1" value={data.budget} onChange={(val: number) => setData({ ...data, budget: val })} variants={slideVariants} />
                        )}
                        {step === 2 && (
                            <StepStyle key="step2" selected={data.style} onSelect={(val: string) => setData({ ...data, style: val })} variants={slideVariants} />
                        )}
                        {step === 3 && (
                            <StepInterests key="step3" selected={data.interests} onToggle={(val: string) => {
                                const newInterests = data.interests.includes(val)
                                    ? data.interests.filter(i => i !== val)
                                    : [...data.interests, val]
                                setData({ ...data, interests: newInterests })
                            }} variants={slideVariants} />
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <motion.div
                    layout
                    className="mt-12 flex justify-end"
                >
                    <Button
                        onClick={handleNext}
                        disabled={loading || (step === 2 && !data.style) || (step === 3 && data.interests.length === 0)}
                        className="h-14 pl-8 pr-6 rounded-full bg-slate-900 text-white font-medium text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 group"
                    >
                        {loading ? "Finalizing..." : step === 3 ? "Complete Profile" : "Continue"}
                        {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                </motion.div>

            </div>
        </main>
    )
}

// --- Premium Sub-components ---

function StepBudget({ value, onChange, variants }: any) {
    return (
        <motion.div
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-10"
        >
            <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                    Set your cap.
                </h2>
                <p className="text-xl text-slate-500 font-medium">
                    We'll optimize every rupee to get you the best experience possible.
                </p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-200/50">
                <div className="flex items-baseline justify-center gap-1 mb-8">
                    <span className="text-2xl text-slate-400 font-medium">₹</span>
                    <span className="text-6xl font-black text-slate-900 tracking-tighter">
                        {value.toLocaleString()}
                    </span>
                </div>

                <div className="relative h-12 flex items-center">
                    <input
                        type="range"
                        min="2000"
                        max="50000"
                        step="1000"
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700 transition-all"
                    />
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">
                    <span>Backpacker (₹2k)</span>
                    <span>Luxury (₹50k+)</span>
                </div>
            </div>
        </motion.div>
    )
}

const styles = [
    { id: "adventure", icon: Mountain, label: "Adventure", color: "text-orange-500", bg: "bg-orange-50", desc: "Trekking, camping, thrills" },
    { id: "chill", icon: Palmtree, label: "Chill", color: "text-cyan-500", bg: "bg-cyan-50", desc: "Beaches, resorts, peace" },
    { id: "party", icon: PartyPopper, label: "Party", color: "text-purple-500", bg: "bg-purple-50", desc: "Clubs, concerts, nightlife" },
    { id: "culture", icon: Landmark, label: "Culture", color: "text-amber-500", bg: "bg-amber-50", desc: "History, art, museums" },
]

function StepStyle({ selected, onSelect, variants }: any) {
    return (
        <motion.div
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-10"
        >
            <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                    Define your vibe.
                </h2>
                <p className="text-xl text-slate-500 font-medium">
                    What creates the perfect memory for you?
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {styles.map((s) => {
                    const isSelected = selected === s.id
                    return (
                        <motion.div
                            key={s.id}
                            onClick={() => onSelect(s.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-6 rounded-[1.5rem] cursor-pointer transition-all duration-300 border ${isSelected ? "bg-white border-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-indigo-600" : "bg-white/50 border-white hover:bg-white hover:shadow-lg hover:shadow-slate-200/50"}`}
                        >
                            <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center mb-4 transition-colors`}>
                                <s.icon className={`w-6 h-6 ${s.color}`} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{s.label}</h3>
                            <p className="text-sm text-slate-500">{s.desc}</p>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}

const interestsList = [
    { id: "food", label: "Street Food", icon: Utensils },
    { id: "nature", label: "Nature", icon: Mountain },
    { id: "cafe", label: "Cafes", icon: Coffee },
    { id: "photo", label: "Photography", icon: Camera },
    { id: "music", label: "Music", icon: Music },
    { id: "shop", label: "Shopping", icon: ShoppingBag },
    { id: "camp", label: "Camping", icon: Tent },
    { id: "art", label: "Art", icon: Sparkles },
]

function StepInterests({ selected, onToggle, variants }: any) {
    return (
        <motion.div
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-10"
        >
            <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                    Curate your feed.
                </h2>
                <p className="text-xl text-slate-500 font-medium">
                    Select the things that make you happy.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interestsList.map((item) => {
                    const isSelected = selected.includes(item.id)
                    return (
                        <motion.div
                            key={item.id}
                            onClick={() => onToggle(item.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border ${isSelected ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white border-white text-slate-500 hover:bg-white hover:shadow-lg hover:text-slate-900"}`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-xs font-semibold">{item.label}</span>
                        </motion.div>
                    )
                })}
            </div>
        </motion.div>
    )
}
