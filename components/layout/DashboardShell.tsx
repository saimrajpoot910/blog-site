'use client';

import React, { useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
