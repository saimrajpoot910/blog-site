'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Coupon {
  id: number;
  offerBox: string;
  offerDetails: string;
  store: string;
  active: boolean;
  featured: boolean;
}

const STORES = ['Amazon', 'Noon', 'NameCheap', 'Booking.com', 'iHerb', 'Oofos', 'Shein', 'AliExpress'];

const INITIAL: Coupon[] = [
  { id: 1, offerBox: '20% OFF', offerDetails: 'Get 20% off on all electronics', store: 'Amazon', active: true, featured: true },
  { id: 2, offerBox: '$50 OFF', offerDetails: 'Flat $50 off on flights', store: 'Booking.com', active: true, featured: false },
  { id: 3, offerBox: 'FREE SHIP', offerDetails: 'Free shipping on orders over $100', store: 'Noon', active: false, featured: false },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let result = coupons;
    if (selectedStore) {
      result = result.filter(c => c.store === selectedStore);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => 
        c.offerBox.toLowerCase().includes(q) || 
        c.offerDetails.toLowerCase().includes(q) || 
        c.store.toLowerCase().includes(q)
      );
    }
    return result;
  }, [coupons, selectedStore, search]);

  const handleDelete = (id: number) => { setCoupons(p => p.filter(c => c.id !== id)); setDeleteConfirm(null); };

  return (
    <div className="user-page-root">
      {/* Header */}
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
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
        <Link href="/coupons/add" className="user-btn-primary" style={{ background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', boxShadow: '0 2px 12px rgba(124,58,237,0.35)', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Coupon
        </Link>
      </div>

      {/* Filter and Table Card */}
      <div className="user-table-card">
        <div className="user-table-topbar" style={{ flexWrap: 'wrap', gap: '16px' }}>
          {/* Store Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label htmlFor="store-filter" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Please Select Store
            </label>
            <div className="user-input-wrap" style={{ width: '200px' }}>
              <select id="store-filter" value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)} className="user-input user-select" style={{ paddingLeft: '12px' }}>
                <option value="">All Stores</option>
                {STORES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="user-select-arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
            </div>
          </div>

          <div className="user-table-actions-row">
            <div className="user-search-wrap">
              <span className="user-search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input type="search" placeholder="Search coupons…" value={search} onChange={(e) => setSearch(e.target.value)} className="user-search-input" />
            </div>
          </div>
        </div>

        <div className="user-table-scroll">
          <table className="user-table" aria-label="Coupons list">
            <thead>
              <tr>
                <th className="user-th" style={{ width: '60px' }}>Sr</th>
                <th className="user-th">Offer</th>
                <th className="user-th">Offer Details</th>
                <th className="user-th">Store</th>
                <th className="user-th user-th-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="user-td-empty">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, display: 'block', margin: '0 auto 8px' }}>
                       <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                    <p>No coupons found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((cpn, idx) => (
                  <tr key={cpn.id} className="user-tr">
                    <td className="user-td user-td-num">{idx + 1}</td>
                    <td className="user-td"><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cpn.offerBox}</span></td>
                    <td className="user-td" style={{ color: 'var(--text-secondary)' }}>{cpn.offerDetails}</td>
                    <td className="user-td"><span className="store-inline-chip">{cpn.store}</span></td>
                    <td className="user-td user-td-actions">
                      <Link href={`/coupons/${cpn.id}/edit`} className="user-action-btn user-action-edit">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </Link>
                      {deleteConfirm === cpn.id ? (
                        <div className="user-delete-confirm-inline">
                          <span className="user-delete-confirm-label">Sure?</span>
                          <button className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(cpn.id)}>Yes</button>
                          <button className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                        </div>
                      ) : (
                        <button className="user-action-btn user-action-delete" onClick={() => setDeleteConfirm(cpn.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          Delete
                        </button>
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
