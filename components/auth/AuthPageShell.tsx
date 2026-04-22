'use client';

import React from 'react';
import Link from 'next/link';
import styles from './auth-shell.module.css';

type AuthPageShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export default function AuthPageShell({ title, description, children, footer }: AuthPageShellProps) {
  return (
    <div className={styles.shell}>
      <div className={styles.deco} aria-hidden />
      <div className={styles.deco2} aria-hidden />

      <div className={styles.brandRow}>
        <div className={styles.brandMark}>UR</div>
        <div className={styles.brandText}>
          <div className={styles.brandTitle}>Update Review</div>
          <div className={styles.brandSub}>Content Management System</div>
        </div>
      </div>

      <div className={styles.card}>
        <header className={styles.cardHeader}>
          <h1 className={styles.cardTitle}>{title}</h1>
          <p className={styles.cardDesc}>{description}</p>
        </header>
        {children}
        <div className={styles.footer}>{footer}</div>
      </div>

      <p style={{ marginTop: 28, fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', zIndex: 1 }}>
        <Link href="/" style={{ color: 'rgba(255,255,255,0.65)' }}>← Back to dashboard</Link>
      </p>
    </div>
  );
}
