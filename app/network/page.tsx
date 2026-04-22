'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ApiError, deleteNetwork, isApiConfigured, listNetworks, setNetworkStatus, type NetworkListItem } from '@/lib/api';
import { formatNetworkStatus } from '@/lib/formatters';

export default function NetworkPage() {
  const [networks, setNetworks] = useState<NetworkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isApiConfigured()) {
      setLoadError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      setNetworks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      setNetworks(await listNetworks());
    } catch (e) {
      setNetworks([]);
      setLoadError(e instanceof ApiError ? e.message : 'Failed to load networks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return networks.filter((n) => n.name.toLowerCase().includes(q) || formatNetworkStatus(n.status).toLowerCase().includes(q));
  }, [networks, search]);

  const handleDelete = async (nid: string) => {
    try {
      await deleteNetwork(nid);
      setDeleteConfirm(null);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Delete failed');
    }
  };

  const toggleStatus = async (nid: string, current: string) => {
    const next = current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await setNetworkStatus(nid, next);
      await refresh();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Update failed');
    }
  };

  return (
    <div className="user-page-root">
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(20,184,166,0.1)', color: '#14b8a6' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
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
        <Link href="/network/add" id="network-add-btn" className="user-btn-primary" style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', textDecoration: 'none' }}>Add Network</Link>
      </div>

      {loadError && <div className="user-toast" style={{ background: 'rgba(239,68,68,0.12)', color: '#b91c1c', marginBottom: 12 }}>{loadError}</div>}

      <div className="net-stats-row">
        {[
          { label: 'Total Networks', value: networks.length, color: '#14b8a6' },
          { label: 'Active', value: networks.filter((n) => n.status === 'ACTIVE').length, color: '#22c55e' },
          { label: 'Inactive', value: networks.filter((n) => n.status === 'INACTIVE').length, color: '#f97316' },
          { label: 'Total Users', value: networks.reduce((s, n) => s + n.assignedUsers, 0), color: '#6d35e3' },
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
            <span className="user-table-count-label">All Networks</span>
            <span className="user-table-count-badge" style={{ background: '#14b8a6' }}>{networks.length}</span>
          </div>
          <div className="user-search-wrap">
            <input id="network-search" type="search" placeholder="Search networks…" value={search} onChange={(e) => setSearch(e.target.value)} className="user-search-input" />
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
              {loading ? (
                <tr><td colSpan={5} className="user-td-empty"><p>Loading…</p></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="user-td-empty"><p>No networks found</p></td></tr>
              ) : (
                filtered.map((net, idx) => {
                  const st = formatNetworkStatus(net.status);
                  return (
                    <tr key={net.id} className="user-tr">
                      <td className="user-td user-td-num">{idx + 1}</td>
                      <td className="user-td">
                        <div className="user-td-userinfo">
                          <div className="user-avatar-mini" style={{ background: 'linear-gradient(135deg,#14b8a6,#0d9488)', fontSize: '0.65rem' }}>{net.name.slice(0, 2).toUpperCase()}</div>
                          <span className="user-td-username">{net.name}</span>
                        </div>
                      </td>
                      <td className="user-td">{net.assignedUsers} user{net.assignedUsers !== 1 ? 's' : ''}</td>
                      <td className="user-td">
                        <span className={`user-status-badge ${st === 'Active' ? 'user-status-active' : 'user-status-disabled'}`}>
                          <span className="user-status-dot" />{st}
                        </span>
                      </td>
                      <td className="user-td user-td-actions">
                        <button type="button" className={`user-action-btn ${net.status === 'ACTIVE' ? 'user-action-disable' : 'user-action-enable'}`} onClick={() => toggleStatus(net.id, net.status)} id={`toggle-net-${net.id}`}>
                          {net.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                        </button>
                        {deleteConfirm === net.id ? (
                          <div className="user-delete-confirm-inline">
                            <span className="user-delete-confirm-label">Sure?</span>
                            <button type="button" className="user-action-btn user-action-delete-confirm" onClick={() => handleDelete(net.id)}>Yes</button>
                            <button type="button" className="user-action-btn user-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                          </div>
                        ) : (
                          <button type="button" className="user-action-btn user-action-delete" onClick={() => setDeleteConfirm(net.id)} id={`delete-net-${net.id}`}>Delete</button>
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
