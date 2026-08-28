import { notFound } from "next/navigation";
import Link from "next/link";
import { TRACKS, getTrack } from "@/lib/tracks";
import CertTracker from "@/components/CertTracker";

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
    <div className="p-8">
      <div className="mb-8">
        <div className="text-gray-400 text-sm mb-1">Track</div>
        <h1 className="text-3xl font-bold text-white">
          {track.icon} {track.title}
        </h1>
        <p className="text-gray-400 mt-1">{track.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Modules */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Study Modules</h2>
          <div className="space-y-3">
            {track.modules.map((mod, i) => (
              <Link
                key={mod.id}
                href={`/tracks/${track.id}/${mod.id}`}
                className="flex items-center gap-4 p-4 bg-gray-800 border border-gray-700 rounded-xl hover:border-blue-500/50 hover:bg-gray-750 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white group-hover:text-blue-300 transition-colors">
                    {mod.title}
                  </div>
                  {mod.month && mod.month > 0 && (
                    <div className="text-xs text-gray-500 mt-0.5">Month {mod.month}</div>
                  )}
                </div>
                <span className="text-gray-500 group-hover:text-blue-400 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Cert tracker panel */}
        {track.certs && (
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-fit">
            <CertTracker certs={track.certs} trackId={track.id} />
          </div>
        )}
      </div>
    </div>
  );
}
