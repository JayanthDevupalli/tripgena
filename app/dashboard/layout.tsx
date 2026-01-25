"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    Map,
    Compass,
    User,
    LogOut,
    Menu,
    X,
    Sparkles,
    Search,
    Loader2
} from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"

const sidebarItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "My Trips", icon: Map, href: "/dashboard/trips" },
    { label: "Explore", icon: Compass, href: "/dashboard/explore" },
    { label: "Profile", icon: User, href: "/dashboard/profile" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login")
        }
    }, [user, loading, router])

    const handleLogout = async () => {
        await signOut(auth)
        router.replace("/")
    }

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 relative selection:bg-indigo-500/30 font-sans overflow-x-hidden">

            {/* --- Ambient Background Mesh --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[5%] w-[50vw] h-[50vw] bg-indigo-200/30 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-200/30 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] bg-purple-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
            </div>

            <div className="relative z-10 flex min-h-screen">

                {/* --- Desktop Glass Sidebar (Floating) --- */}
                <aside className="hidden md:flex flex-col w-72 p-4 fixed h-full pointer-events-none z-50">
                    <div className="bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] h-full flex flex-col p-6 pointer-events-auto transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
                        {/* Brand */}
                        <div className="flex items-center gap-4 mb-10 px-2 mt-2">
                            <div className="relative w-12 h-12">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl blur-lg opacity-40"></div>
                                <div className="relative w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white ring-1 ring-white/20">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">TripGena</span>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-600 font-bold mt-1.5">Pro Planner</p>
                            </div>
                        </div>

                        {/* Quick Search */}


                        {/* Navigation */}
                        <nav className="space-y-2 flex-1">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <div className="relative px-5 py-4 rounded-2xl group flex items-center gap-3 transition-all duration-300 overflow-hidden cursor-pointer">
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-white shadow-sm border border-slate-100 rounded-2xl"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <item.icon className={`w-5 h-5 relative z-10 transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                                            <span className={`font-bold text-sm relative z-10 transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`}>{item.label}</span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* User / Logout */}
                        <div className="mt-6 pt-6 border-t border-slate-200/50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 text-slate-500 hover:text-red-500 transition-all w-full px-5 py-3 hover:bg-red-50 rounded-2xl font-bold group text-sm"
                            >
                                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* --- Mobile Header --- */}
                <div className="md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-30 border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-900 tracking-tight">TripGena</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>

                {/* --- Mobile Menu --- */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="md:hidden fixed inset-0 top-16 bg-[#F8FAFC] z-20 p-6 space-y-4"
                        >
                            {sidebarItems.map((item) => (
                                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-white text-slate-900 font-bold border border-slate-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 hidden group-hover:block" />
                                        <item.icon className="w-6 h-6 text-indigo-600" />
                                        {item.label}
                                    </div>
                                </Link>
                            ))}
                            <Button variant="destructive" className="w-full h-14 mt-8 rounded-2xl text-lg font-bold shadow-lg shadow-red-200" onClick={handleLogout}>
                                Log Out
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- Main Content --- */}
                <main className="flex-1 md:pl-72 pt-20 md:pt-0 min-h-screen">
                    <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    )
}
