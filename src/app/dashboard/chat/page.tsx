"use client";

import React, { useEffect, useState, useRef } from "react";
import { Send, Sparkles, MessageSquare, ArrowLeft, Star } from "lucide-react";
import { cn } from "@/utils/cn";

interface Conversation {
  partner: {
    id: string;
    full_name: string;
    profile_picture: string;
  };
  last_message: string;
  last_message_time: string;
  is_read: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // 1. Load active conversations
  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/chat/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    }
  };

  // 2. Load message history for chosen partner
  const fetchChatHistory = async (partnerId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:8000/api/chat/history/${partnerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Mark conversation as read locally
        setConversations((prev) =>
          prev.map((c) =>
            c.partner.id === partnerId ? { ...c, is_read: true } : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to load message history", err);
    }
  };

  // 3. Connect to WebSocket
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    fetchConversations();

    if (!token) return;

    // Establish WebSocket Connection
    const wsUrl = `ws://localhost:8000/api/chat/ws/${token}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Secure WebSocket connected.");
    };

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "chat_message") {
        const msg: Message = payload.data;
        
        // Append to active message list if it belongs to selected conversation
        // The message could be sent by current user (echoed) or received from partner
        setSelectedPartner((currentPartner: any) => {
          if (
            currentPartner &&
            (msg.sender_id === currentPartner.id || msg.receiver_id === currentPartner.id)
          ) {
            setMessages((prev) => [...prev, msg]);
          } else {
            // Trigger conversation update list
            fetchConversations();
          }
          return currentPartner;
        });
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [token]);

  // Handle partner selection
  const handleSelectPartner = (partner: any) => {
    setSelectedPartner(partner);
    fetchChatHistory(partner.id);
  };

  // Send new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner || !socketRef.current) return;

    const payload = {
      receiver_id: selectedPartner.id,
      content: newMessage,
    };

    // Send via WebSocket
    socketRef.current.send(JSON.stringify(payload));
    setNewMessage("");
  };

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="glass-panel rounded-3xl h-[calc(100vh-12rem)] flex overflow-hidden font-sans border-white/5 relative z-10">
      
      {/* Left conversation sidebar panel */}
      <div className="w-80 border-r border-white/5 flex flex-col justify-between shrink-0 bg-background/20">
        <div className="p-4 border-b border-white/5">
          <div className="text-xs font-bold text-white uppercase tracking-wider">Conversations</div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-12 text-xs text-foreground/30">No active discussions.</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.partner.id}
                onClick={() => handleSelectPartner(conv.partner)}
                className={cn(
                  "w-full p-3 rounded-xl flex items-center gap-3 transition-all cursor-none text-left",
                  selectedPartner?.id === conv.partner.id
                    ? "bg-white/5 border border-white/5 text-white"
                    : "hover:bg-white/[0.02]"
                )}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black font-bold uppercase shrink-0">
                  {conv.partner.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">{conv.partner.full_name}</span>
                    {!conv.is_read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-foreground/50 truncate mt-0.5">{conv.last_message}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right chat panel */}
      <div className="flex-1 flex flex-col bg-background/5">
        {selectedPartner ? (
          <>
            {/* Chat header */}
            <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-[#030303]/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-black text-xs font-bold uppercase">
                  {selectedPartner.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-outfit font-semibold text-xs text-white leading-none">{selectedPartner.full_name}</h3>
                  <span className="text-[9px] text-foreground/40 mt-1 block">Active Swap Member</span>
                </div>
              </div>
            </div>

            {/* Bubble list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUser?.id || msg.sender_id === currentUser?._id;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col max-w-[70%] space-y-1",
                      isMe ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl text-xs",
                        isMe
                          ? "bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/20 text-white rounded-tr-none"
                          : "bg-white/5 border border-white/5 text-foreground/90 rounded-tl-none"
                      )}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-foreground/30 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input field */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-[#030303]/30 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none cursor-none focus:border-primary"
              />
              <button
                type="submit"
                className="p-3 rounded-xl bg-primary text-black flex items-center justify-center hover:opacity-90 transition-all cursor-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-foreground/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-sm text-white">Secure Workspace Messenger</h4>
              <p className="text-[11px] text-foreground/40 mt-1 max-w-xs leading-relaxed">
                Connect and arrange lesson sessions instantly. Select a discussion in the sidebar to get started.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
