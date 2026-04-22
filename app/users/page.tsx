'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ApiError,
  deleteUser,
  isApiConfigured,
  listUsers,
  setUserStatus,
  type UserListItem,
} from '@/lib/api';
import { formatUserStatus } from '@/lib/formatters';

export default function AllUsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setLoadError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      setUsers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (e) {
      setUsers([]);
      setLoadError(e instanceof ApiError ? e.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q) ||
        (u.network ?? '').toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setDeleteConfirm(null);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Delete failed');
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      await setUserStatus(id, next);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Update failed');
    }
  };

  return (
    <div className="user-page-root">
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">All Users</h1>
            <nav className="user-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">All Users</span>
            </nav>
          </div>
        </div>
        <Link href="/users/add" id="all-users-add-btn" className="user-btn-primary" style={{ textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User
        </Link>
      </div>

      {loadError && (
        <div className="user-toast" style={{ background: 'rgba(239,68,68,0.12)', color: '#b91c1c', marginBottom: 12 }}>
          {loadError}
        </div>
      )}

      <div className="user-table-card">
        <div className="user-table-topbar">
          <div className="user-table-meta">
            <span className="user-table-count-label">Total Users</span>
            <span className="user-table-count-badge">{loading ? '…' : users.length}</span>
          </div>

          <div className="user-table-actions-row">
            <div className="user-export-group">
              {['Copy', 'CSV', 'Excel', 'PDF', 'Print'].map((label) => (
                <button key={label} type="button" className="user-export-btn" id={`export-${label.toLowerCase()}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="user-search-wrap">
              <span className="user-search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                id="all-users-search"
                type="search"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="user-search-input"
              />
            </div>
          </div>
        </div>

        <div className="user-table-scroll">
          <table className="user-table" aria-label="All users list">
            <thead>
              <tr>
                <th className="user-th" style={{ width: '52px' }}>Sr</th>
                <th className="user-th">User Name</th>
                <th className="user-th">Password</th>
                <th className="user-th">Status</th>
                <th className="user-th">Network</th>
                <th className="user-th user-th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="user-td-empty">
                    <p>Loading…</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="user-td-empty">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35, marginBottom: '8px' }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    <p>No users found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => {
                  const label = formatUserStatus(user.status);
                  return (
                    <tr key={user.id} className="user-tr">
                      <td className="user-td user-td-num">{idx + 1}</td>
                      <td className="user-td">
                        <div className="user-td-userinfo">
                          <div className="user-avatar-mini">{user.username.slice(0, 2).toUpperCase()}</div>
                          <span className="user-td-username">{user.username}</span>
                        </div>
                      </td>
                      <td className="user-td">
                        <code className="user-td-password">—</code>
                      </td>
                      <td className="user-td">
                        <span className={`user-status-badge ${label === 'Active' ? 'user-status-active' : 'user-status-disabled'}`}>
                          <span className="user-status-dot" />
                          {label}
                        </span>
                      </td>
                      <td className="user-td user-td-network">{user.network ?? '—'}</td>
                      <td className="user-td user-td-actions">
                        <Link href={`/users/${user.id}/edit`} className="user-action-btn user-action-edit" id={`edit-user-${user.id}`}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          type="button"
                          className={`user-action-btn ${user.status === 'ACTIVE' ? 'user-action-disable' : 'user-action-enable'}`}
                          onClick={() => toggleStatus(user.id, user.status)}
                          id={`toggle-user-${user.id}`}
                        >
                          {user.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                        </button>
                        {deleteConfirm === user.id ? (
                          <div className="user-delete-confirm-inline">
                            <span className="user-delete-confirm-label">Confirm?</span>
                            <button type="button" className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(user.id)}>Yes</button>
                            <button type="button" className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="user-action-btn user-action-delete"
                            onClick={() => setDeleteConfirm(user.id)}
                            id={`delete-user-${user.id}`}
                          >
                            Delete
                          </button>
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
            Showing <strong>1</strong> to <strong>{filtered.length}</strong> of <strong>{users.length}</strong> entries
          </p>
          <div className="user-pagination">
            <button type="button" className="user-page-btn" disabled>Prev</button>
            <button type="button" className="user-page-btn user-page-btn-active">1</button>
            <button type="button" className="user-page-btn" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
