'use client';

import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import type { StatsCardData } from '@/lib/types';
import { ApiError, getDashboardStats, isApiConfigured } from '@/lib/api';

function statsFromApi(d: { totalCoupons: number; blogPosts: number; stores: number; users: number }): StatsCardData[] {
  return [
    { id: 'total-coupons', value: d.totalCoupons, label: 'Total Coupons', iconType: 'chart' },
    { id: 'blog-post', value: d.blogPosts, label: 'Blog Post', iconType: 'eye' },
    { id: 'stores', value: d.stores, label: 'Stores', iconType: 'store' },
    { id: 'users', value: d.users, label: 'Users', iconType: 'users' },
  ];
}

export default function StatsGrid() {
  const [stats, setStats] = useState<StatsCardData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isApiConfigured()) {
        setMessage('Add NEXT_PUBLIC_API_BASE_URL in .env.local to load live dashboard stats.');
        setStats(null);
        setLoading(false);
        return;
      }
      try {
        const data = await getDashboardStats();
        if (!cancelled) {
          setStats(statsFromApi(data));
          setMessage(null);
        }
      } catch (e) {
        if (!cancelled) {
          setStats(null);
          setMessage(e instanceof ApiError ? e.message : 'Could not load dashboard stats.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="stats-grid" aria-label="Key metrics" aria-busy="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stats-card" style={{ opacity: 0.45 }}>
            <div className="stats-card-meta">
              <div className="stats-card-value">—</div>
              <div className="stats-card-label">Loading…</div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="stats-grid" aria-label="Key metrics">
        <div className="section-card" style={{ gridColumn: '1 / -1', padding: '1rem 1.25rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="stats-grid" aria-label="Key metrics">
      {message && (
        <p style={{ gridColumn: '1 / -1', margin: '0 0 8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{message}</p>
      )}
      {stats.map((stat) => (
        <StatsCard key={stat.id} value={stat.value} label={stat.label} iconType={stat.iconType} />
      ))}
    </section>
  );
}
