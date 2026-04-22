'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthPageShell from '@/components/auth/AuthPageShell';
import { authRegister } from '@/lib/api/authPublic';
import { ApiError } from '@/lib/api/error';
import { getAccessToken } from '@/lib/auth/session';
import styles from '@/components/auth/auth-shell.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authRegister(username.trim(), password);
      router.push('/login?registered=1');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      title="Create your account"
      description="New accounts receive the viewer role. An administrator can promote you later."
      footer={
        <>
          Already registered?{' '}
          <Link href="/login">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <div className={styles.errorBox} role="alert">{error}</div>}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            className={styles.input}
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            className={styles.input}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <p className={styles.hint}>At least 8 characters.</p>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            type="password"
            className={styles.input}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthPageShell>
  );
}
