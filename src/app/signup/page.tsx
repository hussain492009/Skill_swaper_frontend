"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, AlertCircle } from "lucide-react";
import PremiumInput from "@/components/ui/premium-input";
import MagneticButton from "@/components/ui/magnetic-button";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Submit Registration
      const regRes = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      const regData = await regRes.json();

      if (!regRes.ok) {
        throw new Error(regData.detail || "Registration failed.");
      }

      // 2. Auto-login upon registration success
      const loginRes = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error("Account created but auto-login failed. Please log in manually.");
      }

      // Save tokens
      localStorage.setItem("access_token", loginData.access_token);
      localStorage.setItem("refresh_token", loginData.refresh_token);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      // Redirect to onboarding/dashboard
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

        {/* Signup Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 glow-card-cyan">
          <div className="space-y-2 mb-8 text-center">
            <div className="inline-flex w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 items-center justify-center text-secondary mb-2">
              <UserPlus className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-outfit font-bold text-white">Create Account</h1>
            <p className="text-sm text-foreground/50">Join our premium skill-exchange marketplace</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <PremiumInput
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

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
                glowColor="cyan" 
                className="w-full py-4 text-sm font-semibold rounded-xl"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </MagneticButton>
            </div>
          </form>

          <div className="mt-8 text-center text-xs text-foreground/45">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary hover:text-cyan-400 font-semibold transition-colors cursor-none">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
