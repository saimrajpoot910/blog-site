'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { getAccessToken } from '@/lib/auth/session';

interface DashboardShellProps {
  children: React.ReactNode;
}

const AUTH_PATHS = new Set(['/login', '/signup']);

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [gateReady, setGateReady] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const isAuthPage = pathname ? AUTH_PATHS.has(pathname) : false;

  useEffect(() => {
    if (!pathname) return;
    if (AUTH_PATHS.has(pathname)) {
      setGateReady(true);
      return;
    }
    if (!getAccessToken()) {
      router.replace('/login');
      return;
    }
    setGateReady(true);
  }, [pathname, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!gateReady) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--topbar-bg, #1e1e2e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.45)',
          fontSize: '0.875rem',
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <Topbar onToggleSidebar={toggleSidebar} />

      <div className={`dashboard-body${!sidebarOpen ? ' sidebar-collapsed' : ''}`}>
        <Sidebar
          isCollapsed={!sidebarOpen}
          onOverlayClick={() => setSidebarOpen(false)}
        />

        <main className="dashboard-main" id="main-content">
          <div className="dashboard-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
