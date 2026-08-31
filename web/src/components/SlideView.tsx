"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ParsedSlide } from "@/lib/content";
import { getSlideIcon } from "@/components/SlideIcons";

interface Props {
  slides: ParsedSlide[];
  title: string;
  trackId: string;
  moduleId: string;
}

const CHANNEL_NAME = "cert-studio-slides";

// Salesforce section color palette
const SECTION_COLORS: Record<string, { dot: string; label: string; badge: string }> = {
  default:             { dot: "#00a1e0", label: "#7eb3d8", badge: "rgba(0,161,224,0.15)" },
  "AI Fundamentals":   { dot: "#1589ee", label: "#7eb3d8", badge: "rgba(21,137,238,0.15)" },
  "Generative AI":     { dot: "#9c59ff", label: "#c4a0ff", badge: "rgba(156,89,255,0.15)" },
  "AI in Salesforce":  { dot: "#00a1e0", label: "#7eb3d8", badge: "rgba(0,161,224,0.15)" },
  "Ethical":           { dot: "#ffb75d", label: "#ffd49e", badge: "rgba(255,183,93,0.15)" },
  "Data for AI":       { dot: "#3ba755", label: "#82d496", badge: "rgba(59,167,85,0.15)" },
  "Hands-On":          { dot: "#ff784f", label: "#ffb49a", badge: "rgba(255,120,79,0.15)" },
  "Exam":              { dot: "#e31b1b", label: "#ff8080", badge: "rgba(227,27,27,0.1)" },
};

