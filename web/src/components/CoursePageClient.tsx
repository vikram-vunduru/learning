'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { ContentSections } from '@/lib/content';
import type { Track, Module } from '@/lib/tracks';
import { RightRail } from '@/components/RightRail';
import { LessonFooter } from '@/components/LessonFooter';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Props {
  sections: ContentSections;
  track: Track;
  mod: Module;
  prev: Module | null;
  next: Module | null;
  trackId: string;
}

export function CoursePageClient({ sections, track, mod, prev, next, trackId }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const courseMods = track.modules.filter(m => m.course === mod.course);
  const certTotal = courseMods.length;

  const readingCard = (
    <article
      className="prose page-content reading-card"
      style={{ fontFamily: 'var(--font-serif)' }}
      dangerouslySetInnerHTML={{ __html: sections.fullHtml }}
    />
  );

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="lesson-header" />
        <div className="lesson-body">
          <div className="reading-pane">{readingCard}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sticky header — desktop only (mobile uses the topbar in LayoutWrapper) */}
      <header className="lesson-header">
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)', minWidth: 0, overflow: 'hidden' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', flexShrink: 0 }}>
            <Home size={14} strokeWidth={1.75} />
          </Link>
          <ChevronRight size={13} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <Link href={`/tracks/${trackId}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', flexShrink: 0 }}>
            {track.title}
          </Link>
          {mod.course && (
            <>
              <ChevronRight size={13} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                {mod.course}
              </span>
            </>
          )}
          <ChevronRight size={13} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {mod.title}
          </span>
        </nav>
        <ThemeToggle />
      </header>

      <div className="lesson-body">
        <div className="reading-pane">{readingCard}</div>
        <div className="right-rail-wrapper">
          <RightRail
            sections={sections}
            moduleId={mod.id}
            certTitle={mod.course ?? undefined}
            certTotal={certTotal}
            certId={trackId}
          />
        </div>
      </div>

      <LessonFooter moduleId={mod.id} prev={prev} next={next} trackId={trackId} />
    </div>
  );
}
