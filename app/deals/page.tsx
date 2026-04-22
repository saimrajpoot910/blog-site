'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiError, deleteDeal, isApiConfigured, listDeals, type Deal } from '@/lib/api';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      setDeals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setDeals(await listDeals());
    } catch (e) {
      setDeals([]);
      setError(e instanceof ApiError ? e.message : 'Failed to load deals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDeal(id);
      setDeleteId(null);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Delete failed');
    }
  };

  return (
    <div className="user-page-root">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div className="page-header-content">
          <h1>Deals</h1>
          <p>Create and manage promotional deals</p>
        </div>
        <Link href="/deals/add" className="btn btn-primary" style={{ textDecoration: 'none' }}>Add deal</Link>
      </div>

      {error && <p style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</p>}

      <div className="user-table-card">
        <div className="user-table-scroll">
          <table className="user-table">
            <thead>
              <tr>
                <th className="user-th">Title</th>
                <th className="user-th">Updated</th>
                <th className="user-th user-th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="user-td-empty">Loading…</td></tr>
              ) : deals.length === 0 ? (
                <tr><td colSpan={3} className="user-td-empty">No deals yet.</td></tr>
              ) : (
                deals.map((d) => (
                  <tr key={d.id}>
                    <td className="user-td">{d.title}</td>
                    <td className="user-td" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{new Date(d.updatedAt).toLocaleString()}</td>
                    <td className="user-td user-td-actions">
                      {deleteId === d.id ? (
                        <>
                          <button type="button" className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(d.id)}>Confirm delete</button>
                          <button type="button" className="user-action-btn user-action-cancel" onClick={() => setDeleteId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button type="button" className="user-action-btn user-action-delete" onClick={() => setDeleteId(d.id)}>Delete</button>
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
