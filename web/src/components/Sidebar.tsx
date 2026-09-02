"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Cloud,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  BookOpen,
  FlaskConical,
  ClipboardList,
  FileText,
  Check,
  GitFork,
  X,
} from "lucide-react";
import { TRACKS } from "@/lib/tracks";
import { ThemeToggle } from "@/components/ThemeToggle";

// ── Progress tracking via localStorage ───────────────────────
function useCompleted() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem("certStudioCompleted") ?? "[]";
      setCompleted(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  return completed;
}

// ── Mini progress bar ─────────────────────────────────────────
function MiniProgress({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <div
        style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          background: "var(--mastery-soft)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "var(--mastery)",
            borderRadius: 2,
            transition: "width 300ms ease-out",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
        }}
      >
        {done}/{total}
      </span>
    </div>
  );
}

// ── Type badge chips (lab / exam / cheatsheet only) ───────────
function TypeBadge({ type }: { type: string }) {
  const base: React.CSSProperties = {
    fontSize: "0.625rem",
    fontWeight: 700,
    padding: "1px 4px",
    borderRadius: "var(--radius-sm)",
    flexShrink: 0,
    lineHeight: 1.4,
    letterSpacing: "0.03em",
  };
  if (type === "lab")
    return (
      <span
        style={{
          ...base,
          background: "rgba(61,190,122,0.15)",
          color: "var(--success)",
        }}
      >
        LAB
      </span>
    );
  if (type === "exam")
    return (
      <span
        style={{
          ...base,
          background: "var(--mastery-soft)",
          color: "var(--mastery)",
        }}
      >
        EXAM
      </span>
    );
  if (type === "cheatsheet")
    return (
      <span
        style={{
          ...base,
          background: "rgba(155,89,255,0.15)",
          color: "#9B59FF",
        }}
      >
        CS
      </span>
    );
  return null;
}

// ── Lesson type icon (for lecture / study / fallback) ─────────
function LessonTypeIcon({ type }: { type: string }) {
  const s: React.CSSProperties = { flexShrink: 0, color: "var(--text-muted)" };
  if (type === "lab") return <FlaskConical size={16} strokeWidth={1.75} style={s} />;
  if (type === "exam") return <ClipboardList size={16} strokeWidth={1.75} style={s} />;
  if (type === "cheatsheet" || type === "study")
    return <FileText size={16} strokeWidth={1.75} style={s} />;
  return <BookOpen size={16} strokeWidth={1.75} style={s} />;
}

// ── Shared hover bg constants ─────────────────────────────────
const HOVER_BG = "rgba(91,149,245,0.08)";
const ACTIVE_BG = "var(--accent-soft)";

// ── Dashboard / flat nav link ─────────────────────────────────
function NavRowLink({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 10px",
        height: 36,
        borderRadius: "var(--radius-sm)",
        textDecoration: "none",
        color: active ? "var(--accent)" : "var(--text)",
        fontWeight: active ? 500 : 400,
        background: active ? ACTIVE_BG : hovered ? HOVER_BG : "transparent",
        borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
        transition: "background 150ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      <span
        style={{
          fontSize: "0.9375rem",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </Link>
  );
}

// ── Track row ─────────────────────────────────────────────────
function TrackRowLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 10px",
        height: 36,
        borderRadius: "var(--radius-sm)",
        textDecoration: "none",
        color: active ? "var(--accent)" : "var(--text)",
        fontWeight: active ? 600 : 400,
        background: !active && hovered ? HOVER_BG : "transparent",
        transition: "background 150ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Cloud size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
      <span
        style={{
          fontSize: "0.9375rem",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      {active && (
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
            flexShrink: 0,
          }}
        />
      )}
    </Link>
  );
}

// ── Lesson row link ───────────────────────────────────────────
function LessonRowLink({
  href,
  type,
  active,
  done,
  title,
}: {
  href: string;
  type: string;
  active: boolean;
  done: boolean;
  title: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "0 8px",
        height: 36,
        borderRadius: "var(--radius-sm)",
        textDecoration: "none",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        fontWeight: active ? 500 : 400,
        fontSize: "0.8125rem",
        background: active ? ACTIVE_BG : hovered ? HOVER_BG : "transparent",
        borderLeft: active
          ? "2px solid var(--accent)"
          : "2px solid transparent",
        transition: "background 150ms",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* type badge for lab/exam/cheatsheet */}
      <TypeBadge type={type} />
      {/* completion / current indicator */}
      {done ? (
        <Check
          size={13}
          strokeWidth={2.25}
          style={{ flexShrink: 0, color: "var(--success)" }}
        />
      ) : active ? (
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--accent)",
            flexShrink: 0,
          }}
        />
      ) : null}
      <span
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </span>
    </Link>
  );
}

