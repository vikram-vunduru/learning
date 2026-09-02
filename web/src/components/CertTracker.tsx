"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { Cert } from "@/lib/tracks";

interface Props {
  certs: Cert[];
  trackId: string;
}

export default function CertTracker({ certs, trackId }: Props) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem(`progress_${trackId}_certs`);
    if (saved) setCompleted(new Set(JSON.parse(saved)));
  }, [trackId]);

  const toggle = (certId: string) => {
    const next = new Set(completed);
    next.has(certId) ? next.delete(certId) : next.add(certId);
    setCompleted(next);
    localStorage.setItem(`progress_${trackId}_certs`, JSON.stringify([...next]));
  };

  const pct = certs.length > 0 ? Math.round((completed.size / certs.length) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
          Certification Tracker
        </h2>
        <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
          {completed.size} / {certs.length}
        </span>
      </div>

      {/* Overall progress bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-1">
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Overall progress</span>
          <span style={{ fontSize: "0.75rem", color: "var(--mastery)", fontWeight: 600 }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: "var(--mastery-soft)", borderRadius: 3, overflow: "hidden" }}>
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: "var(--mastery)",
              borderRadius: 3,
              transition: "width 400ms ease-out",
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {certs.map((cert) => {
          const done = completed.has(cert.id);
          return (
            <div
              key={cert.id}
              onClick={() => toggle(cert.id)}
              className="flex items-center gap-3 rounded-lg"
              style={{
                padding: "10px 12px",
                background: done ? "rgba(61,190,122,0.08)" : "var(--surface-raised)",
                border: `1px solid ${done ? "var(--success)" : "var(--border)"}`,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 20, height: 20,
                  borderRadius: "var(--radius-sm)",
                  border: `2px solid ${done ? "var(--success)" : "var(--border-strong)"}`,
                  background: done ? "var(--success)" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                {done && <Check size={12} strokeWidth={2.5} style={{ color: "#fff" }} />}
              </div>

              <div className="flex-1 min-w-0">
                <div style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: done ? "var(--text-muted)" : "var(--text)",
                  textDecoration: done ? "line-through" : "none",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {cert.name}
                </div>
                <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: 1 }}>
                  Month {cert.month} · {cert.questions} Qs · {cert.passScore} pass · {cert.cost}
                </div>
              </div>

              {cert.id === "cta" && (
                <span style={{
                  fontSize: "0.6875rem", fontWeight: 600,
                  background: "var(--mastery-soft)",
                  color: "var(--mastery)",
                  border: "1px solid var(--mastery)",
                  padding: "2px 7px",
                  borderRadius: 99,
                  flexShrink: 0,
                }}>
                  Pinnacle
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
