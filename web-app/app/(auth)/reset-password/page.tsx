'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authUtils } from '@/app/firebase/utils/auth';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authUtils.resetPassword(email);
      setSuccess(true);
      setError('');
    } catch (error: any) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Reset Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset email sent! Check your inbox.
          </Alert>
        )}

        <Box component="form" onSubmit={handleResetPassword}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Reset Password
          </Button>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Typography color="primary" align="center">
              Back to Sign In
            </Typography>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}