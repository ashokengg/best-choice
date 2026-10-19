'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
        setError(result.error || 'Unable to register. Please try again.');
        return;
      }

      setSuccess('Your account was created. You can now log in.');
      setPassword('');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <h2 style={styles.title}>REGISTER TO TIFFINNEST</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          style={styles.input}
          maxLength={10}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          minLength={8}
          required
        />
        {error && <p role="alert" style={styles.error}>{error}</p>}
        {success && <p role="status" style={styles.success}>{success}</p>}
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Submit'}
        </button>
        <button type="button" onClick={()=>router.push('/login')} style={styles.loginButton}>Back To Login</button>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 400, margin: '150px auto', padding: '20px' },
  title: {
    padding: '10px 25px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    fontWeight: 600,
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '10px', borderRadius: 6, border: '1px solid #ccc', color: 'white', background: 'rgba(255,255,255,0.1)' },
  button: { padding: '10px', backgroundColor: 'orange', color: 'black', cursor: 'pointer', border: 'none', borderRadius: 6 },
  loginButton: { padding: '10px', backgroundColor: 'purple', cursor: 'pointer', color: 'white', border: 'none', borderRadius: 6 },
  error: { color: '#ffb4b4', margin: 0 },
  success: { color: '#a7f3d0', margin: 0 },
};
