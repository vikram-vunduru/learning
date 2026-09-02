'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, BookOpen, StickyNote, Home } from 'lucide-react';
import type { ContentSections } from '@/lib/content';
import type { Track, Module } from '@/lib/tracks';
import { SlideView } from '@/components/SlideView';
import { RightRail } from '@/components/RightRail';
import { LessonFooter } from '@/components/LessonFooter';
import { ThemeToggle } from '@/components/ThemeToggle';

type Mode = 'study' | 'notes';

interface Props {
  sections: ContentSections;
  track: Track;
  mod: Module;
  prev: Module | null;
  next: Module | null;
  trackId: string;
}

export function CoursePageClient({ sections, track, mod, prev, next, trackId }: Props) {
  const [mode, setMode] = useState<Mode>('study');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('certStudioMode') as Mode | null;
    if (saved === 'study' || saved === 'notes') setMode(saved);
  }, []);

  const switchMode = (m: Mode) => {
    setMode(m);
    localStorage.setItem('certStudioMode', m);
  };

  // Course info for cert progress in right rail
  const courseMods = track.modules.filter(m => m.course === mod.course);
  const certTotal = courseMods.length;

  const SegmentedControl = () => (
    <div
      style={{
        display: 'flex',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 2,
        gap: 2,
      }}
    >
      {([['study', BookOpen, 'Study'], ['notes', StickyNote, 'Notes']] as const).map(([m, Icon, label]) => (
        <button
          key={m}
          onClick={() => switchMode(m)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px',
            borderRadius: 'calc(var(--radius-md) - 2px)',
            border: 'none',
            background: mode === m ? 'var(--surface-raised)' : 'transparent',
            color: mode === m ? 'var(--text)' : 'var(--text-secondary)',
            fontWeight: mode === m ? 500 : 400,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <Icon size={15} strokeWidth={1.75} />
          {label}
        </button>
      ))}
    </div>
  );

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
      {/* Breadcrumb */}
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

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <SegmentedControl />
        <ThemeToggle />
      </div>
    </header>
  );

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <div style={{ height: 56, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }} />
        <div style={{ padding: '32px 40px' }}>
          <div style={{
            background: 'var(--surface-raised)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '48px 40px',
            maxWidth: 720,
            fontFamily: 'var(--font-serif)',
          }}
            dangerouslySetInnerHTML={{ __html: sections.fullHtml }}
          />
        </div>
      </div>
    );
  }

  // Notes mode
  if (mode === 'notes') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
        <Header />
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left: slides or content */}
          <div style={{ flex: 1, overflow: 'hidden', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            {sections.slidesData && sections.slidesData.length > 0 ? (
              <SlideView slides={sections.slidesData} title={mod.title} trackId={trackId} moduleId={mod.id} />
            ) : (
              <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
                <article
                  className="prose"
                  style={{ fontFamily: 'var(--font-serif)' }}
                  dangerouslySetInnerHTML={{ __html: sections.fullHtml }}
                />
              </div>
            )}
          </div>

          {/* Right: study notes panel */}
          <div style={{ width: 360, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {sections.summary && (
              <div style={{ background: 'rgba(61,190,122,0.08)', border: '1px solid rgba(61,190,122,0.25)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <div style={{ fontWeight: 600, color: 'var(--success)', fontSize: '0.8125rem', marginBottom: 8 }}>Key Facts to Memorize</div>
                <div className="prose" style={{ fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: sections.summary }} />
              </div>
            )}
            {sections.examTips && (
              <div style={{ background: 'var(--mastery-soft)', border: '1px solid rgba(240,181,74,0.3)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <div style={{ fontWeight: 600, color: 'var(--mastery)', fontSize: '0.8125rem', marginBottom: 8 }}>Exam Traps</div>
                <div className="prose" style={{ fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: sections.examTips }} />
              </div>
            )}
            {sections.quiz && (
              <div style={{ background: 'rgba(155,89,255,0.08)', border: '1px solid rgba(155,89,255,0.25)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <div style={{ fontWeight: 600, color: '#9B59FF', fontSize: '0.8125rem', marginBottom: 8 }}>Practice Questions</div>
                <div className="prose" style={{ fontSize: '0.875rem' }} dangerouslySetInnerHTML={{ __html: sections.quiz }} />
              </div>
            )}
            {!sections.summary && !sections.examTips && !sections.quiz && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: 16 }}>No study notes for this module.</div>
            )}
          </div>
        </div>
        <LessonFooter moduleId={mod.id} prev={prev} next={next} trackId={trackId} />
      </div>
    );
  }

  // Study mode (default)
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
