"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Compass, ArrowRight, Sparkles } from "lucide-react"
import { useAuth } from "@/components/auth/AuthProvider"
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const checkOnboardingAndRedirect = async (user: any) => {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid))
            if (userDoc.exists() && userDoc.data()?.onboardingCompleted) {
                router.push("/dashboard")
            } else {
                router.push("/onboarding")
            }
        } catch (error) {
            console.error("Error fetching user profile:", error)
            router.push("/onboarding") // Default to onboarding on error
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError("")
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            await checkOnboardingAndRedirect(result.user)
        } catch (error: any) {
            console.error("Login failed:", error)
            setError("Google sign-in failed. Please try again.")
            setLoading(false)
        }
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        if (!email || !password) {
            setError("Please fill in all fields.")
            setLoading(false)
            return
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            await checkOnboardingAndRedirect(result.user)
        } catch (err: any) {
            console.error(err)
            setLoading(false)
            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                setError("Invalid email or password.")
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many attempts. Please try again later.")
            } else {
                setError("Something went wrong. Please try again.")
            }
        }
    }

    return (
        <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#F2F6FF]">
            {/* Background Animations (Reused from Home) */}
            <div className="absolute inset-0 select-none overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <div className="bg-white/70 backdrop-blur-2xl border border-white/60 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-100">

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4">
                            <Compass className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome Back.</h1>
                        <p className="text-slate-500">Ready to plan your next adventure?</p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-14 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Continue with Google
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white/50 px-2 text-slate-400">Or continue with email</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleEmailLogin}>
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
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-70"
                                />
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="w-full px-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400 disabled:opacity-70"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-70"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Log In
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?
                        <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-700 ml-1 hover:underline">
                            Sign Up
                        </Link>
                    </div>

                </div>
            </motion.div>
        </main>
    )
}
