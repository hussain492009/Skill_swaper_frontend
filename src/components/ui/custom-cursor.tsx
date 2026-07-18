"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
}

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    
    // Smooth lerp follow for outer ring
    const speed = 0.15; 
    let animationFrameId: number;

    const updatePosition = () => {
      // Lerp ring position
      ringX += (mouseX - ringX) * speed;
      ringY += (mouseY - ringY) * speed;

      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${isHovered ? 1.8 : 1})`;
      }

      // Update click burst particles physics
      setParticles((prevParticles) =>
        prevParticles
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // gravity
            alpha: p.alpha - 0.02,
          }))
          .filter((p) => p.alpha > 0)
      );

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        setIsVisible(true);
        document.body.classList.add("custom-cursor-active");
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      document.body.classList.remove("custom-cursor-active");
    };

    const onMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 200);

      // Create spark particles on click
      const colors = ["#a855f7", "#06b6d4", "#ec4899", "#3b82f6"];
      const newParticles: Particle[] = Array.from({ length: 8 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4;
        return {
          id: particleIdRef.current++,
          x: mouseX,
          y: mouseY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 3 + Math.random() * 4,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2, // shoot upwards slightly
          alpha: 1,
        };
      });
      setParticles((prev) => [...prev, ...newParticles]);
    };

    // Hover event listeners on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.tagName === "INPUT" || 
        target.tagName === "SELECT" || 
        target.tagName === "TEXTAREA" || 
        target.closest("button") !== null || 
        target.closest("a") !== null || 
        target.getAttribute("role") === "button" ||
        target.classList.contains("interactive-hover");

      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseover", handleMouseOver);

    // Start animation loop
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [isHovered, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Click burst particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed top-0 left-0 pointer-events-none rounded-full z-[99999]"
          style={{
            transform: `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0)`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.alpha,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}

      {/* Outer Ring */}
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[99998] transition-colors duration-300 mix-blend-difference -ml-4 -mt-4`}
        style={{
          borderColor: isHovered ? "var(--secondary)" : "var(--primary)",
          boxShadow: isHovered 
            ? "0 0 15px var(--secondary-glow)" 
            : "0 0 10px var(--primary-glow)",
          backgroundColor: isHovered ? "rgba(6, 182, 212, 0.05)" : "transparent",
        }}
      />

      {/* Inner Dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[99999] -ml-1 -mt-1 ${
          clicked ? "scale-150" : "scale-100"
        } transition-transform duration-100`}
        style={{
          backgroundColor: isHovered ? "var(--secondary)" : "var(--primary)",
          boxShadow: `0 0 8px ${isHovered ? "var(--secondary)" : "var(--primary)"}`,
        }}
      />
    </>
  );
}
