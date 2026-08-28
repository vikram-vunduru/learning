"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TRACKS } from "@/lib/tracks";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="font-bold text-white text-sm">TechMaster</div>
            <div className="text-xs text-gray-400">Learning Platform</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === "/"
              ? "bg-blue-600 text-white"
              : "text-gray-300 hover:bg-gray-800"
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

          return (
            <div key={track.id}>
              {isPlanned ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 cursor-not-allowed">
                  <span>{track.icon}</span>
                  <span>{track.title}</span>
                  <span className="ml-auto text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">
                    Soon
                  </span>
                </div>
              ) : (
                <div>
                  <Link
                    href={`/tracks/${track.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <span>{track.icon}</span>
                    <span>{track.title}</span>
                    <span className="ml-auto text-xs bg-green-600/30 text-green-400 px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </Link>

                  {isActive && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {track.modules.map((mod) => {
                        const modPath = `/tracks/${track.id}/${mod.id}`;
                        const isModActive = pathname === modPath;
                        return (
                          <Link
                            key={mod.id}
                            href={modPath}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                              isModActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            }`}
                          >
                            <span className="text-gray-500">›</span>
                            {mod.title.split("(")[0].trim()}
                          </Link>
                        );
                      })}
                    </div>
                  )}
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
