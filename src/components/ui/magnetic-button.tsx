"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/utils/cn"; // We will create this simple utility in a moment

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "purple" | "cyan" | "pink" | "none";
  magneticStrength?: number; // 0 to 1
}

export default function MagneticButton({
  children,
  className,
  glowColor = "purple",
  magneticStrength = 0.35,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    // Calculate center of button
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center to mouse
    const moveX = (clientX - centerX) * magneticStrength;
    const moveY = (clientY - centerY) * magneticStrength;
    
    setPosition({ x: moveX, y: moveY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Glow class styles
  const glowStyles = {
    purple: "shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] border-purple-500/30 hover:border-purple-400",
    cyan: "shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] border-cyan-500/30 hover:border-cyan-400",
    pink: "shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] border-pink-500/30 hover:border-pink-400",
    none: "border-white/10 hover:border-white/30",
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={cn(
        "relative px-6 py-3 rounded-xl font-medium tracking-wide glass-panel text-sm text-foreground",
        "overflow-hidden cursor-none select-none transition-all duration-300",
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {/* Light sweep sweep effect */}
      <span className="absolute inset-0 block -translate-x-full group-hover:animate-none hover:animate-[sweep_1.5s_ease_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Ripple background element */}
      <span
        className={cn(
          "absolute inset-0 -z-10 rounded-xl opacity-0 scale-90 transition-all duration-500",
          glowColor === "purple" && "bg-gradient-to-r from-purple-600/20 to-indigo-600/20",
          glowColor === "cyan" && "bg-gradient-to-r from-cyan-600/20 to-blue-600/20",
          glowColor === "pink" && "bg-gradient-to-r from-pink-600/20 to-purple-600/20",
          isHovered ? "opacity-100 scale-100" : ""
        )}
      />

      {/* Inner Button Content */}
      <span
        style={{
          transform: `translate3d(${position.x * 0.25}px, ${position.y * 0.25}px, 0)`,
          transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative z-10 flex items-center justify-center gap-2"
      >
        {children}
      </span>
    </button>
  );
}
