'use client';

import { useEffect, useState } from 'react';
import { firestoreUtils } from '@/app/firebase/utils/firestore';
import { storageUtils } from '@/app/firebase/utils/storage';
import { auth } from '@/app/firebase/config';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Divider,
  CardMedia,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes: number;
  imageUrl?: string;
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const postsCollection = await firestoreUtils.getAllDocuments('posts');
      const sortedPosts = postsCollection.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts as Post[]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId: string, imageUrl?: string) => {
    try {
      if (imageUrl) {
        // Extract the path from the URL
        const imagePath = imageUrl.split('local-5e9a4.firebasestorage.app/o/')[1].split('?')[0];
        const decodedPath = decodeURIComponent(imagePath);
        await storageUtils.deleteFile(decodedPath);
      }
      await firestoreUtils.deleteDocument('posts', postId);
      await fetchPosts(); // Refresh posts after deletion
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

  return (
    <Box>
      {posts.map((post) => (
        <Paper key={post.id} elevation={2} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {post.authorName} • {formatDate(post.createdAt)}
            </Typography>
            {auth.currentUser?.uid === post.authorId && (
              <IconButton 
                size="small" 
                onClick={() => handleDelete(post.id, post.imageUrl)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
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
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <IconButton size="small">
              <FavoriteBorderIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {post.likes}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}