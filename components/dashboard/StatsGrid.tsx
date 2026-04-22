import React from 'react';
import StatsCard from './StatsCard';
import type { StatsCardData } from '@/lib/types';

const STATS: StatsCardData[] = [
  { id: 'total-coupons', value: 23586, label: 'Total Coupons', iconType: 'chart' },
  { id: 'blog-post',     value: 68,    label: 'Blog Post',     iconType: 'eye'   },
  { id: 'stores',        value: 2289,  label: 'Stores',        iconType: 'store' },
  { id: 'users',         value: 1,     label: 'Users',         iconType: 'users' },
];

export default function StatsGrid() {
  return (
    <section className="stats-grid" aria-label="Key metrics">
      {STATS.map((stat) => (
        <StatsCard
          key={stat.id}
          value={stat.value}
          label={stat.label}
          iconType={stat.iconType}
        />
      ))}
    </section>
  );
}
