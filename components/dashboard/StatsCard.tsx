import React from 'react';
import type { IconType } from '@/lib/types';

export interface StatsCardProps {
  value: number | string;
  label: string;
  iconType: IconType;
}

const ICON_MAP: Record<IconType, { colorClass: string; Icon: React.FC }> = {
  chart: {
    colorClass: 'ic-blue',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  eye: {
    colorClass: 'ic-pink',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  store: {
    colorClass: 'ic-teal',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  users: {
    colorClass: 'ic-purple',
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
};

export default function StatsCard({ value, label, iconType }: StatsCardProps) {
  const { colorClass, Icon } = ICON_MAP[iconType];
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div className="stats-card">
      <div className="stats-card-meta">
        <div className="stats-card-value">{displayValue}</div>
        <div className="stats-card-label">{label}</div>
      </div>

      <div className={`stats-card-icon ${colorClass}`} aria-hidden="true">
        <Icon />
      </div>
    </div>
  );
}
