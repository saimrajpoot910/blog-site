import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Image Compressor' };

export default function ImageCompressorPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-content">
          <h1>imgcompressor_1</h1>
          <div className="page-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>imgcompressor_1</span>
          </div>
        </div>
        <button className="btn-settings">Settings ⚙</button>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h2 className="section-card-title highlight" style={{ textTransform: 'uppercase' }}>COMPRESS IMAGE</h2>
        </div>
        <div className="section-card-body" style={{ padding: 0 }}>
          <form className="horizontal-form" style={{ padding: '24px 0' }}>

            <div className="form-group-row no-border">
              <label className="form-label">Choose Image</label>
              <div>
                <div className="file-input-wrapper" style={{ border: 'none', maxWidth: 'max-content' }}>
                  <button type="button" className="btn-file" style={{ borderRadius: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> Choose file
                  </button>
                  <input type="file" />
                </div>
              </div>
            </div>

            <div className="form-group-row no-border" style={{ paddingTop: 0 }}>
              <label className="form-label">Select Quality</label>
              <div style={{ maxWidth: '120px' }}>
                <select className="form-control">
                  <option>50</option>
                  <option>60</option>
                  <option>70</option>
                  <option>80</option>
                  <option>90</option>
                </select>
              </div>
            </div>

            <div className="form-group-row no-border" style={{ paddingTop: 0 }}>
              <label className="form-label">Compress</label>
              <div>
                <button type="submit" className="btn btn-success" style={{ padding: '8px 24px', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'inline-block' }}>Submit</button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
