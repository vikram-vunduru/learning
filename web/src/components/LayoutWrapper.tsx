'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = pathname.startsWith('/slides/');

  useEffect(() => {
    // Apply theme from localStorage on mount to prevent flash
    const saved = localStorage.getItem('theme') ?? 'dark';
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  if (isFullscreen) return <>{children}</>;

  return (
    <>
      <Sidebar />
      <main className="ml-64 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">{children}</main>
    </>
  );
}
