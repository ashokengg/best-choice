'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TEXT } from '../constants';
import styles from './page.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tel, setTel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: tel, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || TEXT.auth.unableToRegister);
        return;
      }

      setSuccess(TEXT.auth.accountCreated);
      setPassword('');
    } catch {
      setError(TEXT.auth.serverUnavailable);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h2 className={styles.title}>{TEXT.auth.registerTitle}</h2>
      <form onSubmit={handleRegister} className={styles.form}>
        <input
          type="text"
          placeholder={TEXT.auth.fullName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="tel"
          placeholder={TEXT.auth.mobileNumber}
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          className={styles.input}
          maxLength={10}
          required
        />
        <input
          type="email"
          placeholder={TEXT.auth.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder={TEXT.auth.createPassword}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          minLength={8}
          required
        />
        {error && <p role="alert" className={styles.error}>{error}</p>}
        {success && <p role="status" className={styles.success}>{success}</p>}
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? TEXT.auth.creatingAccount : TEXT.auth.submit}
        </button>
        <button type="button" onClick={()=>router.push('/login')} className={styles.loginButton}>{TEXT.auth.backToLogin}</button>
      </form>
    </main>
  );
}
