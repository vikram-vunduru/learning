"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRACKS } from "@/lib/tracks";

export default function Sidebar() {
  const pathname = usePathname();

  const activeTrackId = TRACKS.find((t) => pathname.startsWith(`/tracks/${t.id}`))?.id ?? null;

  // Keys for open course dropdowns: "<trackId>|course:<courseName>"
  // Keys for open section dropdowns: "<trackId>|section:<sectionName>"
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
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <div>
            <div className="font-bold text-white text-sm">CertStudio</div>
            <div className="text-xs text-gray-400">Learning Platform</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === "/" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
          }`}
        >
          <span>🏠</span> Dashboard
        </Link>

        <div className="pt-3 pb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
            Tracks
          </span>
        </div>

        {TRACKS.map((track) => {
          const isActive = pathname.startsWith(`/tracks/${track.id}`);
          const isPlanned = track.status === "planned";

          if (isPlanned) {
            return (
              <div key={track.id} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 cursor-not-allowed">
                <span>{track.icon}</span>
                <span>{track.title}</span>
                <span className="ml-auto text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Soon</span>
              </div>
            );
          }

          // Flat modules (no course): study docs
          const flatModules = track.modules.filter((m) => !m.course);

          // Course groups: collect unique course names preserving order
          const courseOrder: string[] = [];
          for (const mod of track.modules) {
            if (mod.course && !courseOrder.includes(mod.course)) courseOrder.push(mod.course);
          }

          return (
            <div key={track.id}>
              <Link
                href={`/tracks/${track.id}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? "bg-blue-600/20 text-blue-400" : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span>{track.icon}</span>
                <span>{track.title}</span>
                <span className="ml-auto text-xs bg-green-600/30 text-green-400 px-1.5 py-0.5 rounded">Active</span>
              </Link>

              {isActive && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {/* Flat study doc modules */}
                  {flatModules.map((mod) => {
                    const modPath = `/tracks/${track.id}/${mod.id}`;
                    const isModActive = pathname === modPath;
                    return (
                      <Link
                        key={mod.id}
                        href={modPath}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                          isModActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                        }`}
                      >
                        <span className="text-gray-500 flex-shrink-0">›</span>
                        <span className="truncate">{mod.title.split("(")[0].trim()}</span>
                      </Link>
                    );
                  })}

                  {/* Course groups */}
                  {courseOrder.map((courseName) => {
                    const courseKey = `${track.id}|course:${courseName}`;
                    const isCourseOpen = openKeys.has(courseKey);
                    const courseMods = track.modules.filter((m) => m.course === courseName);
                    const courseHasActive = courseMods.some((m) => pathname === `/tracks/${track.id}/${m.id}`);

                    // Overview module (no section, belongs to this course)
                    const overviewMods = courseMods.filter((m) => !m.section);

                    // Section names within this course
                    const sectionOrder: string[] = [];
                    for (const mod of courseMods) {
                      if (mod.section && !sectionOrder.includes(mod.section)) sectionOrder.push(mod.section);
                    }

                    return (
                      <div key={courseName} className="mt-2">
                        {/* Course parent toggle */}
                        <button
                          onClick={() => toggle(courseKey)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                            courseHasActive
                              ? "bg-purple-600/20 text-purple-300"
                              : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span>🎬</span>
                            <span className="truncate">COURSE: {courseName.toUpperCase()}</span>
                          </span>
                          <span className="ml-1 flex-shrink-0 text-gray-500">{isCourseOpen ? "▾" : "▸"}</span>
                        </button>

                        {isCourseOpen && (
                          <div className="ml-2 mt-0.5 space-y-0.5">
                            {/* Overview link(s) */}
                            {overviewMods.map((mod) => {
                              const modPath = `/tracks/${track.id}/${mod.id}`;
                              const isModActive = pathname === modPath;
                              return (
                                <Link
                                  key={mod.id}
                                  href={modPath}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                                    isModActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                  }`}
                                >
                                  <span className="text-gray-500 flex-shrink-0">📋</span>
                                  <span className="truncate">{mod.title}</span>
                                </Link>
                              );
                            })}

                            {/* Sections within the course */}
                            {sectionOrder.map((sectionName) => {
                              const sectionKey = `${track.id}|section:${sectionName}`;
                              const isSectionOpen = openKeys.has(sectionKey);
                              const sectionMods = courseMods.filter((m) => m.section === sectionName);
                              const sectionHasActive = sectionMods.some((m) => pathname === `/tracks/${track.id}/${m.id}`);

                              const sectionIcon =
                                sectionName.includes("Lab") ? "🧪" :
                                sectionName.includes("Exam") ? "📝" :
                                sectionName.includes("Ethics") || sectionName.includes("Ethical") ? "⚖️" :
                                sectionName.includes("Data") ? "🗄️" :
                                sectionName.includes("Generative") ? "🤖" :
                                sectionName.includes("Salesforce") ? "☁️" :
                                "📚";

                              return (
                                <div key={sectionName}>
                                  <button
                                    onClick={() => toggle(sectionKey)}
                                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-xs font-medium transition-colors mt-0.5 ${
                                      sectionHasActive
                                        ? "text-blue-400 bg-blue-600/10"
                                        : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                                    }`}
                                  >
                                    <span className="flex items-center gap-1.5 truncate">
                                      <span>{sectionIcon}</span>
                                      <span className="truncate uppercase tracking-wide text-[10px]">{sectionName}</span>
                                    </span>
                                    <span className="ml-1 flex-shrink-0 text-gray-600">
                                      {isSectionOpen ? "▾" : "▸"}
                                    </span>
                                  </button>

                                  {isSectionOpen && (
                                    <div className="ml-3 space-y-0.5">
                                      {sectionMods.map((mod) => {
                                        const modPath = `/tracks/${track.id}/${mod.id}`;
                                        const isModActive = pathname === modPath;
                                        return (
                                          <Link
                                            key={mod.id}
                                            href={modPath}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                                              isModActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                            }`}
                                          >
                                            <span className="text-gray-600 flex-shrink-0">›</span>
                                            <span className="truncate">{mod.title}</span>
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

      <div className="p-3 border-t border-gray-700">
        <a
          href="https://github.com/vikram-vunduru/learning"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:bg-gray-800 transition-colors"
        >
          <span>📂</span> View on GitHub
        </a>
      </div>
    </aside>
  );
}
