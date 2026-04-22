import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Media' };

export default function MediaPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-content">
          <h1>media_1</h1>
          <div className="page-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>media_1</span>
          </div>
        </div>
        <button className="btn-settings">Settings ⚙</button>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title highlight" style={{ textTransform: 'uppercase' }}>MEDIA</h2>
        </div>
        <div className="section-card-body" style={{ padding: 0 }}>
          <form className="horizontal-form" style={{ padding: '24px 0' }}>
            <div className="form-group-row no-border">
              <label className="form-label">Add Image For</label>
              <div style={{ maxWidth: '200px' }}>
                <select className="form-control">
                  <option>Store</option>
                  <option>Category</option>
                  <option>Deal</option>
                  <option>Coupon</option>
                </select>
              </div>
            </div>

            <div className="form-group-row no-border" style={{ paddingTop: 0 }}>
              <label className="form-label">Image</label>
              <div>
                <div className="file-input-wrapper">
                  <div className="file-input-text"></div>
                  <button type="button" className="btn-file">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg> Choose file
                  </button>
                  <input type="file" />
                </div>
              </div>
            </div>

            <div className="form-group-row no-border" style={{ paddingTop: 0 }}>
              <label className="form-label">Save</label>
              <div>
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>Save</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
