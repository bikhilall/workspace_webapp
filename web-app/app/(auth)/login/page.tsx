'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authUtils } from '@/app/firebase/utils/auth';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authUtils.login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authUtils.loginWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleEmailLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Sign In
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>

        <Box sx={{ mt: 2 }}>
          <Link href="/register" style={{ textDecoration: 'none' }}>
            <Typography color="primary" align="center">
              Don't have an account? Sign Up
            </Typography>
          </Link>
        </Box>
        <Box sx={{ mt: 1 }}>
          <Link href="/reset-password" style={{ textDecoration: 'none' }}>
            <Typography color="primary" align="center">
              Forgot password?
            </Typography>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}