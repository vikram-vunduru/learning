'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';
import type { Module } from '@/lib/tracks';

interface Props {
  moduleId: string;
  prev: Module | null;
  next: Module | null;
  trackId: string;
}

export function LessonFooter({ moduleId, prev, next, trackId }: Props) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('certStudioCompleted') ?? '[]';
      setDone(JSON.parse(raw).includes(moduleId));
    } catch {}
  }, [moduleId]);

  const toggle = () => {
    try {
      const raw = localStorage.getItem('certStudioCompleted') ?? '[]';
      const set = new Set<string>(JSON.parse(raw));
      if (done) set.delete(moduleId); else set.add(moduleId);
      localStorage.setItem('certStudioCompleted', JSON.stringify([...set]));
      setDone(!done);
    } catch {}
  };

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
        padding: '12px 40px',
        zIndex: 10,
      }}
    >
      {/* Prev */}
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
          <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {prev.title}
          </span>
        </Link>
      ) : <div />}

      {/* Mark complete */}
      <button
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 20px',
          borderRadius: 'var(--radius-md)',
          border: done ? '1px solid var(--success)' : 'none',
          background: done ? 'transparent' : 'var(--accent)',
          color: done ? 'var(--success)' : '#fff',
          fontSize: '0.875rem', fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {done
          ? <><CheckCircle size={16} strokeWidth={1.75} /> Completed</>
          : <><Circle size={16} strokeWidth={1.75} /> Mark complete</>
        }
      </button>

      {/* Next */}
      {next ? (
        <Link
          href={`/tracks/${trackId}/${next.id}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--accent)', textDecoration: 'none',
            fontSize: '0.875rem', fontWeight: 500,
            padding: '6px 12px', borderRadius: 'var(--radius-md)',
            background: 'var(--accent-soft)',
            border: '1px solid transparent',
            transition: 'background 0.15s',
          }}
        >
          <span style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
