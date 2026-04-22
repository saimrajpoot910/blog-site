'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  slug: string;
  feature: 'Enabled' | 'Disabled';
  slider: boolean;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'clothing',     slug: 'clothing',     feature: 'Disabled', slider: true },
  { id: 2, name: 'Electronics',  slug: 'electronics',  feature: 'Enabled',  slider: false },
  { id: 3, name: 'Home & Living',slug: 'home-living',  feature: 'Enabled',  slider: true },
];

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [search, setSearch]         = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.feature.toLowerCase().includes(q),
    );
  }, [categories, search]);

  const handleDelete = (id: number) => {
    setCategories((p) => p.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  };

  const toggleFeature = (id: number) => {
    setCategories((p) =>
      p.map((c) =>
        c.id === id
          ? { ...c, feature: c.feature === 'Enabled' ? 'Disabled' : 'Enabled' }
          : c,
      ),
    );
  };

  return (
    <div className="user-page-root">
      {/* Page Header */}
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">All Categories</h1>
            <nav className="user-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">Categories</span>
            </nav>
          </div>
        </div>
        <Link
          href="/categories/add"
          id="all-categories-add-btn"
          className="user-btn-primary"
          style={{
            background: 'linear-gradient(135deg,#f97316,#ea580c)',
            boxShadow: '0 2px 12px rgba(249,115,22,0.35)',
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Category
        </Link>
      </div>

      {/* Table Card */}
      <div className="user-table-card">
        {/* Top Bar */}
        <div className="user-table-topbar">
          <div className="user-table-meta">
            <span className="user-table-count-label">Total Categories</span>
            <span className="user-table-count-badge" style={{ background: '#f97316' }}>
              {categories.length}
            </span>
          </div>

          <div className="user-table-actions-row">
            <div className="user-export-group">
              {['Copy', 'CSV', 'Excel', 'PDF', 'Print'].map((label) => (
                <button key={label} className="user-export-btn" id={`cat-export-${label.toLowerCase()}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="user-search-wrap">
              <span className="user-search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                id="categories-search"
                type="search"
                placeholder="Search categories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="user-search-input"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="user-table-scroll">
          <table className="user-table" aria-label="All categories list">
            <thead>
              <tr>
                <th className="user-th" style={{ width: '52px' }}>Sr</th>
                <th className="user-th">Name</th>
                <th className="user-th">Slug</th>
                <th className="user-th">Feature</th>
                <th className="user-th">Slider</th>
                <th className="user-th user-th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="user-td-empty">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, marginBottom: '8px', display: 'block', margin: '0 auto 8px' }}>
                      <path d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <p>No categories found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((cat, idx) => (
                  <tr key={cat.id} className="user-tr">
                    <td className="user-td user-td-num">{idx + 1}</td>

                    {/* Name */}
                    <td className="user-td">
                      <div className="user-td-userinfo">
                        <div
                          className="user-avatar-mini"
                          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', fontSize: '0.65rem' }}
                        >
                          {cat.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="user-td-username">{cat.name}</span>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="user-td">
                      <code className="user-td-password">/{cat.slug}</code>
                    </td>

                    {/* Feature */}
                    <td className="user-td">
                      <span
                        className={`user-status-badge ${cat.feature === 'Enabled' ? 'user-status-active' : 'user-status-disabled'}`}
                      >
                        <span className="user-status-dot" />
                        {cat.feature}
                      </span>
                    </td>

                    {/* Slider */}
                    <td className="user-td">
                      <span className={`user-status-badge ${cat.slider ? 'cat-slider-on' : 'cat-slider-off'}`}>
                        <span className="user-status-dot" />
                        {cat.slider ? 'Yes' : 'No'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="user-td user-td-actions">
                      <button
                        className="user-action-btn user-action-disable"
                        onClick={() => toggleFeature(cat.id)}
                        id={`toggle-cat-${cat.id}`}
                        style={cat.feature === 'Enabled' ? {} : { background: 'rgba(34,197,94,0.1)', color: '#15803d', borderColor: 'rgba(34,197,94,0.2)' }}
                      >
                        {cat.feature === 'Enabled' ? (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                            </svg>
                            Disable
                          </>
                        ) : (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Enable
                          </>
                        )}
                      </button>

                      <Link
                        href={`/categories/${cat.id}/edit`}
                        className="user-action-btn user-action-edit"
                        id={`edit-cat-${cat.id}`}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </Link>

                      {deleteConfirm === cat.id ? (
                        <div className="user-delete-confirm-inline">
                          <span className="user-delete-confirm-label">Sure?</span>
                          <button className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(cat.id)}>Yes</button>
                          <button className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                        </div>
                      ) : (
                        <button
                          className="user-action-btn user-action-delete"
                          onClick={() => setDeleteConfirm(cat.id)}
                          id={`delete-cat-${cat.id}`}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
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

        {/* Footer */}
        <div className="user-table-footer">
          <p className="user-table-info">
            Showing <strong>1</strong> to <strong>{filtered.length}</strong> of <strong>{categories.length}</strong> entries
          </p>
          <div className="user-pagination">
            <button className="user-page-btn" disabled>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              Prev
            </button>
            <button className="user-page-btn user-page-btn-active" style={{ background: '#f97316', borderColor: '#f97316' }}>1</button>
            <button className="user-page-btn" disabled>
              Next
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
