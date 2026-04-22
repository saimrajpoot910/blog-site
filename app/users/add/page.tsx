'use client';

import type { Metadata } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    userType: '',
    network: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({ name: '', password: '', userType: '', network: '' });
    }, 1200);
  };

  return (
    <div className="user-page-root">
      {/* Page Header */}
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
        <Link href="/users" className="user-header-btn-outline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Users
        </Link>
      </div>

      {/* Success Toast */}
      {submitted && (
        <div className="user-toast user-toast-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          User created successfully!
        </div>
      )}

      {/* Form Card */}
      <div className="user-form-card">
        <div className="user-form-card-header">
          <span className="user-form-card-badge">Create User</span>
          <p className="user-form-card-sub">Fill in the details below to register a new user account.</p>
        </div>

        <form onSubmit={handleSubmit} className="user-form-body" noValidate>
          {/* Two-column split */}
          <div className="user-form-grid">
            {/* Name */}
            <div className="user-field-group">
              <label htmlFor="add-name" className="user-field-label">
                Full Name
                <span className="user-field-required">*</span>
              </label>
              <div className="user-input-wrap">
                <span className="user-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="add-name"
                  name="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="user-input"
                  required
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password */}
            <div className="user-field-group">
              <label htmlFor="add-password" className="user-field-label">
                Password
                <span className="user-field-required">*</span>
              </label>
              <div className="user-input-wrap">
                <span className="user-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="add-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="user-input"
                  style={{ paddingRight: '44px' }}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="user-input-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* User Type */}
            <div className="user-field-group">
              <label htmlFor="add-userType" className="user-field-label">
                User Type
                <span className="user-field-required">*</span>
              </label>
              <div className="user-input-wrap">
                <span className="user-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <select
                  id="add-userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="user-input user-select"
                  required
                >
                  <option value="">Select user type…</option>
                  <option value="admin">Administrator</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                  <option value="moderator">Moderator</option>
                </select>
                <span className="user-select-arrow">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Network */}
            <div className="user-field-group">
              <label htmlFor="add-network" className="user-field-label">
                Choose Network
              </label>
              <div className="user-input-wrap">
                <span className="user-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </span>
                <input
                  id="add-network"
                  name="network"
                  type="text"
                  placeholder="Search or enter network…"
                  value={formData.network}
                  onChange={handleChange}
                  className="user-input"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="user-form-footer">
            <button type="reset" className="user-btn-ghost" onClick={() => setFormData({ name: '', password: '', userType: '', network: '' })}>
              Reset
            </button>
            <button
              type="submit"
              id="add-user-submit"
              className={`user-btn-primary${submitting ? ' user-btn-loading' : ''}`}
              disabled={submitting}
            >
              {submitting ? (
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
                  Save User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
