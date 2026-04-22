'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, createCategory, isApiConfigured } from '@/lib/api';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
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
      await createCategory({
        name: name.trim(),
        slug: slug.trim() === '' ? null : slug.trim(),
        description: description.trim() === '' ? null : description.trim(),
      });
      router.push('/categories');
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
          <h1>Add category</h1>
          <div className="page-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/categories">Categories</Link>
            <span>/</span>
            <span>Add</span>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title highlight" style={{ textTransform: 'uppercase' }}>Create category</h2>
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
              <label className="form-label">Slug</label>
              <div style={{ maxWidth: '800px' }}>
                <input type="text" className="form-control" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name if empty" />
              </div>
            </div>
            <div className="form-group-row">
              <label className="form-label">Description</label>
              <div style={{ maxWidth: '800px' }}>
                <textarea className="form-control" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <div className="form-group-row no-border">
              <label className="form-label" />
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Create'}</button>
                <Link href="/categories" className="btn btn-settings">Cancel</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
