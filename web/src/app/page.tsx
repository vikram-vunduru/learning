import Link from "next/link";
import { TRACKS } from "@/lib/tracks";
import { Award, Calendar, DollarSign, Layers, Cloud, ChevronRight } from "lucide-react";

export default function Dashboard() {
  const activeTrack = TRACKS.find((t) => t.status === "active");

  const months = [
    { num: 1, cert: "AI Associate" },
    { num: 2, cert: "Administrator" },
    { num: 3, cert: "Platform App Builder" },
    { num: 4, cert: "Platform Developer I" },
    { num: 5, cert: "JavaScript Dev I" },
    { num: 6, cert: "Data 360 Consultant" },
    { num: 7, cert: "Agentforce Specialist" },
    { num: 8, cert: "PDII + Adv Admin" },
    { num: 9, cert: "Data + Sharing → App Arch" },
    { num: 10, cert: "Integration + DevOps Arch" },
    { num: 11, cert: "IAM + Mobile → Sys Arch" },
    { num: 12, cert: "CTA Board Prep" },
  ];

  const stats = [
    { label: "Total Certifications", value: "16", sub: "on CTA path", Icon: Award },
    { label: "Study Months", value: "12", sub: "target timeline", Icon: Calendar },
    { label: "Estimated Cost", value: "$5,075", sub: "all exams", Icon: DollarSign },
    { label: "Tech Tracks", value: "5", sub: "planned total", Icon: Layers },
  ];

  return (
    <div className="dashboard-page" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, color: "var(--text)", margin: 0, marginBottom: 4 }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9375rem" }}>
          Your personal path to Salesforce Technical Architect and beyond
        </p>
      </div>

      {/* Active track banner */}
      {activeTrack && (
        <div
          className="rounded-xl mb-6"
          style={{
            background: "linear-gradient(135deg, #1d3a6e 0%, #0f2447 100%)",
            border: "1px solid var(--border-strong)",
            padding: "clamp(16px, 4vw, 24px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "var(--accent)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
                Active Track
              </div>
              <h2 style={{ fontSize: "clamp(1.125rem, 3vw, 1.5rem)", fontWeight: 700, color: "var(--text)", margin: 0, marginBottom: 4, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Cloud size={20} strokeWidth={1.75} style={{ color: "var(--accent)", flexShrink: 0 }} />
                {activeTrack.title} → CTA
              </h2>
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>
                {activeTrack.description}
              </p>
            </div>
            <Link
              href={`/tracks/${activeTrack.id}`}
              style={{
                background: "var(--accent)", color: "#fff", fontWeight: 600,
                padding: "8px 16px", borderRadius: "var(--radius-md)",
                textDecoration: "none", fontSize: "0.875rem",
                flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
                whiteSpace: "nowrap",
              }}
            >
              Continue <ChevronRight size={14} strokeWidth={2} />
            </Link>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {stats.map(({ label, value, sub, Icon }) => (
          <div
            key={label}
            className="rounded-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "clamp(12px, 3vw, 20px)" }}
          >
            <Icon size={18} strokeWidth={1.75} style={{ color: "var(--accent)", marginBottom: 8 }} />
            <div style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)", fontWeight: 700, color: "var(--text)", lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text)", marginTop: 2 }}>{label}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* 12-month timeline */}
        <div
          className="rounded-xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "clamp(16px, 4vw, 24px)" }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", margin: 0, marginBottom: 16 }}>
            12-Month CTA Sprint
          </h2>
          <div className="months-grid">
            {months.map((m) => (
              <div
                key={m.num}
                className="flex items-center gap-3 rounded-lg"
                style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", padding: "10px 12px" }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "var(--accent-soft)", border: "1px solid var(--accent)",
                  }}
                >
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--accent)" }}>{m.num}</span>
                </div>
                <div className="min-w-0">
                  <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.cert}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>Month {m.num}</div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/tracks/salesforce/roadmap"
            style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: "0.875rem", color: "var(--accent)", textDecoration: "none" }}
          >
            View full roadmap →
          </Link>
        </div>

        {/* All tracks */}
        <div
          className="rounded-xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "clamp(16px, 4vw, 24px)" }}
        >
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)", margin: 0, marginBottom: 16 }}>
            All Tracks
          </h2>
          <div className="flex flex-col gap-3">
            {TRACKS.map((track) => (
              <div key={track.id}>
                {track.status === "active" ? (
                  <Link
                    href={`/tracks/${track.id}`}
                    className="flex items-center gap-3 rounded-lg"
                    style={{ background: "var(--accent-soft)", border: "1px solid var(--accent)", textDecoration: "none", padding: "10px 12px" }}
                  >
                    <Cloud size={16} strokeWidth={1.75} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>{track.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.description}</div>
                    </div>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 600, background: "var(--success)", color: "#fff", padding: "2px 7px", borderRadius: 99, flexShrink: 0 }}>Active</span>
                  </Link>
                ) : (
                  <div
                    className="flex items-center gap-3 rounded-lg"
                    style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", opacity: 0.6, padding: "10px 12px" }}
                  >
                    <Cloud size={16} strokeWidth={1.75} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>{track.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.description}</div>
                    </div>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 600, background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 99, flexShrink: 0 }}>Soon</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
