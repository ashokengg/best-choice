'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

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
    <main style={styles.container}>
      <h2 style={styles.title}>LOGIN TO TIFFINNEST</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
      <input
            type="text"
            placeholder="Email or Mobile Number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            required
          />
      {error && <p role="alert" style={{ color: 'red', fontSize: '14px', marginBottom: '8px' }}>{error}</p>}
        <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={styles.input}
  required
/>
        <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 ,color:'white',borderRadius:'8px',backgroundColor:'purple',padding:'10px'}}
              disabled={isLoading || !input || !password}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

        {/* Forgot Password link */}
        <Link href="/forgot-password" style={styles.forgot}>
          Forgot Password?
        </Link>

        {/* Register button */}
        <Link href="/register" style={{ textDecoration: 'none' }}>
          <button type="button" style={styles.secondaryButton}>
            Register
          </button>
        </Link>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 400, margin: '150px auto', padding: 20 },
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
  button: { padding: '10px', backgroundColor: 'purple', cursor: 'pointer', color: 'white', border: 'none', borderRadius: 6 },
  secondaryButton: { padding: '5px 8px 5px 8px', cursor: 'pointer', backgroundColor: 'orange', color: 'black', border: 'none', borderRadius: 6 },
  link: { marginTop: 8, fontSize: 14, color: 'blue', textDecoration: 'underline', cursor: 'pointer' },
  forgot: { marginTop: 8, fontSize: 14, color: 'white', textDecoration: 'underline', cursor: 'pointer' },
};
