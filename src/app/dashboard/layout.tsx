"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Search, 
  Trophy, 
  LogOut, 
  Sparkles, 
  User, 
  Bell 
} from "lucide-react";
import { cn } from "@/utils/cn";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (!storedUser || !token) {
      // Redirect if not logged in
      router.push("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    
    // Fetch latest user details (to refresh points, ratings, etc.)
    const fetchLatestUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const latestData = await res.json();
          setUser(latestData);
          localStorage.setItem("user", JSON.stringify(latestData));
        } else if (res.status === 401) {
          // Token expired
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to load user state", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Find Matches", href: "/dashboard/search", icon: Search },
    { name: "Messages", href: "/dashboard/chat", icon: MessageSquare },
  ];

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#030303] text-foreground flex items-center justify-center font-outfit">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary animate-spin" />
          <p className="text-xs text-foreground/40 font-medium">Entering Swapper Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-foreground flex font-sans overflow-hidden">
      {/* Aurora Ambient */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-1 opacity-[0.03]" />
        <div className="aurora-blob aurora-2 opacity-[0.03]" />
      </div>

      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-white/5 bg-background/30 backdrop-blur-md shrink-0 flex flex-col justify-between p-6 z-30">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-outfit font-bold text-sm tracking-wider text-white cursor-none">
            <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black font-extrabold text-[10px]">SS</span>
            SKILL SWAPPER
          </Link>

          {/* User Preview */}
          {user && (
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black font-bold font-outfit uppercase shrink-0">
                {user.full_name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.full_name}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-secondary font-semibold font-outfit mt-0.5">
                  <Sparkles className="w-3 h-3 text-secondary" />
                  <span>{user.points || 0} pts</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-none",
                    isActive
                      ? "bg-white/5 border border-white/10 text-white font-semibold"
                      : "text-foreground/50 hover:text-white hover:bg-white/[0.02]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/5 transition-all w-full text-left cursor-none"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-background/20 backdrop-blur-sm flex items-center justify-between px-8">
          <h2 className="font-outfit font-bold text-sm text-white uppercase tracking-wider">
            {pathname === "/dashboard" && "Workspace Dashboard"}
            {pathname === "/dashboard/search" && "Find Swappers"}
            {pathname === "/dashboard/chat" && "Secure Messenger"}
          </h2>

          {/* Header Action Badges */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                <span className="font-semibold text-yellow-500">{user.rating?.toFixed(1) || "5.0"} Rating</span>
              </div>
            )}
            <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground/75 hover:text-white hover:bg-white/10 transition-colors cursor-none">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
