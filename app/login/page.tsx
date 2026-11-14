'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
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
        setError("Please enter a valid email or mobile number");
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: input, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "Unable to log in. Please try again.");
        return;
      }
      const requestedPath = new URLSearchParams(window.location.search).get("next");
      router.push(requestedPath === "/shopkeeper/orders" ? requestedPath : "/");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <main className={styles.container}>
      <h2 className={styles.title}>LOGIN TO TIFFINNEST</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
      <input
            type="text"
            placeholder="Email or Mobile Number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={styles.input}
            required
          />
      {error && <p role="alert" className={styles.error}>{error}</p>}
        <input
  type="password"
  placeholder="Password"
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
              {isLoading ? "Logging in..." : "Login"}
            </Button>

        {/* Forgot Password link */}
        <Link href="/forgot-password" className={styles.forgot}>
          Forgot Password?
        </Link>

        {/* Register button */}
        <Link href="/register" className={styles.registerLink}>
          <button type="button" className={styles.secondaryButton}>
            Register
          </button>
        </Link>
      </form>
    </main>
  );
}
