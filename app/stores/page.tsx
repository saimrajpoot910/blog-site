'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ApiError, deleteStore, isApiConfigured, listStores, setStoreFeatured, type StoreListItem } from '@/lib/api';
import { formatStoreStatus } from '@/lib/formatters';

const STATUS_STYLE: Record<string, string> = {
  Active: 'user-status-active',
  Draft: 'cat-draft-badge',
  Disabled: 'user-status-disabled',
};

export default function StoresPage() {
  const [stores, setStores] = useState<StoreListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setLoadError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      setStores([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      setStores(await listStores());
    } catch (e) {
      setStores([]);
      setLoadError(e instanceof ApiError ? e.message : 'Failed to load stores.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.heading.toLowerCase().includes(q) ||
        formatStoreStatus(s.status).toLowerCase().includes(q),
    );
  }, [stores, search]);

  const handleDelete = async (storeId: string) => {
    try {
      await deleteStore(storeId);
      setDeleteConfirm(null);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Delete failed');
    }
  };

  const toggleFeatured = async (storeId: string, current: boolean) => {
    try {
      await setStoreFeatured(storeId, !current);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Update failed');
    }
  };

  return (
    <div className="user-page-root">
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(232,93,138,0.1)', color: '#e85d8a' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">All Stores</h1>
            <nav className="user-breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">Stores</span>
            </nav>
          </div>
        </div>
        <Link href="/stores/add" id="stores-add-btn" className="user-btn-primary" style={{ background: 'linear-gradient(135deg,#e85d8a,#c2185b)', boxShadow: '0 2px 12px rgba(232,93,138,0.35)', textDecoration: 'none' }}>
          Add Store
        </Link>
      </div>

      {loadError && (
        <div className="user-toast" style={{ background: 'rgba(239,68,68,0.12)', color: '#b91c1c', marginBottom: 12 }}>{loadError}</div>
      )}

      <div className="net-stats-row">
        {[
          { label: 'Total Stores', value: stores.length, color: '#e85d8a' },
          { label: 'Active', value: stores.filter((s) => s.status === 'ACTIVE').length, color: '#22c55e' },
          { label: 'Draft / Disabled', value: stores.filter((s) => s.status !== 'ACTIVE').length, color: '#f97316' },
          { label: 'Featured', value: stores.filter((s) => s.featured).length, color: '#6d35e3' },
        ].map((s) => (
          <div key={s.label} className="net-stat-card">
            <span className="net-stat-value" style={{ color: s.color }}>{loading ? '—' : s.value}</span>
            <span className="net-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="user-table-card">
        <div className="user-table-topbar">
          <div className="user-table-meta">
            <span className="user-table-count-label">All Stores</span>
            <span className="user-table-count-badge" style={{ background: '#e85d8a' }}>{stores.length}</span>
          </div>
          <div className="user-table-actions-row">
            <div className="user-export-group">
              {['Copy', 'CSV', 'Excel', 'PDF', 'Print'].map((l) => (
                <button key={l} type="button" className="user-export-btn" id={`store-export-${l.toLowerCase()}`}>{l}</button>
              ))}
            </div>
            <div className="user-search-wrap">
              <input id="stores-search" type="search" placeholder="Search stores…" value={search} onChange={(e) => setSearch(e.target.value)} className="user-search-input" />
            </div>
          </div>
        </div>

        <div className="user-table-scroll">
          <table className="user-table" aria-label="All stores list">
            <thead>
              <tr>
                <th className="user-th" style={{ width: '48px' }}>Sr</th>
                <th className="user-th">Store Name</th>
                <th className="user-th">Heading</th>
                <th className="user-th">Categories</th>
                <th className="user-th">Status</th>
                <th className="user-th">Featured</th>
                <th className="user-th user-th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="user-td-empty"><p>Loading…</p></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="user-td-empty"><p>No stores found</p></td></tr>
              ) : (
                filtered.map((store, idx) => {
                  const stLabel = formatStoreStatus(store.status);
                  return (
                    <tr key={store.id} className="user-tr">
                      <td className="user-td user-td-num">{idx + 1}</td>
                      <td className="user-td">
                        <div className="user-td-userinfo">
                          <div className="user-avatar-mini" style={{ background: 'linear-gradient(135deg,#e85d8a,#c2185b)', fontSize: '0.65rem' }}>
                            {store.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="user-td-username">{store.name}</span>
                        </div>
                      </td>
                      <td className="user-td" style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{store.heading}</td>
                      <td className="user-td">
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {store.categories.map((c) => (
                            <span key={c} className="store-inline-chip">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="user-td">
                        <span className={`user-status-badge ${STATUS_STYLE[stLabel] ?? 'user-status-disabled'}`}>
                          <span className="user-status-dot" />{stLabel}
                        </span>
                      </td>
                      <td className="user-td">
                        <button type="button" className={`store-feat-btn${store.featured ? ' store-feat-btn-on' : ''}`} onClick={() => toggleFeatured(store.id, store.featured)} id={`feat-store-${store.id}`}>
                          {store.featured ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="user-td user-td-actions">
                        <Link href={`/stores/edit/${store.id}`} className="user-action-btn user-action-edit" id={`edit-store-${store.id}`}>Edit</Link>
                        {deleteConfirm === store.id ? (
                          <div className="user-delete-confirm-inline">
                            <span className="user-delete-confirm-label">Sure?</span>
                            <button type="button" className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(store.id)}>Yes</button>
                            <button type="button" className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                          </div>
                        ) : (
                          <button type="button" className="user-action-btn user-action-delete" onClick={() => setDeleteConfirm(store.id)} id={`delete-store-${store.id}`}>Delete</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="user-table-footer">
          <p className="user-table-info">
            Showing <strong>1</strong> to <strong>{filtered.length}</strong> of <strong>{stores.length}</strong> entries
          </p>
        </div>
      </div>
    </div>
  );
}
