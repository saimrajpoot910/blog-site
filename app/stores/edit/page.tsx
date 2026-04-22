import Link from 'next/link';

export default function StoresEditIndexPage() {
  return (
    <div className="user-page-root" style={{ padding: '2rem 1.5rem' }}>
      <h1 className="user-page-title">Edit store</h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 520 }}>
        Choose a store from the list and use <strong>Edit</strong>, or open a direct link such as{' '}
        <code>/stores/edit/&lt;storeId&gt;</code>.
      </p>
      <Link href="/stores" className="user-btn-primary" style={{ marginTop: 16, display: 'inline-flex', textDecoration: 'none' }}>
        Go to all stores
      </Link>
    </div>
  );
}
