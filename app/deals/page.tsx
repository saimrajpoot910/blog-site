import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Deals' };

export default function DealsPage() {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <h1>Deals</h1>
        <p>Create and manage promotional deals</p>
      </div>
    </div>
  );
}
