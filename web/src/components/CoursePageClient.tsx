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

  const Header = () => (
    <header
      style={{
        height: 56,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        flexShrink: 0,
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)', minWidth: 0 }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
          <Home size={14} strokeWidth={1.75} />
        </Link>
        <ChevronRight size={13} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <Link href={`/tracks/${trackId}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', flexShrink: 0 }}>
          {track.title}
        </Link>
        {mod.course && (
          <>
            <ChevronRight size={13} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
              {mod.course}
            </span>
          </>
        )}
        <ChevronRight size={13} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={{ color: 'var(--text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 240 }}>
          {mod.title}
        </span>
      </nav>

      <ThemeToggle />
    </header>
  );

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ height: 56, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }} />
        <div style={{ display: 'flex', gap: 32, padding: '32px 40px', alignItems: 'flex-start' }}>
          <article
            className="prose"
            style={{
              background: 'var(--surface-raised)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '48px 40px',
              maxWidth: 720, fontFamily: 'var(--font-serif)', flex: 1,
            }}
            dangerouslySetInnerHTML={{ __html: sections.fullHtml }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />
      <div style={{ display: 'flex', gap: 32, padding: '32px 40px', alignItems: 'flex-start', flex: 1 }}>
        {/* Reading pane */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <article
            className="prose page-content"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '48px 40px',
              maxWidth: 720,
              fontFamily: 'var(--font-serif)',
            }}
            dangerouslySetInnerHTML={{ __html: sections.fullHtml }}
          />
        </div>

        {/* Right rail */}
        <RightRail
          sections={sections}
          moduleId={mod.id}
          certTitle={mod.course ?? undefined}
          certTotal={certTotal}
          certId={trackId}
        />
      </div>

      <LessonFooter moduleId={mod.id} prev={prev} next={next} trackId={trackId} />
    </div>
  );
}
