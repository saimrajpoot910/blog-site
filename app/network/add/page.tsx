'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, createNetwork, isApiConfigured } from '@/lib/api';

export default function CreateNetworkPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isApiConfigured()) {
      setError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      return;
    }
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    setSubmitting(true);
    try {
      await createNetwork({
        name: name.trim(),
        trackingUrl: trackingUrl.trim() === '' ? null : trackingUrl.trim(),
      });
      router.push('/network');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Create failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-content">
          <h1>Add network</h1>
          <div className="page-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/network">Networks</Link>
            <span>/</span>
            <span>Add</span>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title highlight" style={{ textTransform: 'uppercase' }}>Create network</h2>
        </div>
        <div className="section-card-body" style={{ padding: 24 }}>
          {error && <p style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</p>}
          <form className="horizontal-form" onSubmit={handleSubmit}>
            <div className="form-group-row">
              <label className="form-label">Name<span className="required">*</span></label>
              <div style={{ maxWidth: '800px' }}>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group-row">
              <label className="form-label">Tracking URL</label>
              <div style={{ maxWidth: '800px' }}>
                <input type="url" className="form-control" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="https://…" />
              </div>
            </div>
            <div className="form-group-row no-border">
              <label className="form-label" />
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Create'}</button>
                <Link href="/network" className="btn btn-settings">Cancel</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
