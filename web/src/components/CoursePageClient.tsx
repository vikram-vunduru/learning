'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ContentSections } from '@/lib/content';
import type { Track, Module } from '@/lib/tracks';
import { SlideView } from '@/components/SlideView';
import { InstructorResources, resourceCount } from '@/components/InstructorResources';

type Mode = 'read' | 'record';
type ReadTab = 'content' | 'resources';
type NotesTab = 'notes' | 'resources';

interface Props {
  sections: ContentSections;
  track: Track;
  mod: Module;
  prev: Module | null;
  next: Module | null;
  trackId: string;
}

export function CoursePageClient({ sections, track, mod, prev, next, trackId }: Props) {
  const [mode, setMode] = useState<Mode>('read');
  const [readTab, setReadTab] = useState<ReadTab>('content');
  const [notesTab, setNotesTab] = useState<NotesTab>('notes');
  const [mounted, setMounted] = useState(false);
  const resCount = resourceCount(mod.id);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('courseMode') as Mode | null;
    if (saved === 'read' || saved === 'record') setMode(saved);
  }, []);

  const toggleMode = (newMode: Mode) => {
    setMode(newMode);
    localStorage.setItem('courseMode', newMode);
  };

  const ModeToggle = () => (
    <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
      <button
        onClick={() => toggleMode('read')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          mode === 'read' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        📖 Read
      </button>
      <button
        onClick={() => toggleMode('record')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          mode === 'record' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
        }`}
      >
        🎬 Record
      </button>
    </div>
  );

  const NavButtons = ({ className = '' }: { className?: string }) => (
    <div className={`flex items-center justify-between ${className}`}>
      {prev ? (
        <Link href={`/tracks/${trackId}/${prev.id}`}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-blue-500/50 hover:text-white transition-all">
          <span>←</span><span className="truncate max-w-48">{prev.title}</span>
        </Link>
      ) : <div />}
      {next ? (
        <Link href={`/tracks/${trackId}/${next.id}`}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-lg text-sm text-white hover:bg-blue-500 transition-colors">
          <span className="truncate max-w-48">{next.title}</span><span>→</span>
        </Link>
      ) : (
        <Link href={`/tracks/${trackId}`}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 rounded-lg text-sm text-white hover:bg-green-500 transition-colors">
          <span>✓ Complete</span>
        </Link>
      )}
    </div>
  );

  if (!mounted) {
    // SSR fallback — Read Mode
    return (
      <div className="p-8">
        <div className="max-w-4xl">
          <article className="prose bg-gray-800 rounded-xl p-8 border border-gray-700"
            dangerouslySetInnerHTML={{ __html: sections.fullHtml }} />
        </div>
      </div>
    );
  }

  if (mode === 'record') {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Record Mode Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-red-900/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-sm font-medium">RECORD MODE</span>
            </div>
            <h2 className="text-white font-semibold truncate max-w-lg">{mod.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick open buttons for labs */}
            <a href="https://developer.salesforce.com/signup" target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs rounded font-medium transition-colors">
              Open Dev Org ↗
            </a>
            <a href="https://trailhead.salesforce.com" target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs rounded font-medium transition-colors">
              Trailhead ↗
            </a>
            <ModeToggle />
          </div>
        </div>

        {/* Split Panes */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — Slide Deck or Fallback Content */}
          <div className="w-3/5 flex flex-col border-r border-gray-700 overflow-hidden">
            {sections.isLecture && sections.slidesData.length > 0 ? (
              <SlideView slides={sections.slidesData} title={mod.title} trackId={trackId} moduleId={mod.id} />
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                {sections.objectives && (
                  <div className="mb-4 bg-blue-950/40 border border-blue-800/50 rounded-lg p-4">
                    <h3 className="text-blue-400 font-semibold text-sm mb-2">🎯 Learning Objectives</h3>
                    <div className="prose text-sm" dangerouslySetInnerHTML={{ __html: sections.objectives }} />
                  </div>
                )}
                <article className="prose" dangerouslySetInnerHTML={{ __html: sections.fullHtml }} />
                <NavButtons className="mt-8" />
              </div>
            )}
          </div>

          {/* Right — Tab bar: Notes | Resources */}
          <div className="w-2/5 flex flex-col bg-gray-950 overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center border-b border-gray-800 flex-shrink-0" style={{ background: "#0d1117" }}>
              <button
                onClick={() => setNotesTab('resources')}
                className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  notesTab === 'resources'
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                📚 Resources
                {resCount > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                    notesTab === 'resources' ? 'bg-sky-500/20 text-sky-300' : 'bg-gray-700 text-gray-400'
                  }`}>{resCount}</span>
                )}
              </button>
              <button
                onClick={() => setNotesTab('notes')}
                className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  notesTab === 'notes'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                📋 Notes
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {notesTab === 'notes' ? (
                <div className="p-5">
                  {sections.isLecture && sections.script ? (
                    <>
                      <article className="prose prose-sm text-gray-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sections.script }} />
                      {sections.examTips && (
                        <div className="mt-6 bg-yellow-950/40 border border-yellow-800/50 rounded-lg p-4">
                          <h4 className="text-yellow-400 font-semibold text-sm mb-2">🔔 EXAM TIPS</h4>
                          <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: sections.examTips }} />
                        </div>
                      )}
                      {sections.summary && (
                        <div className="mt-4 bg-green-950/40 border border-green-800/50 rounded-lg p-4">
                          <h4 className="text-green-400 font-semibold text-sm mb-2">✅ SUMMARY</h4>
                          <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: sections.summary }} />
                        </div>
                      )}
                      {sections.quiz && (
                        <div className="mt-4 bg-purple-950/40 border border-purple-800/50 rounded-lg p-4">
                          <h4 className="text-purple-400 font-semibold text-sm mb-2">❓ MINI QUIZ</h4>
                          <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: sections.quiz }} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500 text-sm italic">
                      No recording script found for this module.
                    </div>
                  )}
                </div>
              ) : (
                <InstructorResources moduleId={mod.id} variant="tab" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Read Mode
  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb + Mode Toggle */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>›</span>
          <Link href={`/tracks/${trackId}`} className="hover:text-gray-300 transition-colors">{track.title}</Link>
          <span>›</span>
          <span className="text-gray-300">{mod.title}</span>
        </div>
        <ModeToggle />
      </div>

      {/* Tab bar */}
      <div className="flex items-center border-b border-gray-800 flex-shrink-0 px-8" style={{ background: "#0d1117" }}>
        <button
          onClick={() => setReadTab('resources')}
          className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            readTab === 'resources'
              ? 'border-sky-500 text-sky-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          📚 Resources
          {resCount > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
              readTab === 'resources' ? 'bg-sky-500/20 text-sky-300' : 'bg-gray-700 text-gray-400'
            }`}>{resCount}</span>
          )}
        </button>
        <button
          onClick={() => setReadTab('content')}
          className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            readTab === 'content'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          📖 Content
        </button>
      </div>

      {/* Tab content */}
      {readTab === 'content' ? (
        <div className="p-8">
          <div className="max-w-4xl">
            <article className="prose bg-gray-800 rounded-xl p-8 border border-gray-700"
              dangerouslySetInnerHTML={{ __html: sections.fullHtml }} />
            <NavButtons className="mt-6" />
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-4xl w-full px-8 py-4">
          <InstructorResources moduleId={mod.id} variant="tab" />
        </div>
      )}
    </div>
  );
}
