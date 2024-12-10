'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
} from '@mui/material';

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Terms of Service
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Last updated: {new Date().toLocaleDateString()}
        </Typography>

        <Typography variant="body1" paragraph>
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using our platform.
          Your access to and use of the service is conditioned upon your acceptance of and compliance with these Terms.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the
            terms, then you do not have permission to access or use our platform.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            2. User Accounts
          </Typography>
          <Typography variant="body1" paragraph>
            When you create an account with us, you guarantee that:
          </Typography>
          <ul>
            <li>You are over the age of 13</li>
            <li>The information you provide is accurate and complete</li>
            <li>You will maintain the accuracy of such information</li>
            <li>Your use of the service will not violate any applicable law or regulation</li>
          </ul>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            3. Content
          </Typography>
          <Typography variant="body1" paragraph>
            Our platform allows you to post, link, store, share and otherwise make available certain information, text,
            graphics, videos, or other material. You are responsible for the content that you post, including its legality,
            reliability, and appropriateness.
          </Typography>
          <Typography variant="body1" paragraph>
            You retain your rights to any content you submit, post or display on or through the service.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            4. Prohibited Activities
          </Typography>
          <Typography variant="body1" paragraph>
            You may not access or use the platform for any purpose other than that for which we make it available.
            Prohibited activities include:
          </Typography>
          <ul>
            <li>Harassment, abuse, or threats of violence</li>
            <li>Posting false or misleading content</li>
            <li>Unauthorized data collection</li>
            <li>Malicious code distribution</li>
            <li>Interference with service operation</li>
          </ul>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            5. Termination
          </Typography>
          <Typography variant="body1" paragraph>
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or
            liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of
            the Terms.
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </Typography>
          <ul>
            <li>Your access to or use of or inability to access or use the service</li>
            <li>Any conduct or content of any third party on the service</li>
            <li>Any content obtained from the service</li>
            <li>Unauthorized access, use or alteration of your transmissions or content</li>
          </ul>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            7. Contact Us
          </Typography>
          <Typography variant="body1">
            If you have any questions about these Terms, please contact us at:
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Email: terms@example.com
          </Typography>
          <Typography variant="body1">
            Address: 123 Legal Street, Terms City, 12345
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}