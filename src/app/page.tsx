"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, 
  Sparkles, 
  MessageSquare, 
  ArrowRightLeft, 
  Search, 
  Shield, 
  Trophy, 
  ArrowUpRight,
  Cpu,
  Layers,
  ChevronRight,
  BookOpen
} from "lucide-react";
import HeroCanvas from "@/components/landing/hero-canvas";
import MagneticButton from "@/components/ui/magnetic-button";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Standard categories
  const categories = [
    { name: "Web Development", count: 1240, color: "from-purple-500 to-indigo-500", icon: Code },
    { name: "UI/UX Design", count: 850, color: "from-cyan-500 to-blue-500", icon: Layers },
    { name: "AI & Data Science", count: 640, color: "from-pink-500 to-rose-500", icon: Cpu },
    { name: "Languages", count: 430, color: "from-emerald-500 to-teal-500", icon: BookOpen },
  ];

  // Mock matching demo users
  const userA = {
    name: "Alex Rivera",
    role: "Python Engineer",
    teaches: ["Python", "Machine Learning", "FastAPI"],
    wants: ["UI Design", "Framer Motion"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  };

  const userB = {
    name: "Sophia Chen",
    role: "Senior Product Designer",
    teaches: ["UI Design", "Figma", "Framer Motion"],
    wants: ["Python", "AI Prompting"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  };

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 0, backgroundColor: "#000000" }}
          animate={{ opacity: 1, backgroundColor: "#030303" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative min-h-screen text-foreground overflow-hidden"
        >
          {/* Ambient Aurora Background Blurs */}
          <div className="aurora-bg">
            <div className="aurora-blob aurora-1" />
            <div className="aurora-blob aurora-2" />
            <div className="aurora-blob aurora-3" />
          </div>

          {/* 3D Experience (Glass Unicorn, Twinkling Stars, Floating Geometry) */}
          <HeroCanvas />

          {/* Premium Header / Navigation */}
          <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-outfit font-bold text-lg tracking-wider text-white">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black font-extrabold text-sm">SS</span>
                SKILL SWAPPER
              </Link>
              
              <nav className="hidden md:flex items-center gap-8 text-sm text-foreground/75 font-medium">
                <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                <Link href="#matching" className="hover:text-white transition-colors">AI Matching</Link>
                <Link href="/leaderboard" className="hover:text-white transition-colors">Reputation</Link>
              </nav>

              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/signup">
                  <MagneticButton glowColor="cyan" className="px-4 py-2 text-xs rounded-lg">
                    Get Started
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative z-20 min-h-screen flex flex-col justify-center items-center px-6 pt-24 text-center max-w-5xl mx-auto pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs text-secondary border-secondary/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exchange Knowledge. Save Capital.</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-outfit font-extrabold leading-none tracking-tight text-gradient">
                Trade Skills,<br />Not Money.
              </h1>

              <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto font-sans leading-relaxed">
                The world-class collaborative platform built for creators and engineers. Share your expertise, learn something new, and accelerate your growth for free.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 pointer-events-auto">
                <Link href="/signup">
                  <MagneticButton glowColor="purple" className="px-8 py-4 rounded-xl text-sm font-semibold">
                    Start Swapping Now
                  </MagneticButton>
                </Link>
                <Link href="/login">
                  <button className="px-8 py-4 rounded-xl text-sm font-semibold glass-panel border-white/5 hover:border-white/20 transition-all hover:bg-white/5 cursor-none">
                    Browse Skills
                  </button>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Intelligent Matchmaking Demo Section */}
          <section id="matching" className="relative z-20 py-32 px-6 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl md:text-5xl font-outfit font-bold text-gradient">
                Intelligent Neural Matching
              </h2>
              <p className="text-foreground/50 max-w-lg mx-auto text-sm">
                Our matching engine automatically connects users with complementary skills and learning desires.
              </p>
            </div>

            {/* Match Cards Demo */}
            <div className="grid md:grid-cols-3 gap-8 items-center">
              {/* User A Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-panel rounded-3xl p-8 glow-card-purple"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={userA.avatar} alt={userA.name} className="w-14 h-14 rounded-full border border-purple-500/20" />
                  <div>
                    <h3 className="font-outfit font-semibold text-lg text-white">{userA.name}</h3>
                    <p className="text-xs text-foreground/50">{userA.role}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Can Teach</h4>
                    <div className="flex flex-wrap gap-2">
                      {userA.teaches.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground/45 uppercase tracking-wider mb-2">Wants to Learn</h4>
                    <div className="flex flex-wrap gap-2">
                      {userA.wants.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-foreground/75">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Interaction Center Line */}
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                  <ArrowRightLeft className="w-6 h-6 text-black animate-pulse" />
                </div>
                <div className="text-sm font-semibold text-white font-outfit">Perfect Match found!</div>
                <div className="text-xs text-foreground/40 max-w-[200px]">Sophia can teach UI Design, and wants to learn Python. Alex can teach Python, and wants UI Design.</div>
              </div>

              {/* User B Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-panel rounded-3xl p-8 glow-card-cyan"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={userB.avatar} alt={userB.name} className="w-14 h-14 rounded-full border border-cyan-500/20" />
                  <div>
                    <h3 className="font-outfit font-semibold text-lg text-white">{userB.name}</h3>
                    <p className="text-xs text-foreground/50">{userB.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Can Teach</h4>
                    <div className="flex flex-wrap gap-2">
                      {userB.teaches.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground/45 uppercase tracking-wider mb-2">Wants to Learn</h4>
                    <div className="flex flex-wrap gap-2">
                      {userB.wants.map((s) => (
                        <span key={s} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-foreground/75">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="relative z-20 py-32 bg-black/40 backdrop-blur-sm border-y border-white/5 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-4 mb-20">
                <h2 className="text-3xl md:text-5xl font-outfit font-bold text-gradient">
                  Everything You Need to Swap
                </h2>
                <p className="text-foreground/50 max-w-lg mx-auto text-sm">
                  We provide a premium set of features to support seamless and safe skill exchanges.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="glass-panel rounded-2xl p-8 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-primary mb-6">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-outfit mb-3">AI Skill Search</h3>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    Search and filter by hundreds of skill tags. Find matching profiles with precise learning parameters.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="glass-panel rounded-2xl p-8 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-secondary mb-6">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-outfit mb-3">Real-time WebSocket Chat</h3>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    Communicate instantly with active members to align on goals, schedules, and lesson structures.
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="glass-panel rounded-2xl p-8 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-accent mb-6">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white font-outfit mb-3">Gamified Scoreboard</h3>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    Earn points by successfully completing swaps, climb the local leaderboards, and gain custom achievements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Footer */}
          <footer className="relative z-20 py-20 px-6 border-t border-white/5 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-6xl font-outfit font-extrabold text-white leading-tight">
                Ready to level up your skillset?
              </h2>
              <p className="text-foreground/50 text-sm max-w-md mx-auto">
                Join our startup-grade exchange network today. Level up your programming, design, or writing for free.
              </p>
              <div className="pt-6">
                <Link href="/signup">
                  <MagneticButton glowColor="purple" className="px-8 py-4">
                    Join Skill Swapper
                  </MagneticButton>
                </Link>
              </div>
              <div className="text-xs text-foreground/30 pt-12">
                © {new Date().getFullYear()} Skill Swapper Inc. All rights reserved.
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
