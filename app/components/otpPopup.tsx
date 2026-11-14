"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import styles from './otpPopup.module.css';
import { TEXT } from '../constants';

export default function OtpPopup({ onClose }: { onClose: () => void }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!/^\d{6}$/.test(otp)) {
      setError(TEXT.otp.invalid);
      return;
    }
    setError("");
    console.log("OTP verified:", otp);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{TEXT.otp.enter}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={TEXT.otp.label}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          margin="normal"
        />
        {error && (
          <Typography color="error" className={styles.error}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">{TEXT.otp.cancel}</Button>
        <Button onClick={handleVerify} variant="contained" color="primary">
          {TEXT.otp.verify}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
