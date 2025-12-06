'use client';

import { useState } from 'react';
import Link from 'next/link';
import OtpPopup from '../components/otpPopup';
import { Button, FormHelperText, List, ListItem, TextField, Typography } from '@mui/material';

export default function LoginPage() {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showChecklist, setShowChecklist] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [errorPasswod, setErrorPasswod] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  const isMobile = /^[6-9]\d{9}$/.test(input);
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
    { label: "Contains number", valid: /\d/.test(password) },
    { label: "Contains special character (@$!%*?&)", valid: /[@$!%*?&]/.test(password) },
  ];

  const isStrong = strongPasswordRegex.test(password);
  const isValidInput = isEmail || isMobile;

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // ✅ disable button

    try {

      // Simulate async validation (like API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!isValidInput) {
        setError("Please enter a valid email or mobile number");
        return;
      }
      if (!isStrong) {
        setErrorPasswod("Password is not strong enough");
        setShowChecklist(true);
        return;
      }

      setError("");
      setShowOtp(true); // ✅ open OTP popup
    } finally {
      setIsLoading(false); // ✅ re-enable button after all promises resolve
    }
  };



  return (
    <main style={styles.container}>
      <h2 style={styles.title}>LOGIN TO BEST CHOICE</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
      <input
            type="text"
            placeholder="Email or Mobile Number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            required
          />
      {!isValidInput && error && <p style={{color: 'red',
  fontSize: '14px',
  marginBottom: '8px'}}>{error}</p>}
        <input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={styles.input}
  required
/>
{!isStrong && errorPasswod && <p style={{color: 'red',
  fontSize: '14px',
  marginBottom: '8px'}}>{errorPasswod}</p>}
{showChecklist && !isStrong && (
  <List sx={{ mt: 2 }}>
    {passwordChecks.map((check, idx) => (
      <ListItem key={idx} sx={{ fontSize: "0.85rem" }}>
        <Typography color={check.valid ? "green" : "error"}>
          {check.valid ? "✅" : "❌"} {check.label}
        </Typography>
      </ListItem>
    ))}
  </List>
)}
        <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 ,color:'white',borderRadius:'8px',backgroundColor:'purple',padding:'10px'}}
              disabled={isLoading || !input || !password} // ✅ disabled while loading
            >
              {isLoading ? "Checking..." : "Login"}
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
      {showOtp && <OtpPopup onClose={() => setShowOtp(false)} />}
    </main>
  );
}

const styles = {
  container: { maxWidth: 400, margin: '150px auto', padding: 20, textAlign: 'center' },
  title: {
  padding: '10px 25px',
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(8px)',
  color: '#fff',
  fontWeight: 600,
  marginBottom: '20px',
  border: '1px solid rgba(255,255,255,0.3)'},
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '10px', borderRadius: 6, border: '1px solid #ccc',color:'white',background:'rgba(255,255,255,0.1)' },
  button: { padding: '10px', backgroundColor: 'purple',cursor:'pointer', color: 'white', border: 'none', borderRadius: 6 },
  secondaryButton: { padding: '5px 8px 5px 8px',cursor:'pointer', backgroundColor: 'orange', color: 'black', border: 'none', borderRadius: 6 },
  link: { marginTop: 8, fontSize: 14, color: 'blue', textDecoration: 'underline', cursor: 'pointer' },
  forgot: { marginTop: 8, fontSize: 14, color: 'white', textDecoration: 'underline', cursor: 'pointer' }
};
