'use client';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import type { Module } from '@/lib/tracks';

interface Props {
  moduleId: string;
  prev: Module | null;
  next: Module | null;
  trackId: string;
}

export function LessonFooter({ prev, next, trackId }: Props) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(12px, 4vw, 12px) clamp(12px, 5vw, 40px)',
        zIndex: 10,
      }}
    >
      {prev ? (
        <Link
          href={`/tracks/${trackId}/${prev.id}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--text-secondary)', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 500,
            padding: '6px 12px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'transparent',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
          <span style={{ maxWidth: 'clamp(80px, 20vw, 200px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {prev.title}
          </span>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          href={`/tracks/${trackId}/${next.id}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--accent)', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 500,
            padding: '6px 14px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-soft)',
            border: '1px solid transparent',
            transition: 'background 0.15s',
          }}
        >
          <span style={{ maxWidth: 'clamp(80px, 20vw, 200px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {next.title}
          </span>
          <ChevronRight size={16} strokeWidth={1.75} />
        </Link>
      ) : (
        <Link
          href={`/tracks/${trackId}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--success)',
            color: '#fff', fontSize: '0.875rem', fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          <CheckCircle size={16} strokeWidth={1.75} /> Course complete
        </Link>
      )}
    </div>
  );
}
