'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, createUser, isApiConfigured, listNetworks, type NetworkListItem } from '@/lib/api';

export default function AddUserPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [networks, setNetworks] = useState<NetworkListItem[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const loadNetworks = useCallback(async () => {
    if (!isApiConfigured()) return;
    try {
      setNetworks(await listNetworks());
    } catch {
      setNetworks([]);
    }
  }, []);

  useEffect(() => {
    void loadNetworks();
  }, [loadNetworks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isApiConfigured()) {
      setError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      return;
    }
    if (!username.trim() || !password || !role) {
      setError('Username, password, and role are required.');
      return;
    }
    setSubmitting(true);
    try {
      await createUser({
        username: username.trim(),
        password,
        role,
        networkId: networkId === '' ? null : networkId,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setUsername('');
      setPassword('');
      setRole('');
      setNetworkId('');
      router.push('/users');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-page-root">
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">Add New User</h1>
            <nav className="user-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <Link href="/users" className="user-breadcrumb-link">Users</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">Add User</span>
            </nav>
          </div>
        </div>
        <Link href="/users" className="user-header-btn-outline">All Users</Link>
      </div>

      {submitted && (
        <div className="user-toast user-toast-success">User created — redirecting…</div>
      )}
      {error && (
        <div className="user-toast" style={{ background: 'rgba(239,68,68,0.12)', color: '#b91c1c', marginBottom: 12 }}>{error}</div>
      )}

      <div className="user-form-card">
        <div className="user-form-card-header">
          <span className="user-form-card-badge">Create User</span>
          <p className="user-form-card-sub">Uses the admin API (MongoDB user ids).</p>
        </div>

        <form onSubmit={handleSubmit} className="user-form-body" noValidate>
          <div className="user-form-grid">
            <div className="user-field-group">
              <label htmlFor="add-username" className="user-field-label">Username<span className="user-field-required">*</span></label>
              <input id="add-username" value={username} onChange={(e) => setUsername(e.target.value)} className="user-input" required autoComplete="off" />
            </div>
            <div className="user-field-group">
              <label htmlFor="add-password" className="user-field-label">Password<span className="user-field-required">*</span></label>
              <input id="add-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="user-input" required minLength={8} autoComplete="new-password" />
              <button type="button" className="user-input-toggle" onClick={() => setShowPassword((v) => !v)} style={{ marginTop: 6 }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="user-field-group">
              <label htmlFor="add-role" className="user-field-label">Role<span className="user-field-required">*</span></label>
              <select id="add-role" value={role} onChange={(e) => setRole(e.target.value)} className="user-input user-select" required>
                <option value="">Select…</option>
                <option value="admin">Administrator</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div className="user-field-group">
              <label htmlFor="add-network" className="user-field-label">Network (optional)</label>
              <select id="add-network" value={networkId} onChange={(e) => setNetworkId(e.target.value)} className="user-input user-select">
                <option value="">None</option>
                {networks.map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="user-form-footer">
            <button type="button" className="user-btn-ghost" onClick={() => { setUsername(''); setPassword(''); setRole(''); setNetworkId(''); }}>Reset</button>
            <button type="submit" id="add-user-submit" className="user-btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Save User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
