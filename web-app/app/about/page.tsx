'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';

export default function AboutPage() {
  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      title: 'Modern Technology Stack',
      description: 'Built with Next.js, Firebase, and Material-UI for a seamless user experience.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Platform',
      description: 'Enterprise-grade security with Firebase Authentication and secure data storage.',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: 'Community Focused',
      description: 'Designed to foster meaningful connections and conversations among users.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'High Performance',
      description: 'Optimized for speed and reliability across all devices and platforms.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Us
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Building the Future of Social Connectivity
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Welcome to our platform, where we're reimagining how people connect and share in the digital age.
          Our mission is to provide a secure, intuitive, and engaging space for meaningful interactions and content sharing.
        </Typography>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <Avatar sx={{ width: 60, height: 60, mb: 2, bgcolor: 'primary.main' }}>
                {feature.icon}
              </Avatar>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom align="center">
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Our Vision
        </Typography>
        <Typography variant="body1" paragraph>
          We envision a digital world where technology brings people closer together, facilitates meaningful conversations,
          and enables the sharing of ideas that matter. Our platform is built on the principles of transparency,
          security, and user empowerment.
        </Typography>
        <Typography variant="body1" paragraph>
          By combining cutting-edge technology with thoughtful design, we're creating a space where communities can
          thrive and individuals can express themselves freely while maintaining their privacy and security.
        </Typography>
        <Typography variant="body1">
          Join us in shaping the future of digital social interaction, where every voice matters and every
          connection counts.
        </Typography>
      </Box>
    </Container>
  );
}