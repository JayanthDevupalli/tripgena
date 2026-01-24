"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Compass, ArrowRight, Sparkles, UserPlus } from "lucide-react"
import { useState } from "react"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleGoogleRegister = async () => {
        setLoading(true)
        setError("")
        try {
            const provider = new GoogleAuthProvider()
            await signInWithPopup(auth, provider)
            router.push("/onboarding")
        } catch (error: any) {
            console.error("Registration failed:", error)
            setError("Google sign-up failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!fullName || !email || !password) {
            setError("Please fill in all fields.")
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            setLoading(false)
            return
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            // Update profile with full name
            await updateProfile(userCredential.user, {
                displayName: fullName
            })
            router.push("/onboarding")
        } catch (err: any) {
            console.error(err)
            if (err.code === "auth/email-already-in-use") {
                setError("Email is already registered. Try logging in.")
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email address.")
            } else {
                setError("Something went wrong. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#F2F6FF]">
            {/* Background Animations */}
            <div className="absolute inset-0 select-none overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <div className="bg-white/70 backdrop-blur-2xl border border-white/60 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-cyan-50 rounded-2xl mb-4">
                            <UserPlus className="w-8 h-8 text-cyan-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Join the Club.</h1>
                        <p className="text-slate-500">Your smart travel companion awaits.</p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={handleGoogleRegister}
                            disabled={loading}
                            className="w-full h-14 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Sign up with Google
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white/50 px-2 text-slate-400">Or sign up with email</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleEmailRegister}>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium border border-red-100"
                                >
                                    {error}
                                </motion.div>
                            )}
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-70"
                                />
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-70"
                                />
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="password"
                                    placeholder="Create Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-70"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200 disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?
                        <Link href="/login" className="font-bold text-cyan-600 hover:text-cyan-700 ml-1 hover:underline">
                            Log In
                        </Link>
                    </div>

                </div>
            </motion.div>
        </main>
    )
}
