"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: "purple" | "cyan" | "pink";
  pulse: number;
  pulseSpeed: number;
}

const COLORS = {
  purple: { r: 168, g: 85, b: 247 },
  cyan: { r: 6, g: 182, b: 212 },
  pink: { r: 236, g: 72, b: 153 },
};

const HUES: Array<keyof typeof COLORS> = ["purple", "cyan", "pink"];

// Tune these to taste
const NODE_COUNT_DESKTOP = 90;
const NODE_COUNT_MOBILE = 45;
const MAX_LINK_DIST = 150;
const DRIFT_SPEED = 0.12;

export default function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let animationFrameId: number;
    let mouseX = -9999;
    let mouseY = -9999;

    const isMobile = () => window.innerWidth < 768;

    const createNodes = () => {
      const count = isMobile() ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;
      nodes = Array.from({ length: count }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * DRIFT_SPEED * (0.5 + Math.random()),
          vy: Math.sin(angle) * DRIFT_SPEED * (0.5 + Math.random()),
          radius: 1 + Math.random() * 1.6,
          hue: HUES[Math.floor(Math.random() * HUES.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.4 + Math.random() * 0.6,
        };
      });
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Update + draw nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // gentle mouse repulsion for a "living" feel
        const dx = n.x - mouseX;
        const dy = n.y - mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 120 * 120) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (120 - dist) / 120;
          n.x += (dx / dist) * force * 0.6;
          n.y += (dy / dist) * force * 0.6;
        }

        // wrap around edges
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;

        n.pulse += 0.016 * n.pulseSpeed;
      }

      // Draw links first (behind dots)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_LINK_DIST) {
            const alpha = (1 - dist / MAX_LINK_DIST) * 0.35;
            const c = COLORS[a.hue];
            ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing dots
      for (const n of nodes) {
        const c = COLORS[n.hue];
        const glow = 0.6 + Math.sin(n.pulse) * 0.4;
        ctx.save();
        ctx.shadowBlur = 8 * glow;
        ctx.shadowColor = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.9 * glow})`;
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${0.85})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1, background: "transparent" }}
      aria-hidden="true"
    />
  );
}
