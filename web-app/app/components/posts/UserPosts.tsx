'use client';

import { useEffect, useState } from 'react';
import { firestoreUtils } from '@/app/firebase/utils/firestore';
import { storageUtils } from '@/app/firebase/utils/storage';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Divider,
  CardMedia,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  imageUrl?: string;
  keywords?: string[];
}

interface UserPostsProps {
  userId: string;
  onPostDeleted?: () => void;
}

export default function UserPosts({ userId, onPostDeleted }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserPosts = async () => {
    setIsLoading(true);
    try {
      const userPosts = await firestoreUtils.queryCollection('posts', 'authorId', '==', userId);
      const sortedPosts = userPosts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts as Post[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  const handleDelete = async (postId: string, imageUrl?: string) => {
    try {
      if (imageUrl) {
        const imagePath = imageUrl.split('local-5e9a4.firebasestorage.app/o/')[1].split('?')[0];
        const decodedPath = decodeURIComponent(imagePath);
        await storageUtils.deleteFile(decodedPath);
      }
      await firestoreUtils.deleteDocument('posts', postId);
      await fetchUserPosts();
      if (onPostDeleted) {
        onPostDeleted();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
        {error}
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No posts yet
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {posts.map((post) => (
        <Paper key={post.id} elevation={2} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => handleDelete(post.id, post.imageUrl)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {post.content}
          </Typography>

          {post.imageUrl && (
            <Box sx={{ mb: 2 }}>
              <CardMedia
                component="img"
                image={post.imageUrl}
                alt="Post image"
                sx={{ 
                  borderRadius: 1,
                  maxHeight: '400px',
                  width: '100%',
                  objectFit: 'contain'
                }}
              />
            </Box>
          )}

          {post.keywords && post.keywords.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {post.keywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    size="small"
                    icon={<LocalOfferIcon />}
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <FavoriteIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {post.likes}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}