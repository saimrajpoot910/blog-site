'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ApiError,
  getStore,
  isApiConfigured,
  listCategories,
  updateStore,
  uploadStoreLogo,
  type Category,
  type StoreDetail,
} from '@/lib/api';
import { formatStoreStatus, storeStatusToApi } from '@/lib/formatters';
import { EditableHtmlArea } from '@/components/editor/EditableHtmlArea';

type UiStatus = 'Active' | 'Draft' | 'Disabled';

export default function EditStoreByIdPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';

  const shortRef = useRef<HTMLDivElement>(null);
  const longRef = useRef<HTMLDivElement>(null);

  const [editorKey, setEditorKey] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [name, setName] = useState('');
  const [heading, setHeading] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [statusUi, setStatusUi] = useState<UiStatus>('Active');
  const [featured, setFeatured] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [catOpen, setCatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const load = useCallback(async () => {
    if (!id || !isApiConfigured()) {
      setError(!isApiConfigured() ? 'Set NEXT_PUBLIC_API_BASE_URL in .env.local.' : 'Invalid store.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [s, cats] = await Promise.all([getStore(id), listCategories()]);
      setStore(s);
      setName(s.name);
      setHeading(s.heading);
      setAffiliateUrl(s.affiliateUrl ?? '');
      setStatusUi(formatStoreStatus(s.status));
      setFeatured(s.featured);
      setSelectedCategoryIds(s.categoryIds ?? []);
      setCategories(cats);
      setEditorKey((k) => k + 1);
    } catch (e) {
      setStore(null);
      setError(e instanceof ApiError ? e.message : 'Failed to load store.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleCategory = (cid: string) => {
    setSelectedCategoryIds((prev) => (prev.includes(cid) ? prev.filter((x) => x !== cid) : [...prev, cid]));
  };

  const handleLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setLogoUploading(true);
    setError(null);
    try {
      const updated = await uploadStoreLogo(id, file);
      setStore(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Logo upload failed.');
    } finally {
      setLogoUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const descriptionShortHtml = shortRef.current?.innerHTML ?? '';
      const descriptionLongHtml = longRef.current?.innerHTML ?? '';
      await updateStore(id, {
        name,
        heading,
        status: storeStatusToApi(statusUi),
        featured,
        affiliateUrl: affiliateUrl.trim() === '' ? null : affiliateUrl.trim(),
        categoryIds: selectedCategoryIds,
        descriptionShortHtml,
        descriptionLongHtml,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return <p className="user-page-root">Missing store id.</p>;
  }

  if (loading) {
    return (
      <div className="user-page-root">
        <p>Loading store…</p>
      </div>
    );
  }

  if (!store && error) {
    return (
      <div className="user-page-root">
        <p style={{ color: '#b91c1c' }}>{error}</p>
        <Link href="/stores">Back to stores</Link>
      </div>
    );
  }

  return (
    <div className="user-page-root">
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(232,93,138,0.1)', color: '#e85d8a' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">Edit Store</h1>
            <nav className="user-breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <Link href="/stores" className="user-breadcrumb-link">Stores</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">{name || 'Store'}</span>
            </nav>
          </div>
        </div>
        <button type="button" className="user-btn-primary" style={{ textDecoration: 'none', border: 'none', cursor: 'pointer' }} onClick={() => router.push('/stores/add')}>
          Add Store
        </button>
      </div>

      {saved && (
        <div className="user-toast user-toast-success">Store updated successfully!</div>
      )}
      {error && (
        <div className="user-toast" style={{ background: 'rgba(239,68,68,0.12)', color: '#b91c1c', marginBottom: 12 }}>{error}</div>
      )}

      <form onSubmit={handleSave} noValidate>
        <div className="store-form-layout">
          <div className="store-col-main">
            <div className="user-form-card">
              <div className="user-form-card-header">
                <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Basic Info</span>
              </div>
              <div className="user-form-body">
                <div className="user-form-grid">
                  <div className="user-field-group">
                    <label htmlFor="edit-store-name" className="user-field-label">Store Name <span className="user-field-required">*</span></label>
                    <input id="edit-store-name" value={name} onChange={(e) => setName(e.target.value)} className="user-input" required />
                  </div>
                  <div className="user-field-group">
                    <label htmlFor="edit-store-heading" className="user-field-label">Heading <span className="user-field-required">*</span></label>
                    <input id="edit-store-heading" value={heading} onChange={(e) => setHeading(e.target.value)} className="user-input" required />
                  </div>
                  <div className="user-field-group" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="edit-affiliate" className="user-field-label">Affiliate URL</label>
                    <input id="edit-affiliate" type="url" value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} className="user-input" placeholder="https://…" />
                  </div>
                </div>

                <div className="user-field-group" style={{ marginTop: 20 }}>
                  <span className="user-field-label">Categories</span>
                  <div className="store-cat-selector" onClick={() => setCatOpen((v) => !v)}>
                    <span className="store-cat-selector-value">
                      {selectedCategoryIds.length === 0 ? (
                        <span style={{ color: 'var(--text-muted)' }}>Select categories…</span>
                      ) : (
                        selectedCategoryIds.map((cid) => {
                          const c = categories.find((x) => x.id === cid);
                          return (
                            <span key={cid} className="store-cat-chip">
                              {c?.name ?? cid}
                              <button type="button" onClick={(e) => { e.stopPropagation(); toggleCategory(cid); }}>×</button>
                            </span>
                          );
                        })
                      )}
                    </span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: catOpen ? 'rotate(180deg)' : 'none', transition: '200ms' }}><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                  {catOpen && (
                    <div className="store-cat-dropdown">
                      {categories.map((cat) => {
                        const checked = selectedCategoryIds.includes(cat.id);
                        return (
                          <label key={cat.id} className={`store-cat-option${checked ? ' store-cat-option-checked' : ''}`}>
                            <input type="checkbox" checked={checked} onChange={() => toggleCategory(cat.id)} style={{ display: 'none' }} />
                            <span className={`store-cat-check${checked ? ' store-cat-check-on' : ''}`} />
                            {cat.name}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="user-form-card">
              <div className="user-form-card-header">
                <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Short Description</span>
              </div>
              <div className="user-form-body" style={{ paddingTop: 16 }}>
                <EditableHtmlArea key={`short-${editorKey}`} areaRef={shortRef} initialHtml={store?.descriptionShortHtml ?? ''} placeholder="Short description…" />
              </div>
            </div>

            <div className="user-form-card">
              <div className="user-form-card-header">
                <span className="user-form-card-badge" style={{ color: '#6d35e3', background: 'rgba(109,53,227,0.09)' }}>Long Description</span>
              </div>
              <div className="user-form-body" style={{ paddingTop: 16 }}>
                <EditableHtmlArea key={`long-${editorKey}`} areaRef={longRef} initialHtml={store?.descriptionLongHtml ?? ''} placeholder="Full store description…" minHeight={220} />
              </div>
            </div>
          </div>

          <div className="store-col-side">
            <div className="user-form-card">
              <div className="user-form-card-header">
                <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Store Logo</span>
              </div>
              <div className="user-form-body">
                <label htmlFor="edit-store-logo" className="store-logo-drop" style={{ cursor: 'pointer' }}>
                  {store?.logoUrl ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ''}${store.logoUrl}`} alt="Logo" className="store-logo-preview-img" />
                  ) : (
                    <div className="store-logo-hint">No logo — click to upload</div>
                  )}
                  <input id="edit-store-logo" type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} disabled={logoUploading} />
                </label>
                {logoUploading && <p style={{ fontSize: '0.8rem', marginTop: 8 }}>Uploading…</p>}
              </div>
            </div>

            <div className="user-form-card">
              <div className="user-form-card-header">
                <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Settings</span>
              </div>
              <div className="user-form-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="user-field-group">
                  <label htmlFor="edit-store-status" className="user-field-label">Status</label>
                  <select id="edit-store-status" value={statusUi} onChange={(e) => setStatusUi(e.target.value as UiStatus)} className="user-input user-select">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <label className="user-toggle-wrap" htmlFor="edit-store-featured" style={{ cursor: 'pointer' }}>
                  <span className="cat-toggle-label">Featured</span>
                  <input type="checkbox" id="edit-store-featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="user-toggle-input" />
                  <span className={`user-toggle-track${featured ? ' user-toggle-on' : ''}`} style={featured ? { background: '#e85d8a' } : {}}>
                    <span className="user-toggle-thumb" />
                  </span>
                </label>
              </div>
            </div>

            <div className="user-form-card">
              <div className="user-form-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button type="submit" className="user-btn-primary" disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                  {saving ? 'Updating…' : 'Update Store'}
                </button>
                <Link href="/stores" className="user-btn-ghost" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>Cancel</Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
