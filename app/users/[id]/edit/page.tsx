'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ApiError, getUser, isApiConfigured, listNetworks, updateUser, type NetworkListItem, type UserDetail } from '@/lib/api';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const [user, setUser] = useState<UserDetail | null>(null);
  const [networks, setNetworks] = useState<NetworkListItem[]>([]);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id || !isApiConfigured()) {
      setError(!isApiConfigured() ? 'Set NEXT_PUBLIC_API_BASE_URL in .env.local.' : 'Missing user id.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [u, nets] = await Promise.all([getUser(id), listNetworks()]);
      setUser(u);
      setUsername(u.username);
      setRole(u.role);
      setNetworkId(u.networkId ?? '');
      setNetworks(nets);
    } catch (e) {
      setUser(null);
      setError(e instanceof ApiError ? e.message : 'Failed to load user.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const body: { username?: string; role?: string; password?: string; networkId?: string | null } = {};
      if (username.trim() !== user?.username) body.username = username.trim();
      if (role !== user?.role) body.role = role;
      if (password.length > 0) body.password = password;
      const nextNet = networkId === '' ? null : networkId;
      const prevNet = user?.networkId ?? null;
      if (nextNet !== prevNet) body.networkId = nextNet;
      if (Object.keys(body).length === 0) {
        setError('No changes to save.');
        setSaving(false);
        return;
      }
      await updateUser(id, body);
      router.push('/users');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="user-page-root"><p>Loading…</p></div>;
  if (!user && error) {
    return (
      <div className="user-page-root">
        <p style={{ color: '#b91c1c' }}>{error}</p>
        <Link href="/users">Back</Link>
      </div>
    );
  }

  return (
    <div className="user-page-root">
      <div className="user-page-header">
        <div className="user-page-header-left">
          <h1 className="user-page-title">Edit user</h1>
          <nav className="user-breadcrumb">
            <Link href="/users" className="user-breadcrumb-link">Users</Link>
            <span className="user-breadcrumb-sep">›</span>
            <span className="user-breadcrumb-current">{user?.username}</span>
          </nav>
        </div>
      </div>
      {error && <div className="user-toast" style={{ background: 'rgba(239,68,68,0.12)', color: '#b91c1c', marginBottom: 12 }}>{error}</div>}

      <div className="user-form-card">
        <form onSubmit={handleSubmit} className="user-form-body">
          <div className="user-form-grid">
            <div className="user-field-group">
              <label className="user-field-label">Username</label>
              <input className="user-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="user-field-group">
              <label className="user-field-label">New password (optional)</label>
              <input className="user-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} autoComplete="new-password" />
            </div>
            <div className="user-field-group">
              <label className="user-field-label">Role</label>
              <select className="user-input user-select" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
                <option value="moderator">moderator</option>
              </select>
            </div>
            <div className="user-field-group">
              <label className="user-field-label">Network</label>
              <select className="user-input user-select" value={networkId} onChange={(e) => setNetworkId(e.target.value)}>
                <option value="">None</option>
                {networks.map((n) => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="user-form-footer">
            <Link href="/users" className="user-btn-ghost">Cancel</Link>
            <button type="submit" className="user-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
