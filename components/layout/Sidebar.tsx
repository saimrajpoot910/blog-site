'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants/navigation';

interface SidebarProps {
  isCollapsed: boolean;
  onOverlayClick?: () => void;
}

export default function Sidebar({ isCollapsed, onOverlayClick }: SidebarProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="sidebar-overlay"
          onClick={onOverlayClick}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isCollapsed ? '' : 'mobile-open'}`}>
        <div className="sidebar-inner">
          <p className="sidebar-section-label">Navigation</p>

          <nav className="sidebar-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const hasActiveChild =
                item.children?.some((c: { href: string }) => pathname === c.href) ||
                pathname.startsWith(`${item.href}/`);
              const isActive = pathname === item.href || (item.hasChildren && hasActiveChild);
              const isOpen = openMenus[item.id] !== undefined ? openMenus[item.id] : isActive;

              return (
                <div key={item.id} className="sidebar-item-group">
                  {item.hasChildren ? (
                    <button
                      className={`sidebar-nav-item${isActive ? ' active' : ''}`}
                      onClick={() => toggleMenu(item.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="sidebar-icon">
                        <NavIcon name={item.icon} />
                      </span>
                      <span className="sidebar-label">{item.label}</span>
                      <span className="sidebar-right">
                        {item.badge != null && (
                          <span className={`sidebar-badge ${item.badgeColor ?? 'blue'}`}>
                            {item.badge}
                          </span>
                        )}
                        <svg 
                          className={`sidebar-chevron ${isOpen ? 'open' : ''}`} 
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      id={`nav-${item.id}`}
                      className={`sidebar-nav-item${isActive ? ' active' : ''}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="sidebar-icon">
                        <NavIcon name={item.icon} />
                      </span>
                      <span className="sidebar-label">{item.label}</span>
                      <span className="sidebar-right">
                        {item.badge != null && (
                          <span className={`sidebar-badge ${item.badgeColor ?? 'blue'}`}>
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </Link>
                  )}

                  {/* Submenu */}
                  {item.hasChildren && item.children && isOpen && (
                    <div className="sidebar-submenu">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={`sidebar-sub-item ${pathname === child.href ? 'active' : ''}`}
                        >
                          <span className="sidebar-sub-icon">
                            <SubIcon name={child.icon} />
                          </span>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

function SubIcon({ name }: { name: string }) {
  const size = 16;
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  
  if (name === 'plus') {
    return (
      <svg {...props}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    );
  } else if (name === 'arrow-down') {
    return (
      <svg {...props}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    );
  }
  return null;
}

/* ── Icon map ── */
function NavIcon({ name }: { name: string }) {
  const size = 17;
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'dashboard':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'user':
      return (
        <svg {...props}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'network':
      return (
        <svg {...props}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case 'categories':
      return (
        <svg {...props}>
          <path d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      );
    case 'stores':
      return (
        <svg {...props}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'coupons':
      return (
        <svg {...props}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case 'deals':
      return (
        <svg {...props}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case 'media':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'compress':
      return (
        <svg {...props}>
          <polyline points="4 14 10 14 10 20" />
          <polyline points="20 10 14 10 14 4" />
          <line x1="10" y1="14" x2="3" y2="21" />
          <line x1="21" y1="3" x2="14" y2="10" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="4" />
        </svg>
      );
  }
}
