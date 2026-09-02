"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRACKS } from "@/lib/tracks";
import { ThemeToggle } from "@/components/ThemeToggle";

// Returns a small badge indicating module type
function TypeBadge({ type }: { type: string }) {
  if (type === "lab")
    return (
      <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-green-500/20 text-green-600 dark:text-green-400 flex-shrink-0">
        LAB
      </span>
    );
  if (type === "exam")
    return (
      <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-500 flex-shrink-0">
        EXAM
      </span>
    );
  if (type === "cheatsheet")
    return (
      <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 flex-shrink-0">
        CS
      </span>
    );
  return null;
}

// Returns active link color classes based on module type
function activeModClasses(type: string): string {
  if (type === "lab") return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-600/10 border-l-2 border-green-500";
  if (type === "exam") return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-600/10 border-l-2 border-amber-500";
  if (type === "cheatsheet") return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-600/10 border-l-2 border-purple-500";
  // lecture / study / default
  return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-600/15 border-l-2 border-blue-500";
}

export default function Sidebar() {
  const pathname = usePathname();

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
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl flex-shrink-0">🎓</span>
          <div className="min-w-0">
            <div className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
              CertStudio
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
              Learning Platform
            </div>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {/* Dashboard */}
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === "/"
              ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-medium"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <span className="flex-shrink-0">🏠</span>
          <span>Dashboard</span>
        </Link>

        {/* Tracks label */}
        <div className="pt-3 pb-1 px-3">
          <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Tracks
          </span>
        </div>

        {TRACKS.map((track) => {
          const isActive = pathname.startsWith(`/tracks/${track.id}`);
          const isPlanned = track.status === "planned";

          if (isPlanned) {
            return (
              <div
                key={track.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed select-none"
              >
                <span className="flex-shrink-0">{track.icon}</span>
                <span className="truncate">{track.title}</span>
                <span className="ml-auto text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded flex-shrink-0">
                  Soon
                </span>
              </div>
            );
          }

          const flatModules = track.modules.filter((m) => !m.course);

          const courseOrder: string[] = [];
          for (const mod of track.modules) {
            if (mod.course && !courseOrder.includes(mod.course))
              courseOrder.push(mod.course);
          }

          return (
            <div key={track.id}>
              {/* Track link */}
              <Link
                href={`/tracks/${track.id}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="flex-shrink-0">{track.icon}</span>
                <span className="truncate">{track.title}</span>
                <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-600/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded flex-shrink-0">
                  Active
                </span>
              </Link>

              {isActive && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-gray-200 dark:border-gray-700/60 pl-2">
                  {/* Flat (study) modules */}
                  {flatModules.map((mod) => {
                    const modPath = `/tracks/${track.id}/${mod.id}`;
                    const isModActive = pathname === modPath;
                    const modType = (mod as { type?: string }).type ?? "study";
                    return (
                      <Link
                        key={mod.id}
                        href={modPath}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors ${
                          isModActive
                            ? activeModClasses(modType)
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                      >
                        <TypeBadge type={modType} />
                        <span className="truncate">{mod.title.split("(")[0].trim()}</span>
                      </Link>
                    );
                  })}

                  {/* Course groups */}
                  {courseOrder.map((courseName) => {
                    const courseKey = `${track.id}|course:${courseName}`;
                    const isCourseOpen = openKeys.has(courseKey);
                    const courseMods = track.modules.filter(
                      (m) => m.course === courseName
                    );
                    const courseHasActive = courseMods.some(
                      (m) => pathname === `/tracks/${track.id}/${m.id}`
                    );

                    const totalMods = courseMods.length;

                    const overviewMods = courseMods.filter((m) => !m.section);
                    const sectionOrder: string[] = [];
                    for (const mod of courseMods) {
                      if (mod.section && !sectionOrder.includes(mod.section))
                        sectionOrder.push(mod.section);
                    }

                    // Prettify course name: title-case
                    const prettyName = courseName
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                      .join(" ");

                    return (
                      <div key={courseName} className="mt-1.5">
                        {/* Course toggle */}
                        <button
                          onClick={() => toggle(courseKey)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            courseHasActive
                              ? "bg-indigo-50 dark:bg-indigo-600/15 text-indigo-700 dark:text-indigo-300"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                        >
                          <span className="flex-shrink-0 text-[13px]">📚</span>
                          <span className="truncate flex-1 text-left">{prettyName}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0 mr-1">
                            {totalMods}
                          </span>
                          <span className="flex-shrink-0 text-gray-400 dark:text-gray-500 text-[10px]">
                            {isCourseOpen ? "▾" : "▸"}
                          </span>
                        </button>

                        {isCourseOpen && (
                          <div className="ml-2 mt-0.5 space-y-0.5 border-l border-gray-200 dark:border-gray-700/50 pl-2">
                            {/* Overview links */}
                            {overviewMods.map((mod) => {
                              const modPath = `/tracks/${track.id}/${mod.id}`;
                              const isModActive = pathname === modPath;
                              const modType = (mod as { type?: string }).type ?? "lecture";
                              return (
                                <Link
                                  key={mod.id}
                                  href={modPath}
                                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors ${
                                    isModActive
                                      ? activeModClasses(modType)
                                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                                  }`}
                                >
                                  <span className="text-gray-400 dark:text-gray-500 flex-shrink-0 text-[10px]">📋</span>
                                  <span className="truncate">{mod.title}</span>
                                </Link>
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
                                (m) => pathname === `/tracks/${track.id}/${m.id}`
                              );

                              return (
                                <div key={sectionName}>
                                  {/* Section toggle */}
                                  <button
                                    onClick={() => toggle(sectionKey)}
                                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wide transition-colors mt-0.5 ${
                                      sectionHasActive
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-600/10"
                                        : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                                    }`}
                                  >
                                    <span className="truncate">{sectionName}</span>
                                    <span className="flex-shrink-0 ml-1 normal-case text-[10px]">
                                      {isSectionOpen ? "▾" : "▸"}
                                    </span>
                                  </button>

                                  {isSectionOpen && (
                                    <div className="ml-2 mt-0.5 space-y-0.5 border-l border-gray-200 dark:border-gray-700/40 pl-2">
                                      {sectionMods.map((mod) => {
                                        const modPath = `/tracks/${track.id}/${mod.id}`;
                                        const isModActive = pathname === modPath;
                                        const modType =
                                          (mod as { type?: string }).type ?? "lecture";
                                        return (
                                          <Link
                                            key={mod.id}
                                            href={modPath}
                                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors ${
                                              isModActive
                                                ? activeModClasses(modType)
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                                            }`}
                                          >
                                            <TypeBadge type={modType} />
                                            <span className="truncate">
                                              {mod.title}
                                            </span>
                                          </Link>
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

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-gray-700">
        <a
          href="https://github.com/vikram-vunduru/learning"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <span>📂</span>
          <span>View on GitHub</span>
        </a>
      </div>
    </aside>
  );
}