function getColors(title: string) {
  for (const [key, val] of Object.entries(SECTION_COLORS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return SECTION_COLORS.default;
}

// Salesforce cloud SVG icon (inline, lightweight)
function SFCloud({ size = 20, color = "#00a1e0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.68} viewBox="0 0 52 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.5 6.5C23.7 2.6 27.9 0 32.7 0c6.6 0 12 5 12.5 11.4C47.9 11 50 13 50 15.5c0 2.8-2.2 5-5 5H10c-4.4 0-8-3.6-8-8 0-4.1 3.1-7.5 7.1-7.9.2-4.4 3.8-7.8 8.2-7.8 2 0 3.8.7 5.2 1.7z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

export function SlideView({ slides, title, trackId, moduleId }: Props) {
  const [current, setCurrent] = useState(0);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const total = slides.length;

  const broadcastSlide = useCallback((index: number) => {
    channelRef.current?.postMessage({ slideIndex: index, source: "inline" });
  }, []);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(total - 1, index));
    setCurrent(clamped);
    broadcastSlide(clamped);
  }, [total, broadcastSlide]);

  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = bc;
    bc.onmessage = (e) => {
      if (e.data?.slideIndex !== undefined && e.data.source !== "inline") setCurrent(e.data.slideIndex);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => { bc.close(); window.removeEventListener("keydown", onKey); };
  }, [current, goTo]);

  if (!slides.length) return null;

  const slide = slides[current];
  const colors = getColors(title);
  const progress = ((current + 1) / total) * 100;
  const slidesUrl = `/slides/${trackId}/${moduleId}`;

  return (
    <div className="flex flex-col h-full" style={{ background: "#020e1f" }}>

      {/* Salesforce blue progress bar */}
      <div className="h-0.5 flex-shrink-0" style={{ background: "#0a1a2e" }}>
        <div
          className="h-full sf-progress-bar transition-all duration-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top control bar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0 border-b"
        style={{ background: "#021630", borderColor: "rgba(1,118,211,0.2)" }}
      >
        {/* Left: SF cloud + slide count */}
        <div className="flex items-center gap-2.5">
          <SFCloud size={18} color="#00a1e0" />
          <span className="text-xs font-mono" style={{ color: "#7eb3d8" }}>
            SLIDE <span className="font-bold" style={{ color: "#e8f4ff" }}>{current + 1}</span> / {total}
          </span>
        </div>

        {/* Centre: dot nav */}
        <div className="flex gap-1.5 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === current ? 16 : 6,
                height: 6,
                background: i === current ? "#00a1e0" : "rgba(255,255,255,0.15)",
                boxShadow: i === current ? "0 0 8px rgba(0,161,224,0.8)" : "none",
              }}
            />
          ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(slidesUrl, "cert-studio-slides", "width=1280,height=800,menubar=no,toolbar=no,location=no")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0176d3, #00a1e0)", color: "#fff", boxShadow: "0 2px 12px rgba(0,161,224,0.3)" }}
          >
            <span>⛶</span> Full Screen
          </button>
          <button onClick={() => goTo(current - 1)} disabled={current === 0}
            className="px-2.5 py-1 rounded text-xs font-medium transition-colors disabled:opacity-30"
            style={{ background: "rgba(1,118,211,0.2)", color: "#7eb3d8", border: "1px solid rgba(1,118,211,0.3)" }}>
            ←
          </button>
          <button onClick={() => goTo(current + 1)} disabled={current === total - 1}
            className="px-2.5 py-1 rounded text-xs font-semibold transition-all disabled:opacity-30 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0176d3, #1589ee)", color: "#fff", boxShadow: "0 2px 8px rgba(1,118,211,0.4)" }}>
            →
          </button>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* Main slide card */}
        <div className="sf-slide-card rounded-2xl overflow-hidden relative">

          {/* Animated background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
              style={{ background: `radial-gradient(circle, ${colors.dot}, transparent)`, animation: "orb-drift 12s ease-in-out infinite" }} />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full opacity-8"
              style={{ background: `radial-gradient(circle, #0176d3, transparent)`, animation: "orb-drift 16s ease-in-out infinite reverse" }} />
          </div>

          {/* Salesforce blue top bar */}
          <div className="sf-slide-title-bar" />

          {/* Card header */}
          <div className="flex items-start justify-between px-6 pt-4 pb-2 relative">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full font-mono"
                style={{ background: "rgba(1,118,211,0.2)", color: "#1589ee", border: "1px solid rgba(1,118,211,0.3)" }}
              >
                {String(slide.number).padStart(2, "0")}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: colors.badge, color: colors.label, border: `1px solid ${colors.dot}30` }}
              >
                AI Associate
              </span>
            </div>
            {/* Floating topic icon (top-right, semi-transparent) */}
            <div className="anim-icon-pulse opacity-60">
              {getSlideIcon(slide.title, title, colors.dot)}
            </div>
          </div>

          {/* Title — fade-in-up on each new slide */}
          <div className="px-6 pt-1 pb-3 relative anim-slide-up" key={`title-${slide.number}`}>
            <h2
              className="text-xl font-bold leading-snug"
              style={{ color: "#e8f4ff", textShadow: "0 2px 20px rgba(0,161,224,0.15)" }}
            >
              {slide.title}
            </h2>
          </div>

          {/* Accent rule */}
          <div className="mx-6 mb-4 h-px" style={{ background: `linear-gradient(90deg, ${colors.dot}, ${colors.dot}40, transparent)` }} />

          {/* Bullet points — staggered entrance */}
          {slide.bullets.length > 0 && (
            <ul className="px-6 pb-4 space-y-2.5 relative" key={`bullets-${slide.number}`}>
              {slide.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 anim-slide-left"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: colors.dot, boxShadow: `0 0 6px ${colors.dot}99` }} />
                  <span className="text-sm leading-relaxed" style={{ color: "#cce4f7" }}>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Visual description */}
          {slide.visual && (
            <div className="mx-5 mb-5 rounded-xl px-4 py-3 flex items-start gap-2.5 relative"
              style={{ background: "rgba(3,45,96,0.8)", border: "1px solid rgba(1,118,211,0.2)" }}>
              <span className="text-base flex-shrink-0">🖼️</span>
              <p className="text-xs italic leading-relaxed" style={{ color: "#7eb3d8" }}>{slide.visual}</p>
            </div>
          )}
        </div>

        {/* Speaker notes */}
        {slide.speakerNotes && (
          <div className="mt-3 rounded-xl px-4 py-3 sf-notes-panel">
            <div className="flex items-center gap-2 mb-1.5">
              <span style={{ color: "#ff784f" }} className="text-xs font-bold tracking-wide">🎙️ SPEAKER NOTES</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,180,140,0.75)" }}>
              {slide.speakerNotes}
            </p>
          </div>
        )}

        {/* Keyboard hint */}
        <p className="text-center mt-3 text-xs" style={{ color: "rgba(126,179,216,0.4)" }}>
          ← → arrow keys · ⛶ Full Screen opens synced slideshow tab
        </p>
      </div>
    </div>
  );
}
