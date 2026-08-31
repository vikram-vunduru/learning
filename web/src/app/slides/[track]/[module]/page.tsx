import { notFound } from "next/navigation";
import { TRACKS, getTrack, getModule } from "@/lib/tracks";
import { getMarkdownSections } from "@/lib/content";
import { FullScreenSlides } from "@/components/FullScreenSlides";

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

export default async function SlidesPage({ params }: Props) {
  const { track: trackId, module: moduleId } = await params;
  const track = getTrack(trackId);
  const mod = getModule(trackId, moduleId);
  if (!track || !mod) notFound();

  const sections = await getMarkdownSections(mod.file);

  const currentIndex = track.modules.findIndex((m) => m.id === moduleId);
  const prev = currentIndex > 0 ? track.modules[currentIndex - 1] : null;
  const next = currentIndex < track.modules.length - 1 ? track.modules[currentIndex + 1] : null;

  return (
    <FullScreenSlides
      sections={sections}
      mod={mod}
      trackId={trackId}
      prevId={prev?.id ?? null}
      nextId={next?.id ?? null}
    />
  );
}
