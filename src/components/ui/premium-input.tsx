"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/utils/cn";

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  containerClassName?: string;
}

export default function PremiumInput({
  label,
  className,
  containerClassName,
  type = "text",
  onFocus,
  onBlur,
  ...props
}: PremiumInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  
  // Spotlight effect cursor coordinate state
  const containerRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [showSpotlight, setShowSpotlight] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) props.onChange(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setSpotlightPos({ x, y });
  };

  const isActive = isFocused || hasValue || (props.value !== undefined && String(props.value).length > 0);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowSpotlight(true)}
      onMouseLeave={() => setShowSpotlight(false)}
      className={cn(
        "relative rounded-xl transition-all duration-300 p-[1px] overflow-hidden",
        isFocused 
          ? "bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" 
          : "bg-white/10 hover:bg-white/20",
        containerClassName
      )}
    >
      {/* Background Spotlight Glow */}
      {showSpotlight && !isFocused && (
        <div
          className="absolute inset-0 -z-10 transition-opacity duration-300 pointer-events-none opacity-40 blur-[10px]"
          style={{
            background: `radial-gradient(100px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(168, 85, 247, 0.4), transparent)`,
          }}
        />
      )}

      {/* Input container body */}
      <div className="relative rounded-xl bg-background/95 w-full">
        <input
          type={type}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            "w-full px-4 pt-6 pb-2 text-sm text-foreground bg-transparent border-0 outline-none",
            "placeholder-transparent focus:ring-0 cursor-none select-text",
            className
          )}
          {...props}
        />
        
        {/* Floating Label */}
        <label
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-foreground/50",
            "transition-all duration-300 transform origin-top-left",
            isActive && "top-3 scale-75 -translate-y-0 text-primary"
          )}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
