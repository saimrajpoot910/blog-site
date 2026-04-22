'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearSession, getStoredUser, type AuthUser } from '@/lib/auth/session';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window !== 'undefined' ? getStoredUser() : null,
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const syncUser = useCallback(() => {
    setUser(getStoredUser());
  }, []);

  useEffect(() => {
    syncUser();
    window.addEventListener('cms-auth-changed', syncUser);
    return () => window.removeEventListener('cms-auth-changed', syncUser);
  }, [syncUser]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const logout = () => {
    setMenuOpen(false);
    clearSession();
    syncUser();
    router.push('/login');
    router.refresh();
  };

  const goLogin = () => {
    setMenuOpen(false);
    router.push('/login');
  };

  const initial = user ? user.username.slice(0, 1).toUpperCase() : 'A';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          id="sidebar-toggle-btn"
          className="topbar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <HamburgerIcon />
        </button>
        <span className="topbar-logo">Update Review</span>
      </div>

      <div className="topbar-right">
        <button id="topbar-notifications-btn" className="topbar-icon-btn" aria-label="Notifications">
          <div className="topbar-notif-dot" />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <button id="topbar-fullscreen-btn" className="topbar-icon-btn" aria-label="Toggle fullscreen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>

        <button id="topbar-settings-btn" className="topbar-icon-btn" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <div className="topbar-divider" />

        <div className="topbar-user-wrap" ref={wrapRef}>
          <button
            type="button"
            id="topbar-user-avatar"
            className="topbar-avatar"
            aria-label={user ? 'Account menu' : 'Sign in'}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <div className="topbar-avatar-inner">{initial}</div>
          </button>

          {menuOpen && (
            <div className="topbar-user-dropdown" role="menu">
              {user ? (
                <>
                  <div className="topbar-user-dropdown-meta">
                    <div className="topbar-user-dropdown-name" title={user.username}>{user.username}</div>
                    <div className="topbar-user-dropdown-role">{user.role}</div>
                  </div>
                  <button type="button" className="topbar-user-dropdown-item topbar-user-dropdown-item--danger" role="menuitem" onClick={logout}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <div className="topbar-user-dropdown-meta">
                    <div className="topbar-user-dropdown-name">Not signed in</div>
                    <div className="topbar-user-dropdown-role">Admin portal</div>
                  </div>
                  <button type="button" className="topbar-user-dropdown-item" role="menuitem" onClick={goLogin}>
                    Sign in
                  </button>
                  <Link href="/signup" className="topbar-user-dropdown-item" role="menuitem" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
                    Create account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
