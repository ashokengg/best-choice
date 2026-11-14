'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { TEXT } from '../constants';
import styles from './page.module.css';

export default function LoginPage() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const isMobile = /^[6-9]\d{9}$/.test(input);
  const isValidInput = isEmail || isMobile;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (!isValidInput) {
        setError(TEXT.auth.invalidLoginInput);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: input, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || TEXT.auth.unableToLogin);
        return;
      }
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      router.push(requestedPath === "/shopkeeper/orders" ? requestedPath : "/");
    } catch {
      setError(TEXT.auth.serverUnavailable);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <main className={styles.container}>
      <h2 className={styles.title}>{TEXT.auth.loginTitle}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
      <input
            type="text"
            placeholder={TEXT.auth.emailOrMobile}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.input}
            required
          />
      {error && <p role="alert" className={styles.error}>{error}</p>}
        <input
  type="password"
  placeholder={TEXT.auth.password}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className={styles.input}
  required
/>
        <Button
              type="submit"
              variant="contained"
              color="primary"
              className={styles.submitButton}
              disabled={isLoading || !input || !password}
            >
              {isLoading ? TEXT.auth.loggingIn : TEXT.auth.login}
            </Button>

        {/* Forgot Password link */}
        <Link href="/forgot-password" className={styles.forgot}>
          {TEXT.auth.forgotPassword}
        </Link>

        {/* Register button */}
        <Link href="/register" className={styles.registerLink}>
          <button type="button" className={styles.secondaryButton}>
            {TEXT.auth.register}
          </button>
        </Link>
      </form>
    </main>
  );
}
