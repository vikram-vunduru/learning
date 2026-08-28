import { notFound } from "next/navigation";
import Link from "next/link";
import { TRACKS, getTrack, getModule } from "@/lib/tracks";
import { getMarkdownContent } from "@/lib/content";

export function generateStaticParams() {
  const params: { track: string; module: string }[] = [];
  for (const track of TRACKS.filter((t) => t.status === "active")) {
    for (const mod of track.modules) {
      params.push({ track: track.id, module: mod.id });
    }
  }
  return params;
}

interface Props {
  params: Promise<{ track: string; module: string }>;
}

export default async function ModulePage({ params }: Props) {
  const { track: trackId, module: moduleId } = await params;
  const track = getTrack(trackId);
  const mod = getModule(trackId, moduleId);
  if (!track || !mod) notFound();

  const { content, title } = await getMarkdownContent(mod.file);

  const currentIndex = track.modules.findIndex((m) => m.id === moduleId);
  const prev = currentIndex > 0 ? track.modules[currentIndex - 1] : null;
  const next = currentIndex < track.modules.length - 1 ? track.modules[currentIndex + 1] : null;

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>›</span>
        <Link href={`/tracks/${trackId}`} className="hover:text-gray-300 transition-colors">
          {track.title}
        </Link>
        <span>›</span>
        <span className="text-gray-300">{mod.title.split("(")[0].trim()}</span>
      </div>

      <div className="max-w-4xl">
        {/* Content */}
        <article
          className="prose bg-gray-800 rounded-xl p-8 border border-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {prev ? (
            <Link
              href={`/tracks/${trackId}/${prev.id}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-blue-500/50 hover:text-white transition-all"
            >
              <span>←</span>
              <span className="truncate max-w-48">{prev.title.split("(")[0].trim()}</span>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/tracks/${trackId}/${next.id}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-500 transition-colors"
            >
              <span className="truncate max-w-48">{next.title.split("(")[0].trim()}</span>
              <span>→</span>
            </Link>
          ) : (
            <Link
              href={`/tracks/${trackId}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 rounded-lg text-sm text-white hover:bg-green-500 transition-colors"
            >
              <span>✓ Track complete</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
