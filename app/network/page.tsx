'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Network {
  id: number;
  name: string;
  users: number;
  status: 'Active' | 'Inactive';
}

const INITIAL_NETWORKS: Network[] = [
  { id: 1, name: 'Affiliate Network Alpha', users: 3,  status: 'Active'   },
  { id: 2, name: 'Beta Publishers',          users: 7,  status: 'Active'   },
  { id: 3, name: 'Legacy Net',               users: 1,  status: 'Inactive' },
];

export default function NetworkPage() {
  const [networks, setNetworks]       = useState<Network[]>(INITIAL_NETWORKS);
  const [search, setSearch]           = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return networks.filter(
      (n) => n.name.toLowerCase().includes(q) || n.status.toLowerCase().includes(q),
    );
  }, [networks, search]);

  const handleDelete = (id: number) => {
    setNetworks((p) => p.filter((n) => n.id !== id));
    setDeleteConfirm(null);
  };

  const toggleStatus = (id: number) => {
    setNetworks((p) =>
      p.map((n) =>
        n.id === id ? { ...n, status: n.status === 'Active' ? 'Inactive' : 'Active' } : n,
      ),
    );
  };

  return (
    <div className="user-page-root">
      {/* Page Header */}
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(20,184,166,0.1)', color: '#14b8a6' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6"  y1="20" x2="6"  y2="14" />
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">Networks</h1>
            <nav className="user-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">Network</span>
            </nav>
          </div>
        </div>
        <Link
          href="/network/add"
          id="network-add-btn"
          className="user-btn-primary"
          style={{
            background: 'linear-gradient(135deg,#14b8a6,#0d9488)',
            boxShadow: '0 2px 12px rgba(20,184,166,0.35)',
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
          </svg>
          Add Network
        </Link>
      </div>

      {/* Stats Row */}
      <div className="net-stats-row">
        {[
          { label: 'Total Networks', value: networks.length,                           color: '#14b8a6' },
          { label: 'Active',         value: networks.filter((n) => n.status === 'Active').length,   color: '#22c55e' },
          { label: 'Inactive',       value: networks.filter((n) => n.status === 'Inactive').length, color: '#f97316' },
          { label: 'Total Users',    value: networks.reduce((s, n) => s + n.users, 0), color: '#6d35e3' },
        ].map((s) => (
          <div key={s.label} className="net-stat-card">
            <span className="net-stat-value" style={{ color: s.color }}>{s.value}</span>
            <span className="net-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="user-table-card">
        <div className="user-table-topbar">
          <div className="user-table-meta">
            <span className="user-table-count-label">All Networks</span>
            <span className="user-table-count-badge" style={{ background: '#14b8a6' }}>
              {networks.length}
            </span>
          </div>
          <div className="user-table-actions-row">
            <div className="user-export-group">
              {['Copy', 'CSV', 'Excel', 'PDF', 'Print'].map((l) => (
                <button key={l} className="user-export-btn" id={`net-export-${l.toLowerCase()}`}>{l}</button>
              ))}
            </div>
            <div className="user-search-wrap">
              <span className="user-search-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                id="network-search"
                type="search"
                placeholder="Search networks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="user-search-input"
              />
            </div>
          </div>
        </div>

        <div className="user-table-scroll">
          <table className="user-table" aria-label="All networks list">
            <thead>
              <tr>
                <th className="user-th" style={{ width: '52px' }}>Sr</th>
                <th className="user-th">Network Name</th>
                <th className="user-th">Assigned Users</th>
                <th className="user-th">Status</th>
                <th className="user-th user-th-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="user-td-empty">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ opacity: 0.35, display: 'block', margin: '0 auto 8px' }}>
                      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    <p>No networks found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((net, idx) => (
                  <tr key={net.id} className="user-tr">
                    <td className="user-td user-td-num">{idx + 1}</td>

                    <td className="user-td">
                      <div className="user-td-userinfo">
                        <div
                          className="user-avatar-mini"
                          style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', fontSize: '0.65rem' }}
                        >
                          {net.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="user-td-username">{net.name}</span>
                      </div>
                    </td>

                    <td className="user-td">
                      <div className="net-user-count">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {net.users} user{net.users !== 1 ? 's' : ''}
                      </div>
                    </td>

                    <td className="user-td">
                      <span className={`user-status-badge ${net.status === 'Active' ? 'user-status-active' : 'user-status-disabled'}`}>
                        <span className="user-status-dot" />
                        {net.status}
                      </span>
                    </td>

                    <td className="user-td user-td-actions">
                      <button
                        className={`user-action-btn ${net.status === 'Active' ? 'user-action-disable' : 'user-action-enable'}`}
                        onClick={() => toggleStatus(net.id)}
                        id={`toggle-net-${net.id}`}
                      >
                        {net.status === 'Active' ? (
                          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>Disable</>
                        ) : (
                          <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Enable</>
                        )}
                      </button>

                      <Link href={`/network/${net.id}/edit`} className="user-action-btn user-action-edit" id={`edit-net-${net.id}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </Link>

                      {deleteConfirm === net.id ? (
                        <div className="user-delete-confirm-inline">
                          <span className="user-delete-confirm-label">Sure?</span>
                          <button className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(net.id)}>Yes</button>
                          <button className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                        </div>
                      ) : (
                        <button
                          className="user-action-btn user-action-delete"
                          onClick={() => setDeleteConfirm(net.id)}
                          id={`delete-net-${net.id}`}
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

        <div className="user-table-footer">
          <p className="user-table-info">
            Showing <strong>1</strong> to <strong>{filtered.length}</strong> of <strong>{networks.length}</strong> entries
          </p>
          <div className="user-pagination">
            <button className="user-page-btn" disabled>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>Prev
            </button>
            <button className="user-page-btn user-page-btn-active" style={{ background: '#14b8a6', borderColor: '#14b8a6' }}>1</button>
            <button className="user-page-btn" disabled>
              Next<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
