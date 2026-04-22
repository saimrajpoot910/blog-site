'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ApiError,
  deleteCategory,
  isApiConfigured,
  listCategories,
  setCategoryFeature,
  setCategorySlider,
  type Category,
} from '@/lib/api';
import { formatCategoryFeature } from '@/lib/formatters';

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setLoadError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      setCategories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      setCategories(await listCategories());
    } catch (e) {
      setCategories([]);
      setLoadError(e instanceof ApiError ? e.message : 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    );
  }, [categories, search]);

  const handleDelete = async (cid: string) => {
    try {
      await deleteCategory(cid);
      setDeleteConfirm(null);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Delete failed');
    }
  };

  const toggleFeature = async (cid: string, enabled: boolean) => {
    try {
      await setCategoryFeature(cid, !enabled);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Update failed');
    }
  };

  const toggleSlider = async (cid: string, slider: boolean) => {
    try {
      await setCategorySlider(cid, !slider);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Update failed');
    }
  };

  return (
    <div className="user-page-root">
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
        <Link href="/categories/add" id="all-categories-add-btn" className="user-btn-primary" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', textDecoration: 'none' }}>Add Category</Link>
      </div>

      {loadError && <div className="user-toast" style={{ background: 'rgba(239,68,68,0.12)', color: '#b91c1c', marginBottom: 12 }}>{loadError}</div>}

      <div className="user-table-card">
        <div className="user-table-topbar">
          <div className="user-table-meta">
            <span className="user-table-count-label">Total Categories</span>
            <span className="user-table-count-badge" style={{ background: '#f97316' }}>{categories.length}</span>
          </div>
          <div className="user-search-wrap">
            <input id="categories-search" type="search" placeholder="Search categories…" value={search} onChange={(e) => setSearch(e.target.value)} className="user-search-input" />
          </div>
        </div>

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
              {loading ? (
                <tr><td colSpan={6} className="user-td-empty"><p>Loading…</p></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="user-td-empty"><p>No categories found</p></td></tr>
              ) : (
                filtered.map((cat, idx) => {
                  const feat = formatCategoryFeature(cat.featureEnabled);
                  return (
                    <tr key={cat.id} className="user-tr">
                      <td className="user-td user-td-num">{idx + 1}</td>
                      <td className="user-td">
                        <div className="user-td-userinfo">
                          <div className="user-avatar-mini" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', fontSize: '0.65rem' }}>{cat.name.slice(0, 2).toUpperCase()}</div>
                          <span className="user-td-username">{cat.name}</span>
                        </div>
                      </td>
                      <td className="user-td"><code className="user-td-password">/{cat.slug}</code></td>
                      <td className="user-td">
                        <span className={`user-status-badge ${feat === 'Enabled' ? 'user-status-active' : 'user-status-disabled'}`}>
                          <span className="user-status-dot" />{feat}
                        </span>
                      </td>
                      <td className="user-td">
                        <button type="button" className={`user-status-badge ${cat.slider ? 'cat-slider-on' : 'cat-slider-off'}`} onClick={() => toggleSlider(cat.id, cat.slider)}>
                          {cat.slider ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="user-td user-td-actions">
                        <button type="button" className="user-action-btn user-action-disable" onClick={() => toggleFeature(cat.id, cat.featureEnabled)} id={`toggle-cat-${cat.id}`}>
                          {cat.featureEnabled ? 'Disable feature' : 'Enable feature'}
                        </button>
                        {deleteConfirm === cat.id ? (
                          <div className="user-delete-confirm-inline">
                            <span className="user-delete-confirm-label">Sure?</span>
                            <button type="button" className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(cat.id)}>Yes</button>
                            <button type="button" className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                          </div>
                        ) : (
                          <button type="button" className="user-action-btn user-action-delete" onClick={() => setDeleteConfirm(cat.id)} id={`delete-cat-${cat.id}`}>Delete</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
