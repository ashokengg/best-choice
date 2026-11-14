'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@mui/material';
import { TEXT } from '../constants';
import styles from './page.module.css';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (token && password !== confirmPassword) {
      setError(TEXT.auth.passwordsDoNotMatch);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        token ? '/api/auth/reset-password' : '/api/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(token ? { token, password } : { email }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || TEXT.auth.resetRequestFailed);
      setMessage(result.message || TEXT.auth.resetEmailIfRegistered);
      setPassword('');
      setConfirmPassword('');
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : TEXT.auth.resetRequestFailed,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.accent} />
      <header className={styles.intro}>
        <h1 className={styles.title}>
          {token ? TEXT.auth.resetPasswordTitle : TEXT.auth.forgotPasswordTitle}
        </h1>
        <p className={styles.subtitle}>
          {token ? TEXT.auth.resetPasswordSubtitle : TEXT.auth.forgotPasswordSubtitle}
        </p>
      </header>

      {message ? (
        <div className={styles.message} role="status">{message}</div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          {!token ? (
            <input
              autoComplete="email"
              className={styles.input}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={TEXT.auth.email}
              required
              type="email"
              value={email}
            />
          ) : (
            <>
              <input
                autoComplete="new-password"
                className={styles.input}
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={TEXT.auth.newPassword}
                required
                type="password"
                value={password}
              />
              <input
                autoComplete="new-password"
                className={styles.input}
                minLength={8}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={TEXT.auth.confirmPassword}
                required
                type="password"
                value={confirmPassword}
              />
            </>
          )}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <Button className={styles.submitButton} disabled={isLoading} type="submit" variant="contained">
            {isLoading
              ? TEXT.auth.resetLoading
              : token
                ? TEXT.auth.resetPassword
                : TEXT.auth.sendResetLink}
          </Button>
        </form>
      )}

      <Link className={styles.backLink} href="/login">{TEXT.auth.backToLogin}</Link>
    </main>
  );
}
