"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowRightLeft,
  Check,
  X,
  Plus,
  Trophy,
  TrendingUp,
  MessageSquare,
  Clock
} from "lucide-react";
import MagneticButton from "@/components/ui/magnetic-button";
import PremiumInput from "@/components/ui/premium-input";

interface Skill {
  name: string;
  level: string;
}
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [swaps, setSwaps] = useState<any[]>([]);
  const [canTeach, setCanTeach] = useState<Skill[]>([]);
  const [wantsLearn, setWantsLearn] = useState<Skill[]>([]);

  // Skill inputs
  const [newTeachName, setNewTeachName] = useState("");
  const [newTeachLevel, setNewTeachLevel] = useState("Intermediate");
  const [newLearnName, setNewLearnName] = useState("");
  const [newLearnLevel, setNewLearnLevel] = useState("Beginner");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchData = async () => {
    if (!token) return;
    try {
      // 1. Fetch profile
      const profileRes = await fetch("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const userData = await profileRes.json();
        setUser(userData);
        setCanTeach(userData.skills_can_teach || []);
        setWantsLearn(userData.skills_wants_to_learn || []);
      }

      // 2. Fetch swaps
      const swapsRes = await fetch("http://localhost:8000/api/swaps", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (swapsRes.ok) {
        const swapsData = await swapsRes.json();
        setSwaps(swapsData);
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAddTeachSkill = () => {
    if (!newTeachName) return;
    if (canTeach.some((s) => s.name.toLowerCase() === newTeachName.toLowerCase())) return;
    setCanTeach([...canTeach, { name: newTeachName, level: newTeachLevel }]);
    setNewTeachName("");
  };

  const handleRemoveTeachSkill = (name: string) => {
    setCanTeach(canTeach.filter((s) => s.name !== name));
  };

  const handleAddLearnSkill = () => {
    if (!newLearnName) return;
    if (wantsLearn.some((s) => s.name.toLowerCase() === newLearnName.toLowerCase())) return;
    setWantsLearn([...wantsLearn, { name: newLearnName, level: newLearnLevel }]);
    setNewLearnName("");
  };

  const handleRemoveLearnSkill = (name: string) => {
    setWantsLearn(wantsLearn.filter((s) => s.name !== name));
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          skills_can_teach: canTeach,
          skills_wants_to_learn: wantsLearn,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to save profile");

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setMessage("Profile skills updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSwapStatus = async (swapId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/swaps/${swapId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Refresh dashboard data
        fetchData();
      }
    } catch (err) {
      console.error("Failed to update swap status", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Workspace Greeting */}
      <div>
        <h1 className="text-3xl font-outfit font-extrabold text-white">Welcome back, {user?.full_name}</h1>
        <p className="text-xs text-foreground/45 mt-1">Configure your skill categories to see optimized matches.</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-primary">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-foreground/40">Reputation points</div>
            <div className="text-xl font-extrabold text-white font-outfit mt-0.5">{user?.points || 0}</div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-secondary">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-foreground/40">Total Exchanges</div>
            <div className="text-xl font-extrabold text-white font-outfit mt-0.5">
              {swaps.filter((s) => s.status === "completed").length}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-foreground/40">Pending Proposals</div>
            <div className="text-xl font-extrabold text-white font-outfit mt-0.5">
              {swaps.filter((s) => s.status === "pending").length}
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-accent">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-foreground/40">Verified Rating</div>
            <div className="text-xl font-extrabold text-white font-outfit mt-0.5">
              {user?.rating?.toFixed(1) || "5.0"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Configurations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Manage Skills Card */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-outfit font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              My Skills Matrix
            </h2>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-none"
            >
              {saving ? "Saving..." : "Save Matrix"}
            </button>
          </div>

          {message && (
            <div className="text-xs text-secondary bg-secondary/10 border border-secondary/20 p-3 rounded-xl">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Can Teach */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">I Can Teach</h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Python"
                  value={newTeachName}
                  onChange={(e) => setNewTeachName(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 text-xs px-3 py-2 rounded-lg outline-none cursor-none focus:border-primary"
                />
                <select
                  value={newTeachLevel}
                  onChange={(e) => setNewTeachLevel(e.target.value)}
                  className="bg-white/5 border border-white/10 text-[10px] px-2 py-2 rounded-lg outline-none cursor-none text-foreground/75"
                >
                  <option value="Beginner" className="bg-[#030303]">Beginner</option>
                  <option value="Intermediate" className="bg-[#030303]">Intermediate</option>
                  <option value="Expert" className="bg-[#030303]">Expert</option>
                </select>
                <button
                  onClick={handleAddTeachSkill}
                  className="p-2 rounded-lg bg-primary text-black flex items-center justify-center hover:opacity-90 cursor-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {canTeach.length === 0 ? (
                  <p className="text-[10px] text-foreground/30">No teaching skills added yet.</p>
                ) : (
                  canTeach.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300"
                    >
                      {skill.name} ({skill.level})
                      <button
                        onClick={() => handleRemoveTeachSkill(skill.name)}
                        className="hover:text-white transition-colors cursor-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Wants to Learn */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">I Want To Learn</h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. UI Design"
                  value={newLearnName}
                  onChange={(e) => setNewLearnName(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 text-xs px-3 py-2 rounded-lg outline-none cursor-none focus:border-secondary"
                />
                <select
                  value={newLearnLevel}
                  onChange={(e) => setNewLearnLevel(e.target.value)}
                  className="bg-white/5 border border-white/10 text-[10px] px-2 py-2 rounded-lg outline-none cursor-none text-foreground/75"
                >
                  <option value="Beginner" className="bg-[#030303]">Beginner</option>
                  <option value="Intermediate" className="bg-[#030303]">Intermediate</option>
                  <option value="Expert" className="bg-[#030303]">Expert</option>
                </select>
                <button
                  onClick={handleAddLearnSkill}
                  className="p-2 rounded-lg bg-secondary text-black flex items-center justify-center hover:opacity-90 cursor-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {wantsLearn.length === 0 ? (
                  <p className="text-[10px] text-foreground/30">No learning goals added yet.</p>
                ) : (
                  wantsLearn.map((skill) => (
                    <span
                      key={skill.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300"
                    >
                      {skill.name} ({skill.level})
                      <button
                        onClick={() => handleRemoveLearnSkill(skill.name)}
                        className="hover:text-white transition-colors cursor-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Swap Requests Panel */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-outfit font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-secondary" />
            Active Swaps
          </h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {swaps.length === 0 ? (
              <p className="text-xs text-foreground/35 text-center py-8">No swap exchanges found.</p>
            ) : (
              swaps.map((swap) => {
                const isIncoming = swap.receiver_id === user._id;
                return (
                  <div key={swap.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-foreground/40">
                        {isIncoming ? "Incoming Offer" : "Sent Request"}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${swap.status === "pending" && "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        } ${swap.status === "accepted" && "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"
                        } ${swap.status === "completed" && "bg-green-500/10 text-green-500 border border-green-500/20"
                        }`}>
                        {swap.status}
                      </span>
                    </div>

                    <div className="text-xs text-foreground/80">
                      Swap <span className="font-semibold text-white">{swap.offered_skill}</span> for{" "}
                      <span className="font-semibold text-white">{swap.requested_skill}</span>.
                    </div>

                    {swap.status === "pending" && isIncoming && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleUpdateSwapStatus(swap.id, "accepted")}
                          className="flex-1 py-2 rounded-lg bg-secondary text-black text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-90 cursor-none"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleUpdateSwapStatus(swap.id, "rejected")}
                          className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-foreground/60 text-xs font-semibold flex items-center justify-center hover:bg-white/10 hover:text-white cursor-none"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {swap.status === "accepted" && (
                      <button
                        onClick={() => handleUpdateSwapStatus(swap.id, "completed")}
                        className="w-full py-2 rounded-lg bg-green-500 text-black text-xs font-semibold flex items-center justify-center gap-1 hover:bg-green-400 cursor-none"
                      >
                        Mark Completed (+50 pts)
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );

}