// ── Cert (course) row button ──────────────────────────────────
function CertRowButton({
  label,
  active,
  open,
  done,
  total,
  onClick,
}: {
  label: string;
  active: boolean;
  open: boolean;
  done: number;
  total: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "0 8px",
        height: 36,
        width: "100%",
        borderRadius: "var(--radius-sm)",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--accent)" : "var(--text)",
        fontWeight: active ? 600 : 500,
        background: hovered ? HOVER_BG : "transparent",
        transition: "background 150ms",
        textAlign: "left",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {open ? (
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          style={{ flexShrink: 0, color: "var(--text-muted)" }}
        />
      ) : (
        <ChevronRight
          size={14}
          strokeWidth={1.75}
          style={{ flexShrink: 0, color: "var(--text-muted)" }}
        />
      )}
      <span
        style={{
          fontSize: "0.8125rem",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <MiniProgress done={done} total={total} />
    </button>
  );
}

// ── Section header row ────────────────────────────────────────
function SectionRowButton({
  label,
  active,
  open,
  onClick,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "0 6px",
        height: 30,
        width: "100%",
        borderRadius: "var(--radius-sm)",
        border: "none",
        cursor: "pointer",
        color: active ? "var(--accent)" : "var(--text-secondary)",
        fontWeight: 500,
        fontSize: "0.8125rem",
        background: hovered ? HOVER_BG : "transparent",
        transition: "background 150ms",
        textAlign: "left",
        marginTop: 2,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {open ? (
        <ChevronDown size={13} strokeWidth={1.75} style={{ flexShrink: 0 }} />
      ) : (
        <ChevronRight size={13} strokeWidth={1.75} style={{ flexShrink: 0 }} />
      )}
      <span
        style={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────
interface SidebarProps { onClose?: () => void; }

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const completed = useCompleted();

  const activeTrackId =
    TRACKS.find((t) => pathname.startsWith(`/tracks/${t.id}`))?.id ?? null;

  const [openKeys, setOpenKeys] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const track of TRACKS) {
      if (!pathname.startsWith(`/tracks/${track.id}`)) continue;
      for (const mod of track.modules) {
        if (pathname !== `/tracks/${track.id}/${mod.id}`) continue;
        if (mod.course) initial.add(`${track.id}|course:${mod.course}`);
        if (mod.section) initial.add(`${track.id}|section:${mod.section}`);
      }
    }
    return initial;
  });

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "var(--sidebar-width)",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
        overflowX: "hidden",
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div
        style={{
          height: "var(--header-height)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
            textDecoration: "none",
          }}
        >
          <GraduationCap
            size={20}
            strokeWidth={1.75}
            style={{ flexShrink: 0, color: "var(--accent)" }}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "var(--text)",
                lineHeight: 1.2,
              }}
            >
              CertStudio
            </div>
            <div
              style={{
                fontSize: "0.6875rem",
                color: "var(--text-muted)",
                lineHeight: 1.2,
              }}
            >
              Learning Platform
            </div>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ThemeToggle />
          {onClose && (
            <button
              onClick={onClose}
              className="sidebar-close-btn"
              title="Close menu"
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <X size={16} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {/* Dashboard */}
        <NavRowLink
          href="/"
          active={pathname === "/"}
          icon={
            <LayoutDashboard size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
          }
          label="Dashboard"
        />

        {/* Tracks section label */}
        <div style={{ paddingTop: 16, paddingBottom: 4, paddingLeft: 10 }}>
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            Tracks
          </span>
        </div>

        {TRACKS.map((track) => {
          const isActive = track.id === activeTrackId;
          const isPlanned = track.status === "planned";

          /* ── Planned track row (non-clickable) ─────────── */
          if (isPlanned) {
            return (
              <div
                key={track.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 10px",
                  height: 36,
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-muted)",
                  cursor: "not-allowed",
                  userSelect: "none",
                }}
              >
                <Cloud size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: "0.9375rem",
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {track.title}
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(107,118,145,0.15)",
                    color: "var(--text-muted)",
                    flexShrink: 0,
                  }}
                >
                  Soon
                </span>
              </div>
            );
          }

          /* Separate flat modules (no course) from cert modules */
          const flatModules = track.modules.filter((m) => !m.course);

          const courseOrder: string[] = [];
          for (const mod of track.modules) {
            if (mod.course && !courseOrder.includes(mod.course))
              courseOrder.push(mod.course);
          }

          return (
            <div key={track.id}>
              {/* ── Active / available track row ─────────── */}
              <TrackRowLink
                href={`/tracks/${track.id}`}
                active={isActive}
                label={track.title}
              />

              {/* ── Expanded track content ─────────────── */}
              {isActive && (
                <div
                  style={{
                    marginLeft: 12,
                    marginTop: 4,
                    paddingLeft: 10,
                    borderLeft: "1px solid var(--border)",
                  }}
                >
                  {/* Flat study doc links */}
                  {flatModules.map((mod) => {
                    const modPath = `/tracks/${track.id}/${mod.id}`;
                    const modType =
                      (mod as { type?: string }).type ?? "study";
                    return (
                      <LessonRowLink
                        key={mod.id}
                        href={modPath}
                        type={modType}
                        active={pathname === modPath}
                        done={completed.has(mod.id)}
                        title={mod.title.split("(")[0].trim()}
                      />
                    );
                  })}

                  {/* Thin divider between flat links and cert groups */}
                  {flatModules.length > 0 && courseOrder.length > 0 && (
                    <div
                      style={{
                        height: 1,
                        background: "var(--border)",
                        margin: "6px 0",
                      }}
                    />
                  )}

                  {/* Certifications group header */}
                  {courseOrder.length > 0 && (
                    <div
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        padding: "4px 4px 2px",
                        letterSpacing: "0.02em",
                      }}
                    >
                      Certifications
                    </div>
                  )}

                  {/* ── Cert groups ────────────────────── */}
                  {courseOrder.map((courseName) => {
                    const courseKey = `${track.id}|course:${courseName}`;
                    const isCourseOpen = openKeys.has(courseKey);
                    const courseMods = track.modules.filter(
                      (m) => m.course === courseName
                    );
                    const courseHasActive = courseMods.some(
                      (m) => pathname === `/tracks/${track.id}/${m.id}`
                    );
                    const completedCount = courseMods.filter((m) =>
                      completed.has(m.id)
                    ).length;
                    const totalMods = courseMods.length;

                    const overviewMods = courseMods.filter((m) => !m.section);
                    const sectionOrder: string[] = [];
                    for (const mod of courseMods) {
                      if (mod.section && !sectionOrder.includes(mod.section))
                        sectionOrder.push(mod.section);
                    }

                    // Sentence-case: first letter uppercase, rest unchanged
                    const prettyName =
                      courseName.charAt(0).toUpperCase() +
                      courseName.slice(1);

                    return (
                      <div key={courseName} style={{ marginTop: 2 }}>
                        {/* Cert toggle row */}
                        <CertRowButton
                          label={prettyName}
                          active={courseHasActive}
                          open={isCourseOpen}
                          done={completedCount}
                          total={totalMods}
                          onClick={() => toggle(courseKey)}
                        />

                        {/* ── Course lessons ─────────── */}
                        {isCourseOpen && (
                          <div
                            style={{
                              marginLeft: 8,
                              marginTop: 2,
                              paddingLeft: 8,
                              borderLeft: "1px solid var(--border)",
                            }}
                          >
                            {/* Overview link(s) */}
                            {overviewMods.map((mod) => {
                              const modPath = `/tracks/${track.id}/${mod.id}`;
                              const modType =
                                (mod as { type?: string }).type ?? "lecture";
                              return (
                                <LessonRowLink
                                  key={mod.id}
                                  href={modPath}
                                  type={modType}
                                  active={pathname === modPath}
                                  done={completed.has(mod.id)}
                                  title={mod.title}
                                />
                              );
                            })}

                            {/* Sections */}
                            {sectionOrder.map((sectionName) => {
                              const sectionKey = `${track.id}|section:${sectionName}`;
                              const isSectionOpen = openKeys.has(sectionKey);
                              const sectionMods = courseMods.filter(
                                (m) => m.section === sectionName
                              );
                              const sectionHasActive = sectionMods.some(
                                (m) =>
                                  pathname === `/tracks/${track.id}/${m.id}`
                              );

                              return (
                                <div key={sectionName}>
                                  {/* Section toggle */}
                                  <SectionRowButton
                                    label={sectionName}
                                    active={sectionHasActive}
                                    open={isSectionOpen}
                                    onClick={() => toggle(sectionKey)}
                                  />

                                  {/* Lessons within section */}
                                  {isSectionOpen && (
                                    <div
                                      style={{
                                        marginLeft: 6,
                                        paddingLeft: 8,
                                        borderLeft:
                                          "1px solid var(--border)",
                                      }}
                                    >
                                      {sectionMods.map((mod) => {
                                        const modPath = `/tracks/${track.id}/${mod.id}`;
                                        const modType =
                                          (mod as { type?: string }).type ??
                                          "lecture";
                                        return (
                                          <LessonRowLink
                                            key={mod.id}
                                            href={modPath}
                                            type={modType}
                                            active={pathname === modPath}
                                            done={completed.has(mod.id)}
                                            title={mod.title}
                                          />
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <a
          href="https://github.com/vikram-vunduru/learning"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "0.8125rem",
            whiteSpace: "nowrap",
          }}
        >
          <GitFork size={16} strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <span>GitHub</span>
        </a>
        <ThemeToggle />
      </div>
    </aside>
  );
}
