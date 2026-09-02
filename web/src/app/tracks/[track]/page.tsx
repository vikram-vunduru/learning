import { notFound } from "next/navigation";
import Link from "next/link";
import { TRACKS, getTrack } from "@/lib/tracks";
import CertTracker from "@/components/CertTracker";
import { Cloud } from "lucide-react";

export function generateStaticParams() {
  return TRACKS.filter((t) => t.status === "active").map((t) => ({ track: t.id }));
}

interface Props {
  params: Promise<{ track: string }>;
}

export default async function TrackPage({ params }: Props) {
  const { track: trackId } = await params;
  const track = getTrack(trackId);
  if (!track || track.status !== "active") notFound();

  return (
    <div className="p-8" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="mb-8">
        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
          Track
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text)", margin: 0, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
          <Cloud size={24} strokeWidth={1.75} style={{ color: "var(--accent)" }} />
          {track.title}
        </h1>
        <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9375rem" }}>{track.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Modules */}
        <div className="col-span-2">
          <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text)", marginBottom: 16, marginTop: 0 }}>
            Study Modules
          </h2>
          <div className="flex flex-col gap-2">
            {track.modules.map((mod, i) => (
              <Link
                key={mod.id}
                href={`/tracks/${track.id}/${mod.id}`}
                className="flex items-center gap-4 rounded-xl hover-border"
                style={{
                  padding: "14px 16px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  transition: "border-color 0.15s",
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 36, height: 36,
                    borderRadius: "50%",
                    background: "var(--accent-soft)",
                    border: "1px solid var(--accent)",
                    color: "var(--accent)",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontWeight: 500, color: "var(--text)", fontSize: "0.9375rem" }}>
                    {mod.title}
                  </div>
                  {mod.month && mod.month > 0 && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
                      Month {mod.month}
                    </div>
                  )}
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Cert tracker panel */}
        {track.certs && (
          <div
            className="rounded-xl p-5 h-fit"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <CertTracker certs={track.certs} trackId={track.id} />
          </div>
        )}
      </div>
    </div>
  );
}
