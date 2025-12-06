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

export default function OtpPopup({ onClose }: { onClose: () => void }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setError("");
    console.log("OTP verified:", otp);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Enter OTP</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          margin="normal"
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleVerify} variant="contained" color="primary">
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
}
