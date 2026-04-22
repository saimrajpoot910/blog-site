'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

/* ─── Mini Rich-Text Editor (same as add page) ─── */
function RichEditor({ id, placeholder, initialValue = '' }: { id: string; placeholder: string; initialValue?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const exec = (cmd: string, value?: string) => { document.execCommand(cmd, false, value); editorRef.current?.focus(); };

  return (
    <div className="rich-editor-wrap">
      <div className="rich-toolbar">
        <button type="button" className="rich-btn" title="Bold"         onClick={() => exec('bold')}>          <strong>B</strong></button>
        <button type="button" className="rich-btn" title="Italic"       onClick={() => exec('italic')}>        <em>I</em></button>
        <button type="button" className="rich-btn" title="Underline"    onClick={() => exec('underline')}>     <u>U</u></button>
        <button type="button" className="rich-btn" title="Strikethrough"onClick={() => exec('strikeThrough')}> <s>S</s></button>
        <span className="rich-divider"/>
        <select className="rich-select" title="Font size" onChange={(e) => exec('fontSize', e.target.value)} defaultValue="">
          <option value="" disabled>Size</option>
          {['1','2','3','4','5','6','7'].map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <span className="rich-divider"/>
        <button type="button" className="rich-btn" title="Align Left"   onClick={() => exec('justifyLeft')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </button>
        <button type="button" className="rich-btn" title="Align Center" onClick={() => exec('justifyCenter')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </button>
        <button type="button" className="rich-btn" title="Bullet List"  onClick={() => exec('insertUnorderedList')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
        </button>
        <button type="button" className="rich-btn" title="Insert Link" onClick={() => { const url = prompt('Enter URL:'); if (url) exec('createLink', url); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
      </div>
      <div id={id} ref={editorRef} className="rich-body" contentEditable suppressContentEditableWarning
        data-placeholder={placeholder} style={{ minHeight: '160px' }}
        dangerouslySetInnerHTML={{ __html: initialValue }} />
    </div>
  );
}

/* ─── Mock store data ─── */
interface Store { id: string; name: string; heading: string; categories: string[]; status: string; featured: boolean; shortDesc: string; longDesc: string; }

const MOCK_STORES: Store[] = [
  { id: '1', name: 'Amazon',     heading: 'Promo Codes & Coupon', categories: ['Electronics','Fashion'], status: 'Active',   featured: true,  shortDesc: 'Shop millions of products at great prices.', longDesc: 'Amazon is the world\'s largest online retailer.' },
  { id: '2', name: 'Noon',       heading: 'Discount Deals',       categories: ['Fashion','Home & Living'], status: 'Active', featured: false, shortDesc: 'Your everyday marketplace.',                  longDesc: 'Noon offers a wide variety of products.' },
  { id: '3', name: 'NameCheap',  heading: 'Exclusive Offers',     categories: ['Tech'],                status: 'Draft',    featured: false, shortDesc: 'Domains, hosting & more.',                     longDesc: 'NameCheap provides affordable domain registration.' },
];

const HEADINGS   = ['Promo Codes & Coupon','Discount Deals','Exclusive Offers','Cashback Stores','Featured Partners'];
const CATEGORIES = ['Electronics','Fashion','Home & Living','Beauty','Sports','Travel','Food','Tech'];

export default function EditStorePage() {
  const [selectedId, setSelectedId] = useState('');
  const [store, setStore]           = useState<Store | null>(null);
  const [catOpen, setCatOpen]       = useState(false);
  const [saving,  setSaving]        = useState(false);
  const [saved,   setSaved]         = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const found = MOCK_STORES.find((s) => s.id === id) ?? null;
    setStore(found ? { ...found } : null);
    setLogoPreview('');
    setSaved(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!store) return;
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setStore({ ...store, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setStore({ ...store, [name]: value });
    }
  };

  const toggleCategory = (cat: string) => {
    if (!store) return;
    setStore({
      ...store,
      categories: store.categories.includes(cat)
        ? store.categories.filter((c) => c !== cat)
        : [...store.categories, cat],
    });
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 1200);
  };

  return (
    <div className="user-page-root">
      {/* Header */}
      <div className="user-page-header">
        <div className="user-page-header-left">
          <div className="user-page-icon-wrap" style={{ background: 'rgba(232,93,138,0.1)', color: '#e85d8a' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div>
            <h1 className="user-page-title">Edit Store</h1>
            <nav className="user-breadcrumb">
              <Link href="/" className="user-breadcrumb-link">Home</Link>
              <span className="user-breadcrumb-sep">›</span>
              <Link href="/stores" className="user-breadcrumb-link">Stores</Link>
              <span className="user-breadcrumb-sep">›</span>
              <span className="user-breadcrumb-current">Edit Store</span>
            </nav>
          </div>
        </div>
        <Link href="/stores/add" className="user-btn-primary"
          style={{ background: 'linear-gradient(135deg,#e85d8a,#c2185b)', boxShadow: '0 2px 12px rgba(232,93,138,0.35)', textDecoration: 'none' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Store
        </Link>
      </div>

      {saved && (
        <div className="user-toast user-toast-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Store updated successfully!
        </div>
      )}

      {/* Store Selector Card */}
      <div className="user-form-card">
        <div className="user-form-card-header">
          <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Select Store</span>
          <p className="user-form-card-sub">Choose a store to edit its details.</p>
        </div>
        <div className="user-form-body">
          <div className="user-field-group" style={{ maxWidth: '480px' }}>
            <label htmlFor="edit-store-select" className="user-field-label">Store</label>
            <div className="user-input-wrap">
              <span className="user-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </span>
              <select id="edit-store-select" value={selectedId} onChange={(e) => handleSelect(e.target.value)} className="user-input user-select">
                <option value="">Select Store…</option>
                {MOCK_STORES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <span className="user-select-arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!store && (
        <div className="store-edit-empty">
          <div className="store-edit-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <p className="store-edit-empty-title">No Store Selected</p>
          <p className="store-edit-empty-sub">Choose a store from the dropdown above to edit its details.</p>
        </div>
      )}

      {/* Edit Form */}
      {store && (
        <form onSubmit={handleSave} noValidate>
          <div className="store-form-layout">

            {/* ══ LEFT ══ */}
            <div className="store-col-main">
              <div className="user-form-card">
                <div className="user-form-card-header">
                  <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Basic Info</span>
                  <p className="user-form-card-sub">Editing: <strong>{store.name}</strong></p>
                </div>
                <div className="user-form-body">
                  <div className="user-form-grid">
                    <div className="user-field-group">
                      <label htmlFor="edit-store-name" className="user-field-label">Store Name <span className="user-field-required">*</span></label>
                      <div className="user-input-wrap">
                        <span className="user-input-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
                        <input id="edit-store-name" name="name" type="text" value={store.name} onChange={handleChange} className="user-input" required/>
                      </div>
                    </div>
                    <div className="user-field-group">
                      <label htmlFor="edit-store-heading" className="user-field-label">Heading <span className="user-field-required">*</span></label>
                      <div className="user-input-wrap">
                        <span className="user-input-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg></span>
                        <select id="edit-store-heading" name="heading" value={store.heading} onChange={handleChange} className="user-input user-select">
                          {HEADINGS.map((h) => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <span className="user-select-arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="user-field-group" style={{ marginTop: '20px' }}>
                    <label className="user-field-label">Choose Categories</label>
                    <div className="store-cat-selector" onClick={() => setCatOpen((v) => !v)}>
                      <span className="store-cat-selector-value">
                        {store.categories.length === 0
                          ? <span style={{ color: 'var(--text-muted)' }}>Select categories…</span>
                          : store.categories.map((c) => (
                              <span key={c} className="store-cat-chip">
                                {c}<button type="button" onClick={(e) => { e.stopPropagation(); toggleCategory(c); }}>×</button>
                              </span>
                            ))
                        }
                      </span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: catOpen ? 'rotate(180deg)' : 'none', transition: '200ms' }}><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    {catOpen && (
                      <div className="store-cat-dropdown">
                        {CATEGORIES.map((cat) => {
                          const checked = store.categories.includes(cat);
                          return (
                            <label key={cat} className={`store-cat-option${checked ? ' store-cat-option-checked' : ''}`}>
                              <input type="checkbox" checked={checked} onChange={() => toggleCategory(cat)} style={{ display: 'none' }}/>
                              <span className={`store-cat-check${checked ? ' store-cat-check-on' : ''}`}>
                                {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              </span>
                              {cat}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="user-form-card">
                <div className="user-form-card-header">
                  <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Short Description</span>
                </div>
                <div className="user-form-body" style={{ paddingTop: '16px' }}>
                  <RichEditor id="edit-store-short-desc" placeholder="Short description…" initialValue={store.shortDesc} />
                </div>
              </div>

              {/* Long Description */}
              <div className="user-form-card">
                <div className="user-form-card-header">
                  <span className="user-form-card-badge" style={{ color: '#6d35e3', background: 'rgba(109,53,227,0.09)' }}>Long Description</span>
                </div>
                <div className="user-form-body" style={{ paddingTop: '16px' }}>
                  <RichEditor id="edit-store-long-desc" placeholder="Full store description…" initialValue={store.longDesc} />
                </div>
              </div>
            </div>

            {/* ══ RIGHT ══ */}
            <div className="store-col-side">
              {/* Logo */}
              <div className="user-form-card">
                <div className="user-form-card-header">
                  <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Store Logo</span>
                </div>
                <div className="user-form-body">
                  <label htmlFor="edit-store-logo" className="store-logo-drop">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="store-logo-preview-img"/>
                    ) : (
                      <>
                        <div className="store-logo-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                        <p className="store-logo-hint">Click to update logo</p>
                        <p className="store-logo-sub">PNG, JPG, SVG — max 2 MB</p>
                      </>
                    )}
                    <input id="edit-store-logo" type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }}/>
                  </label>
                </div>
              </div>

              {/* Settings */}
              <div className="user-form-card">
                <div className="user-form-card-header">
                  <span className="user-form-card-badge" style={{ color: '#e85d8a', background: 'rgba(232,93,138,0.1)' }}>Settings</span>
                </div>
                <div className="user-form-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="user-field-group">
                    <label htmlFor="edit-store-status" className="user-field-label">Status</label>
                    <div className="user-input-wrap">
                      <select id="edit-store-status" name="status" value={store.status} onChange={handleChange} className="user-input user-select" style={{ paddingLeft: '12px' }}>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                      <span className="user-select-arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg></span>
                    </div>
                  </div>
                  <div className="cat-toggle-row" style={{ marginTop: 0 }}>
                    <div className="cat-toggle-info">
                      <p className="cat-toggle-label">Featured Store</p>
                      <p className="cat-toggle-sub">Show on homepage.</p>
                    </div>
                    <label className="user-toggle-wrap" htmlFor="edit-store-featured" style={{ cursor: 'pointer' }}>
                      <input type="checkbox" id="edit-store-featured" name="featured" checked={store.featured} onChange={handleChange} className="user-toggle-input"/>
                      <span className={`user-toggle-track${store.featured ? ' user-toggle-on' : ''}`} style={store.featured ? { background: '#e85d8a' } : {}}>
                        <span className="user-toggle-thumb"/>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="user-form-card">
                <div className="user-form-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button id="edit-store-save" type="submit"
                    className={`user-btn-primary${saving ? ' user-btn-loading' : ''}`}
                    disabled={saving}
                    style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg,#e85d8a,#c2185b)', boxShadow: '0 2px 12px rgba(232,93,138,0.35)' }}>
                    {saving ? (<><span className="user-spinner"/>Updating…</>) : (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Update Store</>
                    )}
                  </button>
                  <Link href="/stores" className="user-btn-ghost" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
