'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Permission {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
}

const PERMISSIONS: Permission[] = [
  { id: 'general-settings', label: 'General Settings', category: 'System', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M20 12h-2M4 12H2M12 20v-2M12 4V2"/></svg> },
  { id: 'add-user',         label: 'Add User',         category: 'Users', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
  { id: 'edit-user',        label: 'Edit User',         category: 'Users', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { id: 'add-network',      label: 'Add Network',       category: 'Network', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { id: 'edit-network',     label: 'Edit Network',      category: 'Network', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { id: 'add-categories',   label: 'Add Categories',    category: 'Categories', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg> },
  { id: 'edit-categories',  label: 'Edit Categories',   category: 'Categories', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { id: 'add-stores',       label: 'Add Stores',        category: 'Stores', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { id: 'edit-stores',      label: 'Edit Stores',       category: 'Stores', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { id: 'add-coupons',      label: 'Add Coupons',       category: 'Coupons', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { id: 'edit-coupons',     label: 'Edit Coupons',      category: 'Coupons', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { id: 'add-deals',        label: 'Add Deals',         category: 'Deals', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { id: 'edit-deals',       label: 'Edit Deals',        category: 'Deals', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { id: 'add-blog',         label: 'Add Blog',          category: 'Blog', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { id: 'edit-blog',        label: 'Edit Blog',         category: 'Blog', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
];

const CATEGORIES = ['System', 'Users', 'Network', 'Categories', 'Stores', 'Coupons', 'Deals', 'Blog'];

const CATEGORY_COLORS: Record<string, string> = {
  System: '#6d35e3',
  Users: '#4f7df0',
  Network: '#14b8a6',
  Categories: '#f97316',
  Stores: '#e85d8a',
  Coupons: '#7c3aed',
  Deals: '#22c55e',
  Blog: '#3b82f6',
};

export default function AssignRolePage() {
  const [selectedUser, setSelectedUser] = useState('Ugfn-upjhbc');
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const togglePermission = (id: string) => {
    setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCategory = (cat: string) => {
    const categoryPerms = PERMISSIONS.filter((p) => p.category === cat);
    const allOn = categoryPerms.every((p) => permissions[p.id]);
    const update: Record<string, boolean> = {};
    categoryPerms.forEach((p) => { update[p.id] = !allOn; });
    setPermissions((prev) => ({ ...prev, ...update }));
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2800);
    }, 1100);
  };

  return (
    <div className="user-page-root">
      {/* Page Header */}
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(109,53,227,0.12)', color: 'var(--brand-primary)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">Assign Role</h1>
            <nav className="user-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <Link href="/users" className="user-breadcrumb-link">Users</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">Assign Role</span>
            </nav>
          </div>
        </div>
        <div className="user-role-stats">
          <div className="user-role-stat">
            <span className="user-role-stat-num">{enabledCount}</span>
            <span className="user-role-stat-label">Permissions On</span>
          </div>
          <div className="user-role-stat-divider" />
          <div className="user-role-stat">
            <span className="user-role-stat-num">{PERMISSIONS.length - enabledCount}</span>
            <span className="user-role-stat-label">Permissions Off</span>
          </div>
        </div>
      </div>

      {/* Save Toast */}
      {saved && (
        <div className="user-toast user-toast-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Role permissions saved successfully!
        </div>
      )}

      <div className="user-role-layout">
        {/* Left: User Selector */}
        <div className="user-role-sidebar-card">
          <div className="user-role-sidebar-header">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Select User
          </div>
          <div className="user-role-sidebar-body">
            <div className="user-input-wrap">
              <select
                id="assign-role-user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="user-input user-select"
                style={{ paddingLeft: '12px' }}
              >
                <option value="Ugfn-upjhbc">Ugfn-upjhbc</option>
                <option value="admin-user">admin-user</option>
                <option value="editor-01">editor-01</option>
              </select>
              <span className="user-select-arrow">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>

            {/* Selected user card */}
            <div className="user-role-user-card">
              <div className="user-avatar-large">
                {selectedUser.slice(0, 2).toUpperCase()}
              </div>
              <div className="user-role-user-info">
                <p className="user-role-user-name">{selectedUser}</p>
                <p className="user-role-user-meta">
                  {enabledCount} of {PERMISSIONS.length} permissions
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="user-role-progress-wrap">
              <div
                className="user-role-progress-bar"
                style={{ width: `${PERMISSIONS.length > 0 ? (enabledCount / PERMISSIONS.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Permissions Grid */}
        <div className="user-role-perms-card">
          <div className="user-role-perms-header">
            <span className="user-form-card-badge">Permissions</span>
            <button
              type="button"
              className="user-btn-ghost"
              onClick={() => setPermissions({})}
            >
              Clear All
            </button>
          </div>

          <div className="user-role-perms-body">
            {CATEGORIES.map((cat) => {
              const catPerms = PERMISSIONS.filter((p) => p.category === cat);
              const enabledInCat = catPerms.filter((p) => permissions[p.id]).length;
              const allOn = catPerms.length > 0 && enabledInCat === catPerms.length;
              const someOn = enabledInCat > 0 && !allOn;
              const color = CATEGORY_COLORS[cat] ?? 'var(--brand-primary)';

              return (
                <div key={cat} className="user-perm-category">
                  {/* Category Row */}
                  <div className="user-perm-cat-row">
                    <div className="user-perm-cat-label" style={{ color }}>
                      <span className="user-perm-cat-dot" style={{ background: color }} />
                      {cat}
                      <span className="user-perm-cat-count">
                        {enabledInCat}/{catPerms.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`user-perm-toggle-all ${allOn ? 'user-perm-toggle-all-on' : someOn ? 'user-perm-toggle-all-partial' : ''}`}
                      onClick={() => toggleCategory(cat)}
                      style={allOn ? { background: color, borderColor: color } : someOn ? { borderColor: color, color } : {}}
                    >
                      {allOn ? 'All On' : someOn ? 'Partial' : 'All Off'}
                    </button>
                  </div>

                  {/* Individual permissions */}
                  <div className="user-perm-items-grid">
                    {catPerms.map((perm) => {
                      const isOn = !!permissions[perm.id];
                      return (
                        <label
                          key={perm.id}
                          className={`user-perm-item ${isOn ? 'user-perm-item-on' : ''}`}
                          htmlFor={`perm-${perm.id}`}
                          style={isOn ? { borderColor: color, background: `${color}0d` } : {}}
                        >
                          <div className="user-perm-item-left">
                            <span className="user-perm-item-icon" style={isOn ? { color } : {}}>
                              {perm.icon}
                            </span>
                            <span className="user-perm-item-label">{perm.label}</span>
                          </div>
                          {/* Toggle switch */}
                          <div className="user-toggle-wrap">
                            <input
                              type="checkbox"
                              id={`perm-${perm.id}`}
                              checked={isOn}
                              onChange={() => togglePermission(perm.id)}
                              className="user-toggle-input"
                            />
                            <span
                              className={`user-toggle-track ${isOn ? 'user-toggle-on' : ''}`}
                              style={isOn ? { background: color } : {}}
                            >
                              <span className="user-toggle-thumb" />
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Footer */}
          <div className="user-form-footer" style={{ borderTop: '1px solid var(--card-border)', padding: '16px 24px', marginTop: 0 }}>
            <p className="user-role-footer-hint">
              Changes apply immediately for the selected user.
            </p>
            <button
              id="assign-role-save"
              type="button"
              className={`user-btn-primary${saving ? ' user-btn-loading' : ''}`}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="user-spinner" />
                  Saving…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Permissions
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
