"use client"

import { useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { Wallet, Compass, Star, UserCircle, Mail, Shield, Edit2, X, Save, Leaf, AlertCircle, Quote } from "lucide-react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion, AnimatePresence } from "framer-motion"

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
                budget: profile.preferences?.budget || 5000,
                style: profile.preferences?.style || "General",
                dietary: profile.preferences?.dietary || "Veg",
                allergies: profile.preferences?.allergies || "",
                bio: profile.preferences?.bio || ""
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
                "preferences.budget": Number(formData.budget),
                "preferences.style": formData.style,
                "preferences.dietary": formData.dietary,
                "preferences.allergies": formData.allergies,
                "preferences.bio": formData.bio
            })
            setIsEditing(false)
        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Failed to update profile.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return null

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
                    <p className="text-slate-500">Manage your account and travel identity.</p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:bg-slate-800">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
            </div>

            {/* Top Section: Identity & Bio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-[100px] -mr-8 -mt-8 opacity-50" />

                    <div className="relative shrink-0">
                        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-200 ring-4 ring-white">
                            {profile?.displayName?.charAt(0) || "U"}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full ring-4 ring-white">
                            <Shield className="w-3 h-3" />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1 space-y-2">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{profile?.displayName}</h2>
                            <p className="text-sm text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1.5 mt-1">
                                <Mail className="w-3.5 h-3.5" /> {user?.email}
                            </p>
                        </div>

                        {profile?.preferences?.bio && (
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-sm text-slate-600 italic mt-2 flex gap-2">
                                <Quote className="w-4 h-4 text-slate-300 shrink-0" />
                                {profile.preferences.bio}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                                Pro Explorer
                            </span>
                            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 uppercase">
                                {profile?.preferences?.style || "General"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Traveler Vitals (New) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4" />
                    <h3 className="font-bold text-slate-900 border-b border-slate-50 pb-2 mb-2">Traveler Vitals</h3>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dietary</p>
                            <p className="font-bold text-slate-900">{profile?.preferences?.dietary || "Not Set"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Allergies</p>
                            <p className="font-bold text-slate-900">{profile?.preferences?.allergies || "None"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-24 h-24 text-slate-900" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 mb-1">Budget Limit / Trip</p>
                    <p className="text-4xl font-black text-slate-900">₹{profile?.preferences?.budget?.toLocaleString()}</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-slate-900 w-3/4 rounded-full" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Star className="w-24 h-24 text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-4">Core Interests</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile?.preferences?.interests?.map((interest: string) => (
                            <span key={interest} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                                {interest}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
                <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold">
                    Log Out of Account
                </Button>
            </div>

            {/* --- Edit Modal --- */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsEditing(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-black text-slate-900">Edit Profile</h3>
                                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                                    <X className="w-5 h-5 text-slate-400" />
                                </Button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Limit (₹)</label>
                                        <input
                                            type="number"
                                            value={formData.budget}
                                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Travel Style</label>
                                        <select
                                            value={formData.style}
                                            onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                                        >
                                            <option value="General">General</option>
                                            <option value="Backpacker">Backpacker</option>
                                            <option value="Luxury">Luxury</option>
                                            <option value="Adventure">Adventure</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dietary Preference</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {["Veg", "Non-Veg", "Vegan", "Other"].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData({ ...formData, dietary: opt })}
                                                className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all ${formData.dietary === opt ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allergies / Restrictions</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Peanuts, Gluten..."
                                        value={formData.allergies}
                                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mini Bio</label>
                                    <textarea
                                        placeholder="What kind of traveler are you?"
                                        rows={3}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6">
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
