'use client';

import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Social App. All rights reserved.
          </Typography>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <IconButton
              component="a"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Link href="/about" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="text.secondary">
              About
            </Typography>
          </Link>
          <Link href="/privacy" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="text.secondary">
              Privacy Policy
            </Typography>
          </Link>
          <Link href="/terms" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="text.secondary">
              Terms of Service
            </Typography>
          </Link>
          <Link href="/contact" style={{ textDecoration: 'none' }}>
            <Typography variant="body2" color="text.secondary">
              Contact Us
            </Typography>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}