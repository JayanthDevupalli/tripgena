"use client"

import { useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import {
    Wallet, Compass, Star, UserCircle, Mail, Shield, Edit2, X, Save,
    Leaf, AlertCircle, Quote, Zap, Users, Map, Hotel, Car, Train, Bus
} from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion, AnimatePresence } from "framer-motion"

// --- Constants & Options ---
const PREFERENCES_OPTIONS = {
    pace: [
        { id: "Relaxed", label: "Relaxed", icon: "☕" },
        { id: "Moderate", label: "Moderate", icon: "⚖️" },
        { id: "Fast", label: "Packed", icon: "⚡" },
    ],
    companions: [
        { id: "Solo", label: "Solo", icon: "👤" },
        { id: "Couple", label: "Couple", icon: "❤️" },
        { id: "Family", label: "Family", icon: "👨‍👩‍👧‍👦" },
        { id: "Friends", label: "Friends", icon: "👯" },
    ],
    accommodation: [
        { id: "Hotel", label: "Hotel", icon: "🏨" },
        { id: "Hostel", label: "Hostel", icon: "🛏️" },
        { id: "Resort", label: "Resort", icon: "🌴" },
        { id: "Airbnb", label: "Rental", icon: "🏠" },
    ],
    transportation: [
        { id: "Public", label: "Public", icon: "🚌" },
        { id: "Car", label: "Rental Car", icon: "🚗" },
        { id: "Walking", label: "Walking", icon: "👣" },
    ],
    interests: [
        "Nature", "History", "Food", "Art", "Adventure", "Nightlife",
        "Shopping", "Relaxation", "Photography", "Culture"
    ]
}

export default function ProfilePage() {
    const { profile, loading } = useUserProfile()
    const { user } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<any>({})
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.displayName,
                bio: profile.preferences?.bio || "",
                // Vitals
                budget: profile.preferences?.budget || 5000,
                dietary: profile.preferences?.dietary || "Veg",
                allergies: profile.preferences?.allergies || "",
                // Travel DNA (New)
                pace: profile.preferences?.pace || "Moderate",
                companions: profile.preferences?.companions || "Solo",
                accommodation: profile.preferences?.accommodation || "Hotel",
                transportation: profile.preferences?.transportation || "Public",
                interests: profile.preferences?.interests || []
            })
        }
    }, [profile])

    const handleSave = async () => {
        if (!user) return
        setSaving(true)
        try {
            const userRef = doc(db, "users", user.uid)
            await updateDoc(userRef, {
                displayName: formData.displayName,
                "preferences.bio": formData.bio,
                "preferences.budget": Number(formData.budget),
                "preferences.dietary": formData.dietary,
                "preferences.allergies": formData.allergies,
                // New Fields
                "preferences.pace": formData.pace,
                "preferences.companions": formData.companions,
                "preferences.accommodation": formData.accommodation,
                "preferences.transportation": formData.transportation,
                "preferences.interests": formData.interests
            })
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Failed to update profile.")
        } finally {
            setSaving(false)
        }
    }

    const toggleInterest = (interest: string) => {
        setFormData((prev: any) => {
            const current = prev.interests || []
            if (current.includes(interest)) {
                return { ...prev, interests: current.filter((i: string) => i !== interest) }
            } else {
                return { ...prev, interests: [...current, interest] }
            }
        })
    }

    if (loading) return null

    // Helper for Bento Cards
    const BentoCard = ({ children, className = "", delay = 0 }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl overflow-hidden relative ${className}`}
        >
            {children}
        </motion.div>
    )

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your travel identity & preferences</p>
                </div>
                <Button
                    onClick={() => setIsEditing(true)}
                    className="rounded-full bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800 px-6 py-6 transition-transform hover:scale-105"
                >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
            </div>

            {/* --- Bento Grid Layout --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-max">

                {/* 1. Hero / Identity Card (Span 2 cols) */}
                <BentoCard className="md:col-span-2 p-8 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-indigo-50/80 to-white">
                    <div className="relative shrink-0">
                        <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-200 ring-4 ring-white">
                            {profile?.displayName?.charAt(0) || "U"}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full ring-4 ring-white shadow-lg">
                            <Shield className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-3xl font-black text-slate-900">{profile?.displayName}</h2>
                        <p className="text-slate-400 font-semibold flex items-center justify-center md:justify-start gap-2 mt-1 mb-4">
                            <Mail className="w-4 h-4" /> {user?.email}
                        </p>
                        {profile?.preferences?.bio ? (
                            <p className="text-sm text-slate-600 italic leading-relaxed bg-white/50 p-3 rounded-2xl border border-indigo-50">
                                "{profile.preferences.bio}"
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 italic">No bio added yet.</p>
                        )}
                    </div>
                </BentoCard>

                {/* 2. Budget Card (Span 1) */}
                <BentoCard className="md:col-span-1 p-6 bg-gradient-to-br from-emerald-50/80 to-white flex flex-col justify-between group" delay={0.1}>
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-emerald-100/50 rounded-2xl text-emerald-600">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <span className="bg-white px-2 py-1 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-slate-100">Budget</span>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-slate-900 mt-4 group-hover:scale-105 transition-transform origin-left">
                            ₹{(profile?.preferences?.budget || 0).toLocaleString()}
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1">Per Trip Target</p>
                    </div>
                </BentoCard>

                {/* 3. Travel Vitals (Diet/Allergy) (Span 1) */}
                <BentoCard className="md:col-span-1 p-6 bg-gradient-to-br from-rose-50/80 to-white flex flex-col gap-4" delay={0.2}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-green-600"><Leaf className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Dietary</p>
                            <p className="font-bold text-slate-900">{profile?.preferences?.dietary || "Not Set"}</p>
                        </div>
                    </div>
                    <div className="w-full h-px bg-rose-100/50" />
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm text-red-500"><AlertCircle className="w-5 h-5" /></div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Allergies</p>
                            <p className="font-bold text-slate-900 truncate w-24" title={profile?.preferences?.allergies}>{profile?.preferences?.allergies || "None"}</p>
                        </div>
                    </div>
                </BentoCard>

                {/* 4. Travel DNA - Style & Company (Span 2) */}
                <BentoCard className="md:col-span-2 p-6 flex flex-col justify-between relative overflow-hidden" delay={0.3}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -mr-20 -mt-20"></div>
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-indigo-500" />
                        Travel Style DNA
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Pace</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                    {PREFERENCES_OPTIONS.pace.find(p => p.id === profile?.preferences?.pace)?.icon || "⚖️"}
                                </span>
                                <span className="font-bold text-slate-900">{profile?.preferences?.pace || "Moderate"}</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Companions</p>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                    {PREFERENCES_OPTIONS.companions.find(c => c.id === profile?.preferences?.companions)?.icon || "👤"}
                                </span>
                                <span className="font-bold text-slate-900">{profile?.preferences?.companions || "Solo"}</span>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* 5. Logistics (Span 1) */}
                <BentoCard className="md:col-span-1 p-6 bg-gradient-to-br from-cyan-50/80 to-white flex flex-col relative overflow-hidden group" delay={0.4}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Map className="w-20 h-20 text-cyan-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 relative z-10">
                        <div className="p-2 bg-cyan-100/50 rounded-xl text-cyan-600">
                            <Map className="w-4 h-4" />
                        </div>
                        Logistics
                    </h3>
                    <div className="space-y-4 relative z-10 mt-auto">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accommodation</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg">{PREFERENCES_OPTIONS.accommodation.find(a => a.id === profile?.preferences?.accommodation)?.icon || "🏨"}</span>
                                <p className="text-lg font-bold text-slate-900">{profile?.preferences?.accommodation || "Hotel"}</p>
                            </div>
                        </div>
                        <div className="w-full h-px bg-cyan-100/50" />
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transportation</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg">{PREFERENCES_OPTIONS.transportation.find(t => t.id === profile?.preferences?.transportation)?.icon || "🚌"}</span>
                                <p className="text-lg font-bold text-slate-900">{profile?.preferences?.transportation || "Public"}</p>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* 6. Interests (Span 1 + ) */}
                <BentoCard className="md:col-span-1 md:row-span-1 p-6 flex flex-col" delay={0.5}>
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-orange-500" /> Passions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {profile?.preferences?.interests?.slice(0, 5).map((interest: string) => (
                            <span key={interest} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100">
                                {interest}
                            </span>
                        ))}
                        {(profile?.preferences?.interests?.length || 0) > 5 && (
                            <span className="px-2 py-1 text-slate-400 text-xs font-bold">+{(profile?.preferences?.interests?.length || 0) - 5} more</span>
                        )}
                    </div>
                </BentoCard>

            </div>

            {/* Logout Section */}
            <div className="flex justify-center pt-10 px-4">
                <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold opacity-70 hover:opacity-100 transition-opacity">
                    Log Out of Account
                </Button>
            </div>

            {/* --- Enhanced Edit Modal --- */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsEditing(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Edit Profile</h3>
                                    <p className="text-sm text-slate-500 font-medium">Update your traveler DNA</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="rounded-full hover:bg-slate-100">
                                    <X className="w-6 h-6 text-slate-400" />
                                </Button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                                {/* Section: Identity */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Identity</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Display Name</label>
                                            <input
                                                type="text"
                                                value={formData.displayName}
                                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Bio</label>
                                            <input
                                                type="text"
                                                maxLength={60}
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                placeholder="Brief tagline..."
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Travel Preferences */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Travel Style</h4>

                                    {/* Pace Selector */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Travel Pace</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {PREFERENCES_OPTIONS.pace.map((p) => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => setFormData({ ...formData, pace: p.id })}
                                                    className={`p-3 rounded-xl border-2 text-left transition-all ${formData.pace === p.id
                                                        ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                                                        : "border-slate-100 bg-white hover:border-slate-300"
                                                        }`}
                                                >
                                                    <div className="text-xl mb-1">{p.icon}</div>
                                                    <div className="text-xs font-bold text-slate-900">{p.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Companions Selector */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Usual Companions</label>
                                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                            {PREFERENCES_OPTIONS.companions.map((c) => (
                                                <button
                                                    key={c.id}
                                                    onClick={() => setFormData({ ...formData, companions: c.id })}
                                                    className={`px-4 py-3 rounded-xl border min-w-[100px] text-center transition-all ${formData.companions === c.id
                                                        ? "bg-slate-900 text-white border-slate-900"
                                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                        }`}
                                                >
                                                    <div className="text-lg mb-1">{c.icon}</div>
                                                    <div className="text-xs font-bold">{c.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Logistics */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Logistics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Accommodation</label>
                                            <select
                                                value={formData.accommodation}
                                                onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                                            >
                                                {PREFERENCES_OPTIONS.accommodation.map(a => <option key={a.id} value={a.id}>{a.icon} {a.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Transport</label>
                                            <select
                                                value={formData.transportation}
                                                onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                                            >
                                                {PREFERENCES_OPTIONS.transportation.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Passions */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Passions & Interests</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {PREFERENCES_OPTIONS.interests.map((interest) => (
                                            <button
                                                key={interest}
                                                onClick={() => toggleInterest(interest)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${formData.interests?.includes(interest)
                                                    ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200"
                                                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Section: Vitals */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Daily Budget (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.budget}
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Allergies</label>
                                            <input
                                                type="text"
                                                value={formData.allergies}
                                                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-900"
                                                placeholder="None"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-white sticky bottom-0 z-20">
                                <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl font-bold text-slate-500">Cancel</Button>
                                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-indigo-200">
                                    {saving ? "Saving..." : "Save Preferences"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
