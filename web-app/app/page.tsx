'use client';

import { Container, Typography, Box } from '@mui/material';
import PostForm from './components/posts/PostForm';
import PostList from './components/posts/PostList';

export default function Page() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Social Feed
      </Typography>
      
      <PostForm />
      
      <Box sx={{ mb: 4 }}>
        <PostList />
      </Box>
    </Container>
  );
}