"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { ContentSections, ParsedSlide } from "@/lib/content";
import type { Module } from "@/lib/tracks";
import { getSlideIcon } from "@/components/SlideIcons";

interface Props {
  sections: ContentSections;
  mod: Module;
  trackId: string;
  prevId: string | null;
  nextId: string | null;
}

const CHANNEL_NAME = "cert-studio-slides";

const SECTION_COLORS: Record<string, { dot: string; accent: string; badge: string }> = {
  default:           { dot: "#00a1e0", accent: "#0176d3", badge: "rgba(0,161,224,0.12)" },
  "AI Fundamentals": { dot: "#1589ee", accent: "#0176d3", badge: "rgba(21,137,238,0.12)" },
  "Generative AI":   { dot: "#9c59ff", accent: "#7040cc", badge: "rgba(156,89,255,0.12)" },
  "Salesforce":      { dot: "#00a1e0", accent: "#0176d3", badge: "rgba(0,161,224,0.12)" },
  "Ethical":         { dot: "#ffb75d", accent: "#e87c1b", badge: "rgba(255,183,93,0.12)" },
  "Data":            { dot: "#3ba755", accent: "#2a8040", badge: "rgba(59,167,85,0.12)" },
  "Hands-On":        { dot: "#ff784f", accent: "#c9451a", badge: "rgba(255,120,79,0.12)" },
  "Exam":            { dot: "#e31b1b", accent: "#a31111", badge: "rgba(227,27,27,0.08)" },
};

