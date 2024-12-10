'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
} from '@mui/material';

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Typography variant="body1" paragraph>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you use our platform.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information that you provide directly to us, including:
          </Typography>
          <ul>
            <li>Account information (name, email, password)</li>
            <li>Profile information (photo, bio)</li>
            <li>Content you post or share</li>
            <li>Communications with other users</li>
            <li>Usage data and analytics</li>
          </ul>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the collected information for various purposes:
          </Typography>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To provide analysis or valuable information to improve the service</li>
            <li>To monitor the usage of the service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate technical and organizational security measures to protect your personal data against accidental
            or unlawful destruction, loss, alteration, unauthorized disclosure, or access.
          </Typography>
          <Typography variant="body1" paragraph>
            However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.
            While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its
            absolute security.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Data Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have certain rights regarding your personal data:
          </Typography>
          <ul>
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to request deletion of your data</li>
            <li>Right to restrict processing of your data</li>
            <li>Right to data portability</li>
            <li>Right to object to processing of your data</li>
          </ul>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1">
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Email: privacy@example.com
          </Typography>
          <Typography variant="body1">
            Address: 123 Privacy Street, Security City, 12345
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}