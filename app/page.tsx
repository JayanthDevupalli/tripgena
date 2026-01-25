"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { ArrowRight, MapPin, Sparkles, Plane, Map, Wallet, Send, User, Compass, Menu, Search, Calendar, Star, CheckCircle2, Utensils, Tent, Hotel, Music, Coffee, Palmtree, Waves, Mountain, Camera, Zap } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// --- Components ---

const FloatingCard = ({ icon: Icon, title, subtitle, className, delay }: { icon: any, title: string, subtitle: string, className?: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: "backOut" }}
    className={cn(
      "absolute p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl flex items-center gap-3 select-none pointer-events-none hover:scale-105 transition-transform",
      className
    )}
  >
    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
      <Icon className="w-5 h-5 text-indigo-500" />
    </div>
    <div>
      <p className="text-xs font-bold opacity-70 uppercase tracking-wider">{title}</p>
      <p className="font-bold">{subtitle}</p>
    </div>
  </motion.div>
)

const DestinationCard = ({ name, price, img, vibe, delay }: { name: string, price: string, img: string, vibe: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    whileHover={{ y: -10 }}
    className="relative group bg-white rounded-3xl p-3 shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-4">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${img}')` }} />
      <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md border border-white/20 p-2 rounded-full text-white cursor-pointer hover:bg-white hover:text-red-500 transition-colors">
        <Star className="w-4 h-4" />
      </div>
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-yellow-400" /> {vibe}
      </div>
    </div>

    <div className="px-2 pb-2">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-slate-900">{name}</h3>
        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold bg-yellow-50 px-2 py-1 rounded-lg">
          4.8 <Star className="w-3 h-3 fill-current" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm font-medium">3 Days / 2 Nights</p>
        <p className="text-indigo-600 font-black text-lg">{price}</p>
      </div>
    </div>
  </motion.div>
)

export default function Home() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Curated High-Quality Travel Images (Internet-style)
  const heroImages = [
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop", // Switzerland/Mountains
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2673&auto=format&fit=crop", // Beach/Tropical
    "https://images.unsplash.com/photo-1496531693211-31c5234a5ea9?q=80&w=2670&auto=format&fit=crop", // European City/Night
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2621&auto=format&fit=crop"  // Road Trip/Adventure
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-500/30 text-slate-900 overflow-x-hidden font-sans">

      {/* --- Navbar --- */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300",
          scrolled ? "pt-4" : "pt-0"
        )}
      >
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={cn(
            "flex items-center justify-between px-6 py-4 md:px-8 transition-all duration-500",
            scrolled
              ? "w-[90%] max-w-5xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-900/5 rounded-full"
              : "w-full bg-transparent"
          )}
        >
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center rotate-3 transition-all", scrolled ? "bg-indigo-600" : "bg-white/20 backdrop-blur-md")}>
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className={cn("text-lg font-black tracking-tight transition-colors", scrolled ? "text-slate-900" : "text-white drop-shadow-md")}>TripGena.</span>
          </div>

          <div className={cn("hidden md:flex items-center gap-8 text-sm font-bold transition-colors", scrolled ? "text-slate-500" : "text-white/90 drop-shadow-sm")}>
            {["Trips", "Community", "About"].map(item => (
              <Link key={item} href="#" className="hover:text-indigo-400 transition-colors">{item}</Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className={cn("text-sm font-bold hidden sm:block transition-colors hover:text-indigo-400", scrolled ? "text-slate-900" : "text-white drop-shadow-sm")}>Log in</Link>
            <Link href="/register">
              <Button className={cn("rounded-full px-6 font-bold transition-all hover:scale-105 shadow-lg", scrolled ? "bg-slate-900 hover:bg-indigo-600 text-white" : "bg-white text-slate-900 hover:bg-indigo-50")}>
                Get Started
              </Button>
            </Link>
          </div>
        </motion.nav>
      </motion.header>

      {/* --- Hero Section --- */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden">

        {/* Dynamic Background Slider */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-900/90 z-20" />
          <div className="absolute inset-0 bg-black/20 z-10" /> {/* Extra tint for text readability */}

          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }} // Subtle Ken Burns zoom
                transition={{ duration: 8, ease: "linear" }}
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container relative z-10 px-4 text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm font-bold text-white mb-8 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>The AI Travel OS for Students</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[0.9] mb-8 drop-shadow-2xl">
            Plan trips <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-indigo-200 to-pink-200 drop-shadow-md">
              not debts.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto mb-10 leading-relaxed font-medium drop-shadow-lg text-shadow-sm">
            Generate complete itineraries based on your <span className="text-white font-bold decoration-indigo-400 underline decoration-4 underline-offset-4">exact budget</span>.
            Split costs, find hidden gems, and travel like a pro.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/create">
              <Button size="xl" className="h-16 px-10 rounded-full bg-slate-900 text-white text-lg font-bold shadow-2xl shadow-indigo-900/30 hover:scale-105 hover:bg-indigo-600 transition-all">
                Start Planning Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="xl" className="h-16 px-10 rounded-full bg-white/50 border-white/60 text-slate-900 text-lg font-bold backdrop-blur-sm hover:bg-white transition-all">
              View Live Demo
            </Button>
          </div>

        </div>

        {/* Floating Decoration Cards */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none max-w-[1400px] mx-auto">
          <FloatingCard
            icon={Wallet}
            title="Total Cost"
            subtitle="₹4,500 / person"
            className="top-[25%] left-[5%] -rotate-6"
            delay={1}
          />
          <FloatingCard
            icon={MapPin}
            title="Location"
            subtitle="Gokarna, India"
            className="top-[35%] right-[5%] rotate-6"
            delay={1.2}
          />
          <FloatingCard
            icon={Calendar}
            title="Duration"
            subtitle="3 Days, 2 Nights"
            className="bottom-[20%] left-[15%] rotate-3"
            delay={1.4}
          />
        </div>

      </section>

      {/* --- Trending Section --- */}
      <section className="py-32 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4"
              >
                <Sparkles className="w-3 h-3" /> Popular Right Now
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight"
              >
                Trending this Season <span className="text-orange-500">🔥</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-lg font-medium max-w-lg"
              >
                The most booked destinations by students in the last 30 days. High on vibe, low on budget.
              </motion.p>
            </div>
            <Button variant="ghost" className="text-indigo-600 text-lg font-bold hover:bg-indigo-50 hover:gap-2 transition-all">
              View all Destinations <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <DestinationCard
              delay={0.1}
              name="Manali"
              price="₹6,500"
              vibe="Snow & Chill"
              img="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800"
            />
            <DestinationCard
              delay={0.2}
              name="Goa"
              price="₹5,200"
              vibe="Beaches & Party"
              img="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800"
            />
            <DestinationCard
              delay={0.3}
              name="Varkala"
              price="₹4,800"
              vibe="Cliffs & Cafes"
              img="https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800"
            />
            <DestinationCard
              delay={0.4}
              name="Rishikesh"
              price="₹3,500"
              vibe="Rafting & Peace"
              img="https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=800"
            />
          </div>
        </div>
      </section>


      {/* --- Bento Grid Features (Dark Mode) --- */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Everything you need to <br /> <span className="text-indigo-400">escape campus.</span></h2>
            <p className="text-xl text-slate-400">We handle the boring stuff (math, maps, routes) so you can focus on making memories (and reels).</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[700px]">

            {/* Feature 1: AI Planner (Large) */}
            <motion.div whileHover={{ scale: 1.01 }} className="md:col-span-2 md:row-span-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col justify-between group hover:border-indigo-500/50 transition-colors duration-500">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">AI Itinerary Builder</h3>
                <p className="text-slate-400 text-lg max-w-sm leading-relaxed">Tell us "Goa under 5k" and get a full day-by-day plan tailored to your vibe. No generic "tourist trap" suggestions.</p>
              </div>

              {/* Interactive Visual Mock */}
              <div className="absolute right-0 bottom-0 w-3/4 h-2/3 bg-slate-950 rounded-tl-[2.5rem] border-t border-l border-white/10 p-6 transition-transform group-hover:scale-105 group-hover:-translate-x-2 group-hover:-translate-y-2 origin-bottom-right shadow-2xl">
                <div className="space-y-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-4 items-center p-4 bg-slate-900 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">1</div>
                    <div>
                      <div className="h-2 w-24 bg-slate-700 rounded-full mb-2" />
                      <div className="h-2 w-32 bg-slate-800 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-4 bg-slate-900 rounded-2xl border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">2</div>
                    <div>
                      <div className="h-2 w-28 bg-slate-700 rounded-full mb-2" />
                      <div className="h-2 w-20 bg-slate-800 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Budget */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-green-900/20 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-green-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Smart Budgeting</h3>
              <p className="text-slate-400">Track every chai and bus ticket. Split bills instantly.</p>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full group-hover:bg-green-500/30 transition-colors" />
            </motion.div>

            {/* Feature 3: Map */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-blue-900/20 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Live Maps</h3>
              <p className="text-slate-400">Visualize your route and find places nearby.</p>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/30 transition-colors" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- Testimonials: Vibe Check --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 px-4 py-1 text-sm rounded-full mb-6">Community Love</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">Vibe Check Passed ✅</h2>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="flex animate-scroll hover:pause-scroll items-stretch gap-6 w-max">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-96 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-yellow-500 fill-current" />)}
                  </div>
                  <p className="text-slate-800 text-lg font-medium italic mb-6">"TripGena saved our Goa plan. We were about to cancel because of budget, but the AI found us a crazy good hostel."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
                    <div>
                      <p className="font-bold text-slate-900">Rohan Das</p>
                      <p className="text-sm text-slate-500">Engineering Student</p>
                    </div>
                  </div>
                </div>
                <div className="w-96 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-yellow-500 fill-current" />)}
                  </div>
                  <p className="text-slate-800 text-lg font-medium italic mb-6">"Hidden Gems mode is legit. Found a cafe in Manali that wasn't on Google Maps. Best Maggie ever."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-400" />
                    <div>
                      <p className="font-bold text-slate-900">Sara Khan</p>
                      <p className="text-sm text-slate-500">Solo Traveller</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        </div>
      </section>

      {/* --- Mega CTA --- */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="bg-black rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(79,70,229,0.4),transparent_70%)] group-hover:scale-110 transition-transform duration-1000" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                Stop Dreaming. <br />
                <span className="text-indigo-500">Start Packing.</span>
              </h2>
              <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-xl mx-auto">
                Join 10,000+ students planning their next escape. <br /> No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Button size="xl" className="h-16 px-12 text-lg rounded-full bg-white text-black hover:bg-indigo-50 hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] font-black">
                  Get Started for Free <Zap className="w-5 h-5 ml-2 fill-black" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-20 bg-slate-900 border-t border-slate-800 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 font-bold text-white text-2xl mb-6">
                <Compass className="w-8 h-8 text-indigo-500" /> TripGena
              </div>
              <p className="leading-relaxed">The intelligent travel OS designed for the student wallet. Plan, track, and explore without the stress.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-sm font-medium">
              <div className="space-y-4">
                <h4 className="text-white font-bold mb-4">Product</h4>
                <a href="#" className="block hover:text-indigo-400 transition-colors">Features</a>
                <a href="#" className="block hover:text-indigo-400 transition-colors">Pricing</a>
                <a href="#" className="block hover:text-indigo-400 transition-colors">Live Demo</a>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-bold mb-4">Company</h4>
                <a href="#" className="block hover:text-indigo-400 transition-colors">About Us</a>
                <a href="#" className="block hover:text-indigo-400 transition-colors">Careers</a>
                <a href="#" className="block hover:text-indigo-400 transition-colors">Blog</a>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <a href="#" className="block hover:text-indigo-400 transition-colors">Privacy</a>
                <a href="#" className="block hover:text-indigo-400 transition-colors">Terms</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold tracking-wider uppercase">
            <p>© 2026 TripGena Inc.</p>
            <p>Made with 💜 in India</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
