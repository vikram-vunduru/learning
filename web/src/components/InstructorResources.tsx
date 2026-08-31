"use client";

import { useState } from "react";
import { getResources, RESOURCE_META, type Resource, type ResourceType } from "@/lib/resources";

interface Props {
  moduleId: string;
  compact?: boolean; // compact = record-mode right panel; !compact = read-mode collapsible
}

const TYPE_ORDER: ResourceType[] = ["docs", "trailhead", "youtube", "video", "blog", "udemy"];

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     "rgba(59,167,85,0.2)",
  Intermediate: "rgba(255,183,93,0.2)",
  Advanced:     "rgba(227,27,27,0.15)",
};
const LEVEL_TEXT: Record<string, string> = {
  Beginner:     "#82d496",
  Intermediate: "#ffd49e",
  Advanced:     "#ff8080",
};

function ResourceCard({ r, compact }: { r: Resource; compact: boolean }) {
  const meta = RESOURCE_META[r.type];
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg transition-all hover:scale-[1.01] hover:shadow-lg group"
      style={{
        background: "rgba(3,45,96,0.45)",
        border: "1px solid rgba(1,118,211,0.18)",
        padding: compact ? "8px 10px" : "10px 14px",
        marginBottom: compact ? 6 : 8,
        textDecoration: "none",
      }}
    >
      <div className="flex items-start gap-2">
        {/* Type icon dot */}
        <span
          className="flex-shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs"
          style={{ background: `${meta.color}25`, border: `1px solid ${meta.color}40` }}
        >
          {meta.icon}
        </span>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <p
            className="font-medium leading-snug group-hover:underline"
            style={{
              color: "#cce4f7",
              fontSize: compact ? 12 : 13,
              marginBottom: 2,
            }}
          >
            {r.title}
          </p>

          {/* Description */}
          {!compact && r.description && (
            <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(126,179,216,0.65)" }}>
              {r.description}
            </p>
          )}
          {compact && r.description && (
            <p className="text-xs leading-tight mb-1.5" style={{ color: "rgba(126,179,216,0.55)", fontSize: 11 }}>
              {r.description.length > 80 ? r.description.slice(0, 80) + "…" : r.description}
            </p>
          )}

          {/* Badges row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {r.level && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                style={{
                  background: LEVEL_COLORS[r.level] ?? "rgba(126,179,216,0.1)",
                  color: LEVEL_TEXT[r.level] ?? "#7eb3d8",
                  fontSize: 10,
                }}
              >
                {r.level}
              </span>
            )}
            {r.duration && (
              <span className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(1,118,211,0.15)", color: "#7eb3d8", fontSize: 10 }}>
                ⏱ {r.duration}
              </span>
            )}
            <span className="text-xs ml-auto" style={{ color: meta.color, fontSize: 10 }}>
              {meta.label} ↗
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export function InstructorResources({ moduleId, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const resources = getResources(moduleId);

  if (resources.length === 0) return null;

  // Group by type, maintaining TYPE_ORDER
  const grouped: Partial<Record<ResourceType, Resource[]>> = {};
  for (const r of resources) {
    if (!grouped[r.type]) grouped[r.type] = [];
    grouped[r.type]!.push(r);
  }
  const presentTypes = TYPE_ORDER.filter((t) => grouped[t]?.length);

  // ── Compact (Record Mode) ─────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className="mt-4 rounded-lg overflow-hidden"
        style={{
          background: "rgba(2,14,31,0.7)",
          border: "1px solid rgba(0,161,224,0.2)",
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-white/5"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wide" style={{ color: "#00a1e0" }}>
              📚 INSTRUCTOR RESOURCES
            </span>
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-mono"
              style={{ background: "rgba(0,161,224,0.12)", color: "#7eb3d8" }}
            >
              {resources.length}
            </span>
          </div>
          <span className="text-xs" style={{ color: "#7eb3d8" }}>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="px-3 pb-3">
            {presentTypes.map((type) => {
              const meta = RESOURCE_META[type];
              const items = grouped[type]!;
              return (
                <div key={type} className="mb-3">
                  <p className="text-xs font-bold mb-1.5 px-1" style={{ color: meta.color }}>
                    {meta.icon} {meta.label}
                  </p>
                  {items.map((r, i) => (
                    <ResourceCard key={i} r={r} compact={true} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Full (Read Mode) ──────────────────────────────────────────────────────
  return (
    <div
      className="mt-8 rounded-xl overflow-hidden"
      style={{
        background: "rgba(3,45,96,0.3)",
        border: "1px solid rgba(0,161,224,0.25)",
      }}
    >
      {/* Header (always visible) */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0,161,224,0.15)", border: "1px solid rgba(0,161,224,0.3)" }}
          >
            <span>📚</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "#e8f4ff" }}>
              Instructor Resources
            </h3>
            <p className="text-xs" style={{ color: "#7eb3d8" }}>
              Salesforce docs · Trailhead · YouTube · Blogs — {resources.length} curated links
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {presentTypes.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: `${RESOURCE_META[t].color}18`, color: RESOURCE_META[t].color, fontSize: 11 }}
              >
                {RESOURCE_META[t].icon}
              </span>
            ))}
          </div>
          <span className="text-sm ml-1" style={{ color: "#7eb3d8" }}>{open ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="px-6 pb-6">
          {/* Accent rule */}
          <div className="mb-5 h-px" style={{ background: "linear-gradient(90deg, rgba(0,161,224,0.4), transparent)" }} />

          {presentTypes.map((type) => {
            const meta = RESOURCE_META[type];
            const items = grouped[type]!;
            return (
              <div key={type} className="mb-6 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-sm"
                    style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}35` }}
                  >
                    {meta.icon}
                  </span>
                  <h4 className="text-sm font-bold tracking-wide" style={{ color: meta.color }}>
                    {meta.label}
                  </h4>
                  <span className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: `${meta.color}15`, color: meta.color, fontSize: 10 }}>
                    {items.length}
                  </span>
                </div>

                <div className="grid gap-2">
                  {items.map((r, i) => (
                    <ResourceCard key={i} r={r} compact={false} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
