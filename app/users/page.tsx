'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  password: string;
  status: 'Active' | 'Disabled';
  network: string;
}

const INITIAL_USERS: User[] = [
  { id: 1, username: 'Ugfn-upjhbc', password: '9gT%k&7%7&6', status: 'Active', network: '-' },
];

export default function AllUsersPage() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q) ||
        u.network.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' } : u
      )
    );
  };

  return (
    <div className="user-page-root">
      {/* Page Header */}
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

      {/* Table Card */}
      <div className="user-table-card">
        {/* Card Top Bar */}
        <div className="user-table-topbar">
          <div className="user-table-meta">
            <span className="user-table-count-label">Total Users</span>
            <span className="user-table-count-badge">{users.length}</span>
          </div>

          <div className="user-table-actions-row">
            {/* Export Buttons */}
            <div className="user-export-group">
              {['Copy', 'CSV', 'Excel', 'PDF', 'Print'].map((label) => (
                <button key={label} className="user-export-btn" id={`export-${label.toLowerCase()}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Search */}
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

        {/* Table */}
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
              {filtered.length === 0 ? (
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
                filtered.map((user, idx) => (
                  <tr key={user.id} className="user-tr">
                    <td className="user-td user-td-num">{idx + 1}</td>
                    <td className="user-td">
                      <div className="user-td-userinfo">
                        <div className="user-avatar-mini">
                          {user.username.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="user-td-username">{user.username}</span>
                      </div>
                    </td>
                    <td className="user-td">
                      <code className="user-td-password">{user.password}</code>
                    </td>
                    <td className="user-td">
                      <span className={`user-status-badge ${user.status === 'Active' ? 'user-status-active' : 'user-status-disabled'}`}>
                        <span className="user-status-dot" />
                        {user.status}
                      </span>
                    </td>
                    <td className="user-td user-td-network">{user.network}</td>
                    <td className="user-td user-td-actions">
                      <Link href={`/users/${user.id}/edit`} className="user-action-btn user-action-edit" id={`edit-user-${user.id}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        className={`user-action-btn ${user.status === 'Active' ? 'user-action-disable' : 'user-action-enable'}`}
                        onClick={() => toggleStatus(user.id)}
                        id={`toggle-user-${user.id}`}
                      >
                        {user.status === 'Active' ? (
                          <>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
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
                      {deleteConfirm === user.id ? (
                        <div className="user-delete-confirm-inline">
                          <span className="user-delete-confirm-label">Confirm?</span>
                          <button className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(user.id)}>Yes</button>
                          <button className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                        </div>
                      ) : (
                        <button
                          className="user-action-btn user-action-delete"
                          onClick={() => setDeleteConfirm(user.id)}
                          id={`delete-user-${user.id}`}
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

        {/* Table Footer */}
        <div className="user-table-footer">
          <p className="user-table-info">
            Showing <strong>1</strong> to <strong>{filtered.length}</strong> of <strong>{users.length}</strong> entries
          </p>
          <div className="user-pagination">
            <button className="user-page-btn" disabled>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Prev
            </button>
            <button className="user-page-btn user-page-btn-active">1</button>
            <button className="user-page-btn" disabled>
              Next
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
