'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, createStore, isApiConfigured, listCategories, type Category } from '@/lib/api';
import { storeStatusToApi } from '@/lib/formatters';

export default function CreateStorePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [heading, setHeading] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCats = useCallback(async () => {
    if (!isApiConfigured()) return;
    try {
      setCategories(await listCategories());
    } catch {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    void loadCats();
  }, [loadCats]);

  const toggleCat = (id: string) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isApiConfigured()) {
      setError('Set NEXT_PUBLIC_API_BASE_URL in .env.local.');
      return;
    }
    if (!name.trim() || !heading.trim()) {
      setError('Name and heading are required.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await createStore({
        name: name.trim(),
        heading: heading.trim(),
        status: storeStatusToApi('Draft'),
        featured: false,
        affiliateUrl: affiliateUrl.trim() === '' ? null : affiliateUrl.trim(),
        categoryIds,
        descriptionShortHtml: '',
        descriptionLongHtml: '',
      });
      router.push(`/stores/edit/${created.id}`);
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
          <h1>Add store</h1>
          <div className="page-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/stores">Stores</Link>
            <span>/</span>
            <span>Add</span>
          </div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title highlight" style={{ textTransform: 'uppercase' }}>Create store</h2>
        </div>
        <div className="section-card-body" style={{ padding: 24 }}>
          {error && <p style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</p>}
          <form className="horizontal-form" onSubmit={handleSubmit}>
            <div className="form-group-row">
              <label className="form-label">Store name<span className="required">*</span></label>
              <div style={{ maxWidth: 800 }}>
                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group-row">
              <label className="form-label">Heading<span className="required">*</span></label>
              <div style={{ maxWidth: 800 }}>
                <input className="form-control" value={heading} onChange={(e) => setHeading(e.target.value)} required />
              </div>
            </div>
            <div className="form-group-row">
              <label className="form-label">Affiliate URL</label>
              <div style={{ maxWidth: 800 }}>
                <input type="url" className="form-control" value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} placeholder="https://…" />
              </div>
            </div>
            <div className="form-group-row">
              <label className="form-label">Categories</label>
              <div style={{ maxWidth: 800, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {categories.map((c) => (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={categoryIds.includes(c.id)} onChange={() => toggleCat(c.id)} />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group-row no-border">
              <label className="form-label" />
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Create & edit'}</button>
                <Link href="/stores" className="btn btn-settings">Cancel</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
