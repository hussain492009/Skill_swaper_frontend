"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import PremiumInput from "@/components/ui/premium-input";
import MagneticButton from "@/components/ui/magnetic-button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed.");
      }

      // Save tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030303] text-foreground p-6 overflow-hidden">
      {/* Background blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-1 opacity-10" />
        <div className="aurora-blob aurora-2 opacity-10" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs text-foreground/40 hover:text-white transition-colors mb-8 cursor-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        {/* Login Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 glow-card-purple">
          <div className="space-y-2 mb-8 text-center">
            <div className="inline-flex w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 items-center justify-center text-primary mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-outfit font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-foreground/50">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <PremiumInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PremiumInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2">
              <MagneticButton 
                type="submit" 
                glowColor="purple" 
                className="w-full py-4 text-sm font-semibold rounded-xl"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Login"}
              </MagneticButton>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-foreground/45">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-purple-400 font-semibold transition-colors cursor-none">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
