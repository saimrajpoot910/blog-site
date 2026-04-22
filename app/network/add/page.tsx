import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Create Network' };

export default function CreateNetworkPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-content">
          <h1>add_network_1</h1>
          <div className="page-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>add_network_1</span>
          </div>
        </div>
        <button className="btn-settings">Settings ⚙</button>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title highlight" style={{ textTransform: 'uppercase' }}>CREATE NETWORK PAGE</h2>
        </div>
        <div className="section-card-body" style={{ padding: 0 }}>
          <form className="horizontal-form" style={{ padding: '24px 0' }}>
            <div className="form-group-row">
              <label className="form-label">
                Name<span className="required">*</span>
              </label>
              <div style={{ maxWidth: '800px' }}>
                <input type="text" className="form-control" />
              </div>
            </div>

            <div className="form-group-row">
              <label className="form-label">Tracking URL</label>
              <div style={{ maxWidth: '800px' }}>
                <input type="url" className="form-control" />
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
