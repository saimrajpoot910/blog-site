'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Store {
  id: number;
  name: string;
  heading: string;
  categories: string[];
  status: 'Active' | 'Draft' | 'Disabled';
  featured: boolean;
}

const INITIAL: Store[] = [
  { id:1,  name:'Amazon',     heading:'Promo Codes & Coupon', categories:['Electronics','Fashion'],      status:'Active',   featured:true  },
  { id:2,  name:'Noon',       heading:'Discount Deals',       categories:['Fashion','Home & Living'],    status:'Active',   featured:false },
  { id:3,  name:'NameCheap',  heading:'Exclusive Offers',     categories:['Tech'],                       status:'Draft',    featured:false },
  { id:4,  name:'Booking.com',heading:'Cashback Stores',      categories:['Travel'],                     status:'Active',   featured:true  },
  { id:5,  name:'iHerb',      heading:'Featured Partners',    categories:['Beauty','Food'],              status:'Disabled', featured:false },
];

const STATUS_STYLE: Record<string, string> = {
  Active:   'user-status-active',
  Draft:    'cat-draft-badge',
  Disabled: 'user-status-disabled',
};

export default function StoresPage() {
  const [stores, setStores]          = useState<Store[]>(INITIAL);
  const [search, setSearch]          = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stores.filter(
      (s) => s.name.toLowerCase().includes(q) || s.heading.toLowerCase().includes(q) || s.status.toLowerCase().includes(q),
    );
  }, [stores, search]);

  const handleDelete    = (id: number) => { setStores((p) => p.filter((s) => s.id !== id)); setDeleteConfirm(null); };
  const toggleFeatured  = (id: number) => setStores((p) => p.map((s) => s.id === id ? { ...s, featured: !s.featured } : s));

  return (
    <div className="user-page-root">
      {/* Header */}
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background:'rgba(232,93,138,0.1)', color:'#e85d8a' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
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
        <Link href="/stores/add" id="stores-add-btn" className="user-btn-primary"
          style={{ background:'linear-gradient(135deg,#e85d8a,#c2185b)', boxShadow:'0 2px 12px rgba(232,93,138,0.35)', textDecoration:'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Store
        </Link>
      </div>

      {/* Stats */}
      <div className="net-stats-row">
        {[
          { label:'Total Stores',    value: stores.length,                                              color:'#e85d8a' },
          { label:'Active',          value: stores.filter((s) => s.status === 'Active').length,          color:'#22c55e' },
          { label:'Draft / Disabled',value: stores.filter((s) => s.status !== 'Active').length,          color:'#f97316' },
          { label:'Featured',        value: stores.filter((s) => s.featured).length,                     color:'#6d35e3' },
        ].map((s) => (
          <div key={s.label} className="net-stat-card">
            <span className="net-stat-value" style={{ color:s.color }}>{s.value}</span>
            <span className="net-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="user-table-card">
        <div className="user-table-topbar">
          <div className="user-table-meta">
            <span className="user-table-count-label">All Stores</span>
            <span className="user-table-count-badge" style={{ background:'#e85d8a' }}>{stores.length}</span>
          </div>
          <div className="user-table-actions-row">
            <div className="user-export-group">
              {['Copy','CSV','Excel','PDF','Print'].map((l) => (
                <button key={l} className="user-export-btn" id={`store-export-${l.toLowerCase()}`}>{l}</button>
              ))}
            </div>
            <div className="user-search-wrap">
              <span className="user-search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input id="stores-search" type="search" placeholder="Search stores…" value={search} onChange={(e) => setSearch(e.target.value)} className="user-search-input"/>
            </div>
          </div>
        </div>

        <div className="user-table-scroll">
          <table className="user-table" aria-label="All stores list">
            <thead>
              <tr>
                <th className="user-th" style={{ width:'48px' }}>Sr</th>
                <th className="user-th">Store Name</th>
                <th className="user-th">Heading</th>
                <th className="user-th">Categories</th>
                <th className="user-th">Status</th>
                <th className="user-th">Featured</th>
                <th className="user-th user-th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="user-td-empty">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity:.35, display:'block', margin:'0 auto 8px' }}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <p>No stores found</p>
                </td></tr>
              ) : filtered.map((store, idx) => (
                <tr key={store.id} className="user-tr">
                  <td className="user-td user-td-num">{idx+1}</td>
                  <td className="user-td">
                    <div className="user-td-userinfo">
                      <div className="user-avatar-mini" style={{ background:'linear-gradient(135deg,#e85d8a,#c2185b)', fontSize:'0.65rem' }}>
                        {store.name.slice(0,2).toUpperCase()}
                      </div>
                      <span className="user-td-username">{store.name}</span>
                    </div>
                  </td>
                  <td className="user-td" style={{ color:'var(--text-secondary)', fontSize:'0.83rem' }}>{store.heading}</td>
                  <td className="user-td">
                    <div style={{ display:'flex', gap:'4px', flexWrap:'wrap' }}>
                      {store.categories.map((c) => (
                        <span key={c} className="store-inline-chip">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="user-td">
                    <span className={`user-status-badge ${STATUS_STYLE[store.status]}`}>
                      <span className="user-status-dot"/>{store.status}
                    </span>
                  </td>
                  <td className="user-td">
                    <button className={`store-feat-btn${store.featured ? ' store-feat-btn-on' : ''}`} onClick={() => toggleFeatured(store.id)} id={`feat-store-${store.id}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={store.featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {store.featured ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="user-td user-td-actions">
                    <Link href="/stores/edit" className="user-action-btn user-action-edit" id={`edit-store-${store.id}`}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </Link>
                    {deleteConfirm === store.id ? (
                      <div className="user-delete-confirm-inline">
                        <span className="user-delete-confirm-label">Sure?</span>
                        <button className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(store.id)}>Yes</button>
                        <button className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                      </div>
                    ) : (
                      <button className="user-action-btn user-action-delete" onClick={() => setDeleteConfirm(store.id)} id={`delete-store-${store.id}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="user-table-footer">
          <p className="user-table-info">
            Showing <strong>1</strong> to <strong>{filtered.length}</strong> of <strong>{stores.length}</strong> entries
          </p>
          <div className="user-pagination">
            <button className="user-page-btn" disabled><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>Prev</button>
            <button className="user-page-btn user-page-btn-active" style={{ background:'#e85d8a', borderColor:'#e85d8a' }}>1</button>
            <button className="user-page-btn" disabled>Next<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      </div>
    </div>
  );
}