function getColors(title: string) {
  for (const [key, val] of Object.entries(SECTION_COLORS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return SECTION_COLORS.default;
}

function SFCloud({ size = 24, color = "#00a1e0" }: { size?: number; color?: string }) {
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

export function FullScreenSlides({ sections, mod, trackId, prevId, nextId }: Props) {
  const [current, setCurrent] = useState(0);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const slides: ParsedSlide[] = sections.slidesData;
  const total = slides.length;

  const broadcastSlide = useCallback((index: number) => {
    channelRef.current?.postMessage({ slideIndex: index, source: "fullscreen" });
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
      if (e.data?.slideIndex !== undefined && e.data.source !== "fullscreen") setCurrent(e.data.slideIndex);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(current - 1);
      if (e.key === "Escape") window.close();
    };
    window.addEventListener("keydown", onKey);
    return () => { bc.close(); window.removeEventListener("keydown", onKey); };
  }, [current, goTo]);

  if (!slides.length) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020e1f" }}>
        <div className="text-center">
          <SFCloud size={48} color="#0176d3" />
          <p className="text-xl mt-4 mb-6" style={{ color: "#7eb3d8" }}>No slides available for this lecture.</p>
          <Link href={`/tracks/${trackId}/${mod.id}`} style={{ color: "#00a1e0" }} className="hover:underline">
            ← Back to lecture
          </Link>
        </div>
      </div>
    );
  }

  const slide = slides[current];
  const colors = getColors(mod.title);
  const progress = ((current + 1) / total) * 100;

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 20% 50%, #04194a 0%, #020e1f 60%)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-8 py-3 flex-shrink-0 border-b"
        style={{ background: "rgba(2,22,48,0.95)", borderColor: "rgba(1,118,211,0.25)", backdropFilter: "blur(10px)" }}
      >
        {/* Left: SF branding + title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SFCloud size={22} color="#00a1e0" />
            <span className="text-xs font-bold tracking-widest" style={{ color: "#0176d3" }}>CERT STUDIO</span>
          </div>
          <span style={{ color: "rgba(126,179,216,0.3)" }}>|</span>
          <span className="text-sm truncate max-w-xs" style={{ color: "#7eb3d8" }}>{mod.title}</span>
        </div>

        {/* Centre: dot nav */}
        <div className="flex gap-1.5 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === current ? 20 : 7,
                height: 7,
                background: i === current ? "#00a1e0" : "rgba(255,255,255,0.12)",
                boxShadow: i === current ? "0 0 10px rgba(0,161,224,0.9)" : "none",
              }}
            />
          ))}
        </div>

        {/* Right: slide count + close */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono" style={{ color: "#7eb3d8" }}>
            <span className="font-bold text-white">{current + 1}</span> / {total}
          </span>
          <button
            onClick={() => window.close()}
            className="text-xs px-3 py-1.5 rounded transition-colors"
            style={{ color: "#7eb3d8", background: "rgba(1,118,211,0.1)", border: "1px solid rgba(1,118,211,0.2)" }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 flex-shrink-0" style={{ background: "rgba(1,118,211,0.1)" }}>
        <div className="h-full sf-progress-bar transition-all duration-400" style={{ width: `${progress}%` }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 py-8">
        <div className="w-full max-w-5xl">

          {/* Slide card */}
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(145deg, #032d60 0%, #041e3d 70%, #021628 100%)",
              border: `1px solid ${colors.accent}50`,
              boxShadow: `0 0 0 1px ${colors.accent}20, 0 30px 80px rgba(2,14,31,0.8), 0 0 120px ${colors.dot}08`,
            }}
          >
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
              <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-10"
                style={{ background: `radial-gradient(circle, ${colors.dot}, transparent)`, animation: "orb-drift 14s ease-in-out infinite" }} />
              <div className="absolute -bottom-12 -left-12 w-60 h-60 rounded-full opacity-8"
                style={{ background: "radial-gradient(circle, #0176d3, transparent)", animation: "orb-drift 18s ease-in-out infinite reverse" }} />
              <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-5"
                style={{ background: `radial-gradient(circle, ${colors.dot}, transparent)`, animation: "orb-drift 22s ease-in-out infinite 4s" }} />
            </div>

            {/* Salesforce gradient top bar */}
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.dot}, transparent)` }} />

            {/* Card header */}
            <div className="flex items-start justify-between px-10 pt-7 pb-2 relative">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold px-3 py-1 rounded-full font-mono"
                  style={{ background: `${colors.accent}25`, color: colors.dot, border: `1px solid ${colors.accent}40` }}>
                  {String(slide.number).padStart(2, "0")}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: colors.badge, color: colors.dot, border: `1px solid ${colors.dot}30` }}>
                  Salesforce AI Associate
                </span>
              </div>
              {/* Large floating topic illustration */}
              <div className="anim-icon-pulse" style={{ opacity: 0.5 }}>
                {getSlideIcon(slide.title, mod.title, colors.dot)}
              </div>
            </div>

            {/* Title — animated entrance per slide */}
            <div className="px-10 pt-3 pb-4 relative anim-slide-up" key={`fs-title-${slide.number}`}>
              <h1 className="text-4xl font-bold leading-tight"
                style={{ color: "#e8f4ff", textShadow: `0 4px 30px ${colors.dot}30, 0 2px 8px rgba(0,0,0,0.5)` }}>
                {slide.title}
              </h1>
            </div>

            {/* Accent rule */}
            <div className="mx-10 mb-7 h-px"
              style={{ background: `linear-gradient(90deg, ${colors.dot}, ${colors.dot}50, transparent)` }} />

            {/* Bullets — staggered entrance */}
            {slide.bullets.length > 0 && (
              <ul className="px-10 pb-8 space-y-5 relative" key={`fs-bullets-${slide.number}`}>
                {slide.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-4 anim-slide-left"
                    style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="mt-2.5 w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: colors.dot, boxShadow: `0 0 10px ${colors.dot}` }} />
                    <span className="text-xl leading-relaxed" style={{ color: "#cce4f7" }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Visual description */}
            {slide.visual && (
              <div className="mx-8 mb-7 rounded-2xl px-6 py-4 flex items-start gap-3 relative"
                style={{ background: "rgba(3,45,96,0.7)", border: `1px solid ${colors.accent}30` }}>
                <span className="text-xl flex-shrink-0 mt-0.5">🖼️</span>
                <p className="text-sm italic leading-relaxed" style={{ color: "#7eb3d8" }}>{slide.visual}</p>
              </div>
            )}
          </div>

          {/* Speaker notes */}
          {slide.speakerNotes && (
            <div
              className="mt-5 rounded-2xl px-6 py-4 sf-notes-panel"
            >
              <p className="text-xs font-bold mb-2 tracking-wide" style={{ color: "#ff784f" }}>
                🎙️ SPEAKER NOTES
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,180,140,0.7)" }}>
                {slide.speakerNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div
        className="flex items-center justify-between px-10 py-4 flex-shrink-0 border-t"
        style={{ background: "rgba(2,22,48,0.95)", borderColor: "rgba(1,118,211,0.2)" }}
      >
        <div>
          {prevId && (
            <Link
              href={`/slides/${trackId}/${prevId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ color: "#7eb3d8", background: "rgba(1,118,211,0.1)", border: "1px solid rgba(1,118,211,0.2)" }}
            >
              ← Prev Lecture
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
            style={{ background: "rgba(1,118,211,0.15)", color: "#7eb3d8", border: "1px solid rgba(1,118,211,0.3)" }}
          >
            ← Prev Slide
          </button>
          <span className="text-xs font-mono px-3" style={{ color: "rgba(126,179,216,0.5)" }}>
            {current + 1} / {total}
          </span>
          <button
            onClick={() => goTo(current + 1)}
            disabled={current === total - 1}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-30"
            style={{
              background: "linear-gradient(135deg, #0176d3, #1589ee)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(1,118,211,0.4)",
            }}
          >
            Next Slide →
          </button>
        </div>

        <div>
          {nextId && (
            <Link
              href={`/slides/${trackId}/${nextId}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ color: "#7eb3d8", background: "rgba(1,118,211,0.1)", border: "1px solid rgba(1,118,211,0.2)" }}
            >
              Next Lecture →
            </Link>
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      <div
        className="text-center py-2"
        style={{ background: "rgba(2,14,31,0.8)" }}
      >
        <p className="text-xs" style={{ color: "rgba(126,179,216,0.3)" }}>
          ← → arrow keys to navigate · Esc to close
        </p>
      </div>
    </div>
  );
}
