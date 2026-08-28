import Link from "next/link";
import { TRACKS } from "@/lib/tracks";

export default function Dashboard() {
  const activeTrack = TRACKS.find((t) => t.status === "active");

  const months = [
    { num: 1, cert: "AI Associate", status: "upcoming" },
    { num: 2, cert: "Administrator", status: "upcoming" },
    { num: 3, cert: "Platform App Builder", status: "upcoming" },
    { num: 4, cert: "Platform Developer I", status: "upcoming" },
    { num: 5, cert: "JavaScript Dev I", status: "upcoming" },
    { num: 6, cert: "Data Cloud Consultant", status: "upcoming" },
    { num: 7, cert: "Agentforce Specialist", status: "upcoming" },
    { num: 8, cert: "PDII + Adv Admin", status: "upcoming" },
    { num: 9, cert: "Data + Sharing Arch → App Arch", status: "upcoming" },
    { num: 10, cert: "Integration + DevOps Arch", status: "upcoming" },
    { num: 11, cert: "IAM + Mobile → Sys Arch", status: "upcoming" },
    { num: 12, cert: "CTA Board Prep", status: "upcoming" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400">Your personal path to Salesforce Technical Architect and beyond</p>
      </div>

      {/* Active track banner */}
      {activeTrack && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-blue-200 text-sm font-medium mb-1">Active Track</div>
              <h2 className="text-2xl font-bold text-white">{activeTrack.icon} {activeTrack.title} → CTA</h2>
              <p className="text-blue-200 mt-1 text-sm">{activeTrack.description}</p>
            </div>
            <Link
              href={`/tracks/${activeTrack.id}`}
              className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
            >
              Continue →
            </Link>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Certifications", value: "16", sub: "on CTA path", icon: "🏆" },
          { label: "Study Months", value: "12", sub: "target timeline", icon: "📅" },
          { label: "Estimated Cost", value: "$5,075", sub: "all exams", icon: "💰" },
          { label: "Tech Tracks", value: "5", sub: "planned total", icon: "🚀" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm font-medium text-gray-300">{s.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 12-month timeline */}
        <div className="col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">12-Month CTA Sprint</h2>
          <div className="grid grid-cols-2 gap-2">
            {months.map((m) => (
              <div
                key={m.num}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-400">{m.num}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-white truncate">{m.cert}</div>
                  <div className="text-xs text-gray-500">Month {m.num}</div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/tracks/salesforce/roadmap"
            className="mt-4 block text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View full roadmap with weekly breakdowns →
          </Link>
        </div>

        {/* All tracks */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">All Tracks</h2>
          <div className="space-y-3">
            {TRACKS.map((track) => (
              <div key={track.id}>
                {track.status === "active" ? (
                  <Link
                    href={`/tracks/${track.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                  >
                    <span className="text-xl">{track.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white">{track.title}</div>
                      <div className="text-xs text-gray-400 truncate">{track.description}</div>
                    </div>
                    <span className="text-xs bg-green-600/30 text-green-400 px-2 py-0.5 rounded-full flex-shrink-0">Active</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600/30 opacity-60">
                    <span className="text-xl">{track.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-300">{track.title}</div>
                      <div className="text-xs text-gray-500 truncate">{track.description}</div>
                    </div>
                    <span className="text-xs bg-gray-600/50 text-gray-400 px-2 py-0.5 rounded-full flex-shrink-0">Soon</span>
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
