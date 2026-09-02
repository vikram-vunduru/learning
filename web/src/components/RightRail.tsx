'use client';
import { useState, useEffect } from 'react';
import type { ContentSections } from '@/lib/content';
import { getResources } from '@/lib/resources';
import { ExternalLink } from 'lucide-react';

interface Props {
  sections: ContentSections;
  moduleId: string;
  certTitle?: string;
  certTotal?: number;
  certId?: string;
}

function useCompleted() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      const raw = localStorage.getItem('certStudioCompleted') ?? '[]';
      setCompleted(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  return completed;
}

export function RightRail({ sections, moduleId, certTitle, certTotal = 0, certId }: Props) {
  const completed = useCompleted();
  const resources = getResources(moduleId);
  const [activeHeading, setActiveHeading] = useState('');

  // Track active heading via IntersectionObserver
  useEffect(() => {
    if (!sections.tocItems?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    document.querySelectorAll('h2[id], h3[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections.tocItems]);

  const certDone = certId
    ? Array.from(completed).filter(id => id.startsWith(certId)).length
    : 0;

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        position: 'sticky',
        top: 80,
        alignSelf: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontSize: '0.8125rem',
        color: 'var(--text-secondary)',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
      }}
    >
      {/* Exam Weight Badge */}
      {sections.examDomain && sections.examWeight > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
          }}
        >
          <div style={{ color: 'var(--text-secondary)', marginBottom: 4, fontSize: '0.75rem', fontWeight: 500 }}>
            Exam domain
          </div>
          <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: '0.9375rem', marginBottom: 8 }}>
            {sections.examDomain}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color: 'var(--mastery)', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>
              {sections.examWeight}%
            </span>
            <div style={{ flex: 1, height: 6, background: 'var(--mastery-soft)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${sections.examWeight}%`,
                  height: '100%',
                  background: 'var(--mastery)',
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>of exam weight</div>
        </div>
      )}

      {/* On this page (TOC) */}
      {sections.tocItems && sections.tocItems.length > 1 && (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            On this page
          </div>
          <nav>
            {sections.tocItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{
                  display: 'block',
                  padding: '3px 0 3px',
                  paddingLeft: item.level === 3 ? 12 : 0,
                  color: activeHeading === item.id ? 'var(--accent)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.8125rem',
                  lineHeight: 1.4,
                  borderLeft: item.level === 3 ? '1px solid var(--border)' : 'none',
                  transition: 'color 0.1s',
                }}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Cert progress */}
      {certTitle && certTotal > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontSize: '0.875rem' }}>
            {certTitle}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 8 }}>
            {certDone} of {certTotal} lessons
          </div>
          <div style={{ height: 6, background: 'var(--mastery-soft)', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${certTotal > 0 ? Math.round((certDone / certTotal) * 100) : 0}%`,
                height: '100%',
                background: 'var(--mastery)',
                borderRadius: 3,
                transition: 'width 300ms ease-out',
              }}
            />
          </div>
        </div>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Resources ({resources.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {resources.slice(0, 6).map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '7px 10px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.35,
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <ExternalLink size={13} strokeWidth={1.75} style={{ marginTop: 1, flexShrink: 0, color: 'var(--text-muted)' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
