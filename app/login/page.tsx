'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { authLogin } from '@/lib/api/authPublic';
import { ApiError } from '@/lib/api/error';
import { getAccessToken, setSession } from '@/lib/auth/session';
import styles from '@/components/auth/auth-shell.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredBanner, setRegisteredBanner] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace('/');
    }
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search);
    if (q.get('registered') === '1') {
      setRegisteredBanner(true);
      router.replace('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await authLogin(username.trim(), password);
      setSession(token, user);
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Welcome back"
      description="Sign in with your CMS username and password to manage stores, coupons, and more."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/signup">Create one</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {registeredBanner && (
          <div
            className={styles.errorBox}
            role="status"
            style={{ color: '#15803d', background: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.25)' }}
          >
            Account created. Sign in with your username and password.
          </div>
        )}
        {error && <div className={styles.errorBox} role="alert">{error}</div>}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-username">Username</label>
          <input
            id="login-username"
            className={styles.input}
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className={styles.input}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthPageShell>
  );
}
