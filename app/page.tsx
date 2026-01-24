"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { ArrowRight, MapPin, Sparkles, Plane, Map, Wallet, Send, User, Compass, Menu, Search, Calendar, Star, CheckCircle2, Utensils, Tent, Hotel, Music, Coffee, Palmtree, Waves } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function Home() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  const PROMPT_TEXT = "Plan a 3-day trip to Goa under ₹6000 with friends. We love food and beaches."
  const TYPING_SPEED = 40

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20)
  })

  useEffect(() => {
    // Reset typing on mount
    setDisplayText("")
    setIsTyping(true)

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex <= PROMPT_TEXT.length) {
        setDisplayText(PROMPT_TEXT.slice(0, currentIndex))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, TYPING_SPEED)

    return () => clearInterval(interval)
  }, [])



  return (
    <main className="min-h-screen bg-[#F2F6FF] selection:bg-indigo-500/30 text-slate-900 overflow-x-hidden">

      {/* --- Navbar --- */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out",
          scrolled ? "pt-4" : "pt-0"
        )}
      >
        <motion.nav
          initial={{ width: "100%", borderRadius: "0px", y: 0 }}
          animate={{
            width: scrolled ? "90%" : "100%",
            maxWidth: scrolled ? "1024px" : "100%",
            borderRadius: scrolled ? "9999px" : "0px",
            y: 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "flex items-center justify-between px-6 py-4 md:px-10 transition-all duration-300",
            scrolled
              ? "bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5"
              : "bg-transparent border-b border-transparent"
          )}
        >
          <div className="flex items-center gap-2">
            <div className={cn("p-2 rounded-xl transition-all duration-300", scrolled ? "bg-indigo-50" : "bg-white/40 backdrop-blur-sm")}>
              <Compass className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Trip<span className="text-indigo-600">Gena</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {["Features", "Live Demo", "How it Works"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="hover:text-indigo-600 transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 hidden sm:block">
              Log in
            </Link>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-600/20">
              Start Planning
            </Button>
          </div>
        </motion.nav>
      </motion.header>

      {/* --- Hero Section --- */}
      <section className="relative min-h-[110vh] flex flex-col justify-center items-center overflow-hidden pt-32 pb-20">

        {/* Animated Background Elements */}
        <div className="absolute inset-0 select-none overflow-hidden pointer-events-none">
          {/* Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
          <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* 3D Globe Wireframe (SVG) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none">
            <svg viewBox="0 0 800 800" className="w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] animate-spin-slow text-indigo-300 fill-none stroke-current stroke-[0.5]">
              <circle cx="400" cy="400" r="300" />
              <ellipse cx="400" cy="400" rx="300" ry="100" />
              <ellipse cx="400" cy="400" rx="300" ry="200" transform="rotate(45 400 400)" />
              <ellipse cx="400" cy="400" rx="300" ry="200" transform="rotate(-45 400 400)" />
              <path d="M400 100 V 700" />
              <path d="M100 400 H 700" />
              <path d="M400 100 Q 600 200 600 400 Q 600 600 400 700" />
              <path d="M400 100 Q 200 200 200 400 Q 200 600 400 700" />
            </svg>
          </div>
        </div>

        <div className="container relative z-10 px-4 mx-auto text-center perspective-[1000px]">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-slate-600 text-sm font-medium mb-8 shadow-sm hover:scale-105 transition-transform cursor-pointer"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AI-Powered Travel OS
          </motion.div>

          {/* Staggered Typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1] flex flex-wrap justify-center gap-x-4">
            <div className="flex flex-wrap justify-center gap-x-4">
              {["Values", "Memories,"].map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: i * 0.15, duration: 0.8 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="relative inline-block w-full text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="inline-block"
              >
                Not Just Destinations.
              </motion.span>
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                className="absolute w-full h-3 -bottom-1 left-0 text-indigo-400 opacity-60"
                viewBox="0 0 200 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.00025 7.00001C45.2952 0.702738 126.331 -2.7121 198.001 3.50002" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </motion.svg>
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed"
          >
            The first travel OS that understands your <span className="font-semibold text-slate-800">budget constraints</span>, <span className="font-semibold text-slate-800">busy schedule</span>, and <span className="font-semibold text-slate-800">wanderlust</span>.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 group transition-all hover:scale-105">
              Start Planning Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white/60 hover:bg-white border-white/60 backdrop-blur-sm transition-all hover:scale-105">
              <MapPin className="mr-2 w-5 h-5 text-indigo-500" />
              Explore Demo
            </Button>
          </div>
        </div>

        {/* Floating Cards - 3 Elements for Balance */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute left-[5%] top-[60%] md:top-[40%] hidden xl:block"
        >
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/60 rotate-[-6deg] hover:rotate-0 transition-transform duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                <Utensils className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Budget</p>
                <p className="font-bold text-slate-800">Under ₹5k</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute right-[5%] top-[65%] md:top-[50%] hidden xl:block"
        >
          <div className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/60 rotate-[6deg] hover:rotate-0 transition-transform duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                <Waves className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Vibe</p>
                <p className="font-bold text-slate-800">Adventure</p>
              </div>
            </div>
          </div>
        </motion.div>



      </section>

      {/* --- Social Proof: Infinite Marquee --- */}
      <section className="py-12 border-y border-slate-200 bg-white/50 backdrop-blur-sm overflow-hidden">
        <div className="container mx-auto px-4 mb-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted by explorers everywhere</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-scroll whitespace-nowrap flex gap-12 sm:gap-20 items-center">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-12 sm:gap-20 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {["Backpackers", "Couples", "Solo Travelers", "Digital Nomads", "Foodies", "Weekend Warriors", "Adventure Seekers", "Luxury Lovers"].map((item) => (
                  <span key={item} className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300" /> {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F2F6FF] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F2F6FF] to-transparent" />
        </div>
      </section>

      {/* --- Restyled Live Demo Section (Preserved) --- */}
      <section id="live-demo" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Just Ask. <span className="text-indigo-600">We Calculate Everything.</span>
            </h2>
            <p className="text-lg text-slate-600">
              Type your dream trip in plain English. Our AI handles the logistics like a pro travel agent.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Window Container */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="rounded-3xl overflow-hidden shadow-2xl bg-white border border-slate-200"
            >
              {/* Window Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="px-3 py-1 rounded-md bg-slate-200/50 text-xs font-medium text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> TripGena Planner 1.0
                </div>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Window Body */}
              <div className="flex flex-col md:flex-row h-[500px] md:h-[600px]">

                {/* Left Panel: Chat */}
                <div className="w-full md:w-5/12 bg-slate-50 p-6 flex flex-col border-r border-slate-200">
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4 scrollbar-hide">
                    {/* Bot Welcome */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="bg-white border-slate-200 border p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700">
                        Hey there! Where are we going today?
                      </div>
                    </div>

                    {/* User Prompt */}
                    <div className="flex gap-3 justify-end">
                      <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md text-sm max-w-[85%]">
                        {displayText}
                        {isTyping && <span className="animate-pulse">|</span>}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>

                    {/* Bot Response (Conditional) */}
                    {!isTyping && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="bg-white border-slate-200 border p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-700 w-full">
                          <p className="mb-2 flex items-center gap-2">Found it! <Palmtree className="w-4 h-4 text-emerald-600" /> Goa trip under ₹6k.</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                              <span className="text-slate-500">Duration</span>
                              <span className="font-medium text-slate-800">3 Days</span>
                            </div>
                            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                              <span className="text-slate-500">Budget</span>
                              <span className="font-medium text-green-600">₹5,800 / person</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Input Simulation */}
                  <div className="relative">
                    <input
                      disabled
                      placeholder={isTyping ? "Typing..." : "Ask follow up..."}
                      className="w-full bg-white border border-slate-200 rounded-full pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
                    />
                    <div className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-full text-white">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Right Panel: Visual Results */}
                <div className="w-full md:w-7/12 bg-white relative overflow-hidden">
                  {!isTyping ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="h-full flex flex-col"
                    >
                      {/* Map / Itinerary Visualization */}
                      <div className="h-1/2 bg-slate-100 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2835&auto=format&fit=crop')] bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <h3 className="text-white font-bold text-2xl">Goa, India</h3>
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-lg">
                          Match: 98%
                        </div>
                      </div>

                      <div className="h-1/2 p-6 overflow-y-auto bg-slate-50/50">
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-600" /> Itinerary Highlights
                        </h4>

                        <div className="space-y-3">
                          {/* Item 1 */}
                          <div className="relative pl-6 border-l-2 border-indigo-200 pb-4 last:pb-0">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-indigo-200 bg-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 mb-1">DAY 1 • MORNING</p>
                            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex gap-3">
                              <div className="w-12 h-12 bg-indigo-50 rounded-md flex items-center justify-center text-xl">
                                <Hotel className="w-6 h-6 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-slate-800">Check-in at Zostel Goa</p>
                                <p className="text-xs text-slate-500">₹800/night • Near Calangute</p>
                              </div>
                            </div>
                          </div>

                          {/* Item 2 */}
                          <div className="relative pl-6 border-l-2 border-indigo-200">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-indigo-200 bg-white flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 mb-1">DAY 1 • EVENING</p>
                            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex gap-3">
                              <div className="w-12 h-12 bg-orange-50 rounded-md flex items-center justify-center text-xl">
                                <Utensils className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm text-slate-800">Dinner at Fisherman's Wharf</p>
                                <p className="text-xs text-slate-500">Avg ₹400/person • Live Music</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                      <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
                      <p className="text-sm font-medium">Analyzing budget & preferences...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Features Bento Grid --- */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Built for the Modern Explorer.</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">No more spreadsheets. No more "too expensive" cancellations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1: Large */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 bg-indigo-600 rounded-3xl p-8 md:p-12 relative overflow-hidden text-white shadow-xl shadow-indigo-200"
            >
              <div className="relative z-10 max-w-sm">
                <div className="bg-white/20 backdrop-blur w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Budget-First Engine</h3>
                <p className="text-indigo-100 leading-relaxed text-lg">Set your total cap (e.g., ₹5000), and we reverse-engineer the perfect trip. We prioritize value over luxury without sacrificing fun.</p>
              </div>
              {/* Abstract shape */}
              <div className="absolute right-0 bottom-0 opacity-20 translate-x-1/4 translate-y-1/4">
                <div className="w-64 h-64 rounded-full border-[20px] border-white/30" />
                <div className="w-48 h-48 rounded-full border-[20px] border-white/30 absolute inset-0 m-auto" />
              </div>
            </motion.div>

            {/* Feature 2: Tall */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg relative overflow-hidden"
            >
              <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-time Adapting</h3>
              <p className="text-slate-500 mb-8">Train delayed? Rain started? One tap recalculates everything instantly.</p>
              {/* Visual decor */}
              <div className="absolute bottom-0 left-0 right-0 bg-slate-50/50 h-32 border-t border-slate-100 flex flex-col p-4 gap-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Old Plan</span>
                  <span className="line-through">Beach Day</span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-orange-600 bg-orange-50 p-2 rounded-lg">
                  <span>New Plan</span>
                  <span className="flex items-center gap-1">Cafe Hop <Coffee className="w-3 h-3" /></span>
                </div>
              </div>
            </motion.div>

            {/* Feature 3: Standard */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg"
            >
              <div className="bg-cyan-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Map className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Visual Mapping</h3>
              <p className="text-slate-500">See your friends' live locations and plan routes visually.</p>
            </motion.div>

            {/* Feature 4: Standard, Dark */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 bg-slate-900 rounded-3xl p-8 md:p-10 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl"
            >
              <div className="flex-1">
                <div className="bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Hidden Gems Mode</h3>
                <p className="text-slate-300">Unlock spots only locals know about. Avoid tourist traps and save money while discovering the authentic vibe.</p>
              </div>
              <div className="w-full md:w-1/3 aspect-video bg-slate-800 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white/80" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Testimonials: Vibe Check --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm bg-indigo-50 px-3 py-1 rounded-full">Community</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-4">Vibe Check Passed <CheckCircle2 className="w-8 h-8 text-green-500 inline" /></h2>
        </div>

        <div className="relative w-full">
          <div className="flex animate-scroll gap-6 px-4 w-max hover:pause-scroll">
            {/* Review Cards (Duplicated for infinite scroll illusion) */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-80 p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                  <div className="flex items-center gap-1 text-yellow-500 mb-3">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-slate-700 italic mb-4">"Saved us ₹4000 on our Manali trip just by suggesting better hostel timings. Insane."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Rahul K.</p>
                      <p className="text-xs text-slate-500">Adventure Enthusiast</p>
                    </div>
                  </div>
                </div>

                <div className="w-80 p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                  <div className="flex items-center gap-1 text-yellow-500 mb-3">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-slate-700 italic mb-4">"The itinerary visualizer is a game changer. Finally got my group to agree on a plan!"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Sneha P.</p>
                      <p className="text-xs text-slate-500">Solo Traveller</p>
                    </div>
                  </div>
                </div>

                <div className="w-80 p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                  <div className="flex items-center gap-1 text-yellow-500 mb-3">
                    <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-slate-700 italic mb-4">"Hidden Gems mode found a cafe in Gokarna that wasn't on Google Maps. Best food ever."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Arjun M.</p>
                      <p className="text-xs text-slate-500">Digital Nomad</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
        </div>
      </section>

      {/* --- Mega CTA --- */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="rounded-[3rem] bg-slate-900 relative overflow-hidden px-6 py-20 md:py-32 text-center">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight">
                Stop Dreaming. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Start Packing.</span>
              </h2>
              <p className="text-slate-400 text-xl max-w-xl mx-auto">
                Join 10,000+ travellers planning their next escape with TripGena. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="xl" className="h-16 px-10 text-xl rounded-full bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 transition-all shadow-xl shadow-white/10 font-bold">
                  Get Started for Free
                </Button>
              </div>
              <p className="text-slate-500 text-sm mt-4">Available on Web, iOS & Android</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer (Updated) --- */}
      <footer className="py-12 border-t border-slate-200 bg-slate-50 text-slate-500">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-600" />
              <span className="text-xl font-bold text-slate-800">TripGena</span>
            </div>
            <p className="text-sm">The intelligent travel OS.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-600">Features</a></li>
              <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-600">About</a></li>
              <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-600">Privacy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center text-sm">
          © 2026 TripGena Inc.
        </div>
      </footer>

    </main>
  )
}
