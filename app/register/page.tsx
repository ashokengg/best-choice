'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import { TEXT } from '../constants';
import styles from './page.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tel, setTel] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRules = [
    { label: TEXT.auth.passwordRuleLength, valid: password.length >= 8 },
    { label: TEXT.auth.passwordRuleCase, valid: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: TEXT.auth.passwordRuleNumber, valid: /\d/.test(password) },
    { label: TEXT.auth.passwordRuleSpecial, valid: /[@$!%*?&]/.test(password) },
  ];
  const passwordStrength = passwordRules.filter((rule) => rule.valid).length;
  const completedFields = [name.trim(), tel, email, password].filter(Boolean).length;

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (passwordStrength !== passwordRules.length) {
      setShowPasswordRequirements(true);
      return;
    }

    setShowPasswordRequirements(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: tel, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || TEXT.auth.unableToRegister);
        return;
      }

      setSuccess(true);
      setPassword('');
    } catch {
      setError(TEXT.auth.serverUnavailable);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>{TEXT.auth.registerEyebrow}</p>
        <h1 className={styles.title}>{TEXT.auth.registerTitle}</h1>
        <p className={styles.subtitle}>{TEXT.auth.registerSubtitle}</p>
      </header>

      {!success ? (
        <>
          <div
            aria-label={TEXT.auth.registrationProgress(completedFields)}
            className={styles.progress}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={completedFields}
          >
            <span style={{ width: `${(completedFields / 4) * 100}%` }} />
          </div>
          <form onSubmit={handleRegister} className={styles.form}>
            <input
              autoComplete="name"
              type="text"
              placeholder={TEXT.auth.fullName}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
              className={styles.input}
              maxLength={100}
              required
            />
            <input
              autoComplete="tel"
              type="tel"
              inputMode="numeric"
              placeholder={TEXT.auth.mobileNumber}
              value={tel}
              onChange={(event) => {
                setTel(event.target.value.replace(/\D/g, '').slice(0, 10));
                setError('');
              }}
              className={styles.input}
              maxLength={10}
              pattern="[6-9][0-9]{9}"
              title={TEXT.auth.mobileNumberHint}
              required
            />
            <input
              autoComplete="email"
              type="email"
              placeholder={TEXT.auth.email}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError('');
              }}
              className={styles.input}
              required
            />
            <div className={styles.passwordField}>
              <input
                autoComplete="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={TEXT.auth.createPassword}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                }}
                className={`${styles.input} ${styles.passwordInput}`}
                minLength={8}
                required
              />
              <button
                aria-label={showPassword ? TEXT.auth.hidePassword : TEXT.auth.showPassword}
                aria-pressed={showPassword}
                className={styles.visibilityButton}
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
              </button>
            </div>
            {showPasswordRequirements && passwordStrength < passwordRules.length && (
              <div aria-live="polite" className={styles.passwordTooltip} role="status">
                <strong className={styles.tooltipTitle}>{TEXT.auth.passwordStrength}</strong>
                <ul className={styles.passwordRules}>
                  {passwordRules.map((rule) => (
                    <li className={rule.valid ? styles.ruleMet : styles.ruleUnmet} key={rule.label}>
                      <span aria-hidden="true">{rule.valid ? '✓' : '×'}</span>
                      {rule.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {error && <p role="alert" className={styles.error}>{error}</p>}
            <Button
              type="submit"
              variant="contained"
              className={styles.submitButton}
              disabled={isLoading}
              onClick={() => {
                if (passwordStrength !== passwordRules.length) {
                  setShowPasswordRequirements(true);
                }
              }}
            >
              {isLoading ? TEXT.auth.creatingAccount : TEXT.auth.createAccount}
            </Button>
            <div className={styles.formLinks}>
              <span>{TEXT.auth.alreadyHaveAccount}</span>
              <Link href="/login" className={styles.loginLink}>{TEXT.auth.login}</Link>
            </div>
          </form>
        </>
      ) : (
        <section className={styles.successPanel} role="status">
          <span aria-hidden="true" className={styles.successIcon}>✓</span>
          <p className={styles.success}>{TEXT.auth.accountCreated}</p>
          <Link className={styles.successLink} href="/login">{TEXT.auth.login}</Link>
        </section>
      )}
    </main>
  );
}
