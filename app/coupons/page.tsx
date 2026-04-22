'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ApiError, deleteCoupon, isApiConfigured, listCoupons, listStores, type CouponListItem, type StoreListItem } from '@/lib/api';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponListItem[]>([]);
  const [stores, setStores] = useState<StoreListItem[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setLoadError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      setCoupons([]);
      setStores([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const [cRows, sRows] = await Promise.all([
        listCoupons(selectedStoreId ? { storeId: selectedStoreId } : undefined),
        listStores(),
      ]);
      setCoupons(cRows);
      setStores(sRows);
    } catch (e) {
      setCoupons([]);
      setLoadError(e instanceof ApiError ? e.message : 'Failed to load coupons.');
    } finally {
      setLoading(false);
    }
  }, [selectedStoreId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return coupons;
    return coupons.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.offerDetails.toLowerCase().includes(q) ||
        (c.storeName ?? '').toLowerCase().includes(q),
    );
  }, [coupons, search]);

  const handleDelete = async (cid: string) => {
    try {
      await deleteCoupon(cid);
      setDeleteConfirm(null);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Delete failed');
    }
  };

  return (
    <div className="user-page-root">
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">All Coupons</h1>
            <nav className="user-breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">Coupons</span>
            </nav>
          </div>
        </div>
        <Link href="/coupons/add" className="user-btn-primary" style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', textDecoration: 'none' }}>Add Coupon</Link>
      </div>

      {loadError && <div className="user-toast" style={{ background: 'rgba(239,68,68,0.12)', color: '#b91c1c', marginBottom: 12 }}>{loadError}</div>}

      <div className="user-table-card">
        <div className="user-table-topbar" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label htmlFor="store-filter" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Store</label>
            <select id="store-filter" value={selectedStoreId} onChange={(e) => setSelectedStoreId(e.target.value)} className="user-input user-select" style={{ minWidth: 200 }}>
              <option value="">All stores</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="user-search-wrap">
            <input type="search" placeholder="Search coupons…" value={search} onChange={(e) => setSearch(e.target.value)} className="user-search-input" />
          </div>
        </div>

        <div className="user-table-scroll">
          <table className="user-table" aria-label="Coupons list">
            <thead>
              <tr>
                <th className="user-th" style={{ width: '60px' }}>Sr</th>
                <th className="user-th">Title</th>
                <th className="user-th">Offer Details</th>
                <th className="user-th">Store</th>
                <th className="user-th user-th-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="user-td-empty"><p>Loading…</p></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="user-td-empty"><p>No coupons found</p></td></tr>
              ) : (
                filtered.map((cpn, idx) => (
                  <tr key={cpn.id} className="user-tr">
                    <td className="user-td user-td-num">{idx + 1}</td>
                    <td className="user-td"><span style={{ fontWeight: 600 }}>{cpn.title}</span></td>
                    <td className="user-td" style={{ color: 'var(--text-secondary)' }}>{cpn.offerDetails}</td>
                    <td className="user-td"><span className="store-inline-chip">{cpn.storeName || '—'}</span></td>
                    <td className="user-td user-td-actions">
                      {deleteConfirm === cpn.id ? (
                        <div className="user-delete-confirm-inline">
                          <span className="user-delete-confirm-label">Sure?</span>
                          <button type="button" className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(cpn.id)}>Yes</button>
                          <button type="button" className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                        </div>
                      ) : (
                        <button type="button" className="user-action-btn user-action-delete" onClick={() => setDeleteConfirm(cpn.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
