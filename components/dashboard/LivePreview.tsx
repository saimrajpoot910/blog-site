import React from 'react';

export default function LivePreview() {
  return (
    <div className="section-card">
      <div className="section-card-header">
        <h2 className="section-card-title">
          <span className="highlight">Live</span>&nbsp;Preview
        </h2>
      </div>

      <div className="section-card-body">
        <div className="live-preview-area">
          <div className="live-preview-empty" aria-label="No content selected">
            <div className="live-preview-empty-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <p>Select an item to preview it here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
