import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Create Coupon' };

export default function CreateCouponPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-content">
          <h1>add_coupon_1</h1>
          <div className="page-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>add_coupon_1</span>
          </div>
        </div>
        <button className="btn-settings">Settings ⚙</button>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title highlight" style={{ textTransform: 'uppercase' }}>CREATE COUPON PAGE</h2>
        </div>
        <div className="section-card-body" style={{ padding: 0 }}>
          <form className="horizontal-form" style={{ padding: '24px 0' }}>
            <div className="form-group-row">
              <label className="form-label">
                Title<span className="required">*</span>
              </label>
              <div style={{ maxWidth: '800px' }}>
                <input type="text" className="form-control" />
              </div>
            </div>

            <div className="form-group-row">
              <label className="form-label">
                Store<span className="required">*</span>
              </label>
              <div style={{ maxWidth: '300px' }}>
                <select className="form-control">
                  <option>Select Store...</option>
                </select>
              </div>
            </div>

            <div className="form-group-row">
              <label className="form-label">Coupon Code</label>
              <div style={{ maxWidth: '300px' }}>
                <input type="text" className="form-control" />
              </div>
            </div>

            <div className="form-group-row">
              <label className="form-label">Destination URL</label>
              <div style={{ maxWidth: '800px' }}>
                <input type="url" className="form-control" />
              </div>
            </div>

            <div className="form-group-row">
              <label className="form-label">Description</label>
              <div style={{ maxWidth: '100%', width: '800px' }}>
                <div className="richtext-container">
                  <div className="richtext-toolbar">
                    <div className="richtext-toolbar-group">
                      <span className="richtext-toolbar-btn" style={{ fontWeight: 'bold' }}>B</span>
                      <span className="richtext-toolbar-btn" style={{ textDecoration: 'underline' }}>U</span>
                      <span className="richtext-toolbar-btn" style={{ fontStyle: 'italic' }}>I</span>
                    </div>
                  </div>
                  <div className="richtext-content-area" contentEditable suppressContentEditableWarning></div>
                </div>
              </div>
            </div>

            <div className="form-group-row no-border">
              <label className="form-label">Create</label>
              <div>
                <button type="submit" className="btn btn-primary btn-settings" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>Page</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
