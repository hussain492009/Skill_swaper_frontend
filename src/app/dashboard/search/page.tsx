"use client";

import React, { useEffect, useState } from "react";
import { Search, Sparkles, Send, Star, Layers, X } from "lucide-react";
import MagneticButton from "@/components/ui/magnetic-button";

interface Match {
  user: {
    id: string;
    full_name: string;
    bio: string;
    profile_picture: string;
    skills_can_teach: { name: string; level: string }[];
    skills_wants_to_learn: { name: string; level: string }[];
    rating: number;
    points: number;
  };
  score: number;
  you_teach_them: string[];
  they_teach_you: string[];
}

export default function SearchPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Proposal modal state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [offeredSkill, setOfferedSkill] = useState("");
  const [requestedSkill, setRequestedSkill] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [proposalStatus, setProposalStatus] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchMatches = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/matches", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error("Failed to fetch matches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [token]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const res = await fetch(`http://localhost:8000/api/matches/search?can_teach=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProposal = (user: any) => {
    setSelectedUser(user);
    // Set default offered & requested skills
    setOfferedSkill(user.skills_wants_to_learn?.[0]?.name || "");
    setRequestedSkill(user.skills_can_teach?.[0]?.name || "");
    setMessage(`Hi ${user.full_name}, I'd love to swap skills with you!`);
    setProposalStatus("");
  };

  const handleSendProposal = async () => {
    if (!token || !selectedUser) return;
    setSubmitting(true);
    setProposalStatus("");

    try {
      const res = await fetch("http://localhost:8000/api/swaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: selectedUser.id || selectedUser._id,
          offered_skill: offeredSkill,
          requested_skill: requestedSkill,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to submit proposal");
      }

      setProposalStatus("Proposal sent successfully!");
      setTimeout(() => {
        setSelectedUser(null);
      }, 2000);
    } catch (err: any) {
      setProposalStatus(err.message || "Failed to submit proposal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Compatibility Matcher
          </h1>
          <p className="text-xs text-foreground/45 mt-1">Browse members matching your target skills or run custom search filters.</p>
        </div>

        {/* Search Input bar */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-80">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Search skill (e.g. React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-none text-xs w-full text-white cursor-none"
            />
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-black hover:opacity-90 cursor-none"
          >
            Go
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Search Result display or Matches list */}
          {isSearching ? (
            searchResults.length === 0 ? (
              <p className="col-span-full text-center text-xs text-foreground/30 py-12">No users found teaching this skill.</p>
            ) : (
              searchResults.map((user) => (
                <div key={user.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-black font-bold uppercase">
                        {user.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-outfit font-semibold text-sm text-white">{user.full_name}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-current" />
                          {user.rating?.toFixed(1) || "5.0"}
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-foreground/50 line-clamp-2">{user.bio || "No biography provided yet."}</p>
                    
                    <div className="space-y-3 pt-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-cyan-400">Can Teach</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.skills_can_teach.map((s: any) => (
                            <span key={s.name} className="text-[10px] px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-lg">{s.name}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-purple-400">Wants to Learn</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.skills_wants_to_learn.map((s: any) => (
                            <span key={s.name} className="text-[10px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg">{s.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenProposal(user)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-none"
                  >
                    Propose Swap
                  </button>
                </div>
              ))
            )
          ) : (
            matches.length === 0 ? (
              <div className="col-span-full text-center py-12 glass-panel rounded-2xl p-8 space-y-4">
                <p className="text-xs text-foreground/40">No compatibility matches found yet.</p>
                <p className="text-[10px] text-foreground/30">Please ensure you have configured your skills matrix in the dashboard.</p>
              </div>
            ) : (
              matches.map((match) => (
                <div key={match.user.id} className="glass-panel p-6 rounded-3xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
                  
                  {/* Match score badge */}
                  <div className="absolute top-4 right-4 px-2 py-1 rounded bg-purple-500/15 border border-purple-500/25 text-[10px] font-bold text-primary font-outfit uppercase">
                    {match.score > 100 ? "Direct Trade Match" : `${match.score} Rating`}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black font-bold uppercase">
                        {match.user.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-outfit font-semibold text-sm text-white">{match.user.full_name}</h3>
                        <p className="text-[10px] text-foreground/45">Reputation points: {match.user.points}</p>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-foreground/50 line-clamp-2">{match.user.bio || "No biography provided yet."}</p>
                    
                    <div className="space-y-3 pt-2">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-cyan-400">Can Teach</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.user.skills_can_teach.map((s: any) => (
                            <span key={s.name} className="text-[10px] px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-lg">{s.name}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-purple-400">Wants to Learn</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.user.skills_wants_to_learn.map((s: any) => (
                            <span key={s.name} className="text-[10px] px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg">{s.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenProposal(match.user)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/20 transition-all cursor-none"
                  >
                    Propose Swap
                  </button>
                </div>
              ))
            )
          )}
        </div>
      )}

      {/* Dynamic proposal modal card */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="relative glass-panel rounded-3xl p-8 max-w-md w-full glow-card-purple space-y-6">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-foreground/45 hover:text-white transition-colors cursor-none"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <h2 className="text-lg font-outfit font-bold text-white">Propose Skill Swap</h2>
              <p className="text-xs text-foreground/50">Send an swap exchange proposal to {selectedUser.full_name}.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-foreground/45 uppercase tracking-wider mb-1 block">You teach them</label>
                <select
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs px-3 py-2.5 rounded-xl outline-none cursor-none text-white"
                >
                  <option value="" className="bg-[#030303]">Select skill</option>
                  {selectedUser.skills_wants_to_learn?.map((s: any) => (
                    <option key={s.name} value={s.name} className="bg-[#030303]">{s.name}</option>
                  ))}
                  {/* Fallback support */}
                  <option value="General Coding" className="bg-[#030303]">General Coding</option>
                  <option value="General Design" className="bg-[#030303]">General Design</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-foreground/45 uppercase tracking-wider mb-1 block">They teach you</label>
                <select
                  value={requestedSkill}
                  onChange={(e) => setRequestedSkill(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs px-3 py-2.5 rounded-xl outline-none cursor-none text-white"
                >
                  <option value="" className="bg-[#030303]">Select skill</option>
                  {selectedUser.skills_can_teach?.map((s: any) => (
                    <option key={s.name} value={s.name} className="bg-[#030303]">{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-foreground/45 uppercase tracking-wider mb-1 block">Introduction Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs px-3 py-2.5 rounded-xl outline-none cursor-none text-white h-24 resize-none"
                />
              </div>

              {proposalStatus && (
                <div className="text-xs text-center py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl">
                  {proposalStatus}
                </div>
              )}

              <button
                onClick={handleSendProposal}
                disabled={submitting}
                className="w-full py-3 rounded-xl text-xs font-semibold bg-primary text-black flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-none"
              >
                {submitting ? "Sending..." : "Submit Proposal"}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
