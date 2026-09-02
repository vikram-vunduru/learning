'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Menu, X } from 'lucide-react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = pathname.startsWith('/slides/');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Apply theme
    const saved = localStorage.getItem('certStudioTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  // Close sidebar when navigating
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (isFullscreen) return <>{children}</>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Desktop sidebar */}
      <div className="sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className={`sidebar-mobile${sidebarOpen ? ' sidebar-open' : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile top bar (hamburger) */}
      <div className="mobile-topbar">
        <button
          onClick={() => setSidebarOpen(v => !v)}
          style={{
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          {sidebarOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
        </button>
        <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>CertStudio</span>
        <div style={{ width: 36 }} /> {/* spacer */}
      </div>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
