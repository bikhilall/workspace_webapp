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
  Chip,
  Stack,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SearchIcon from '@mui/icons-material/Search';

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

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const fetchPosts = async (keyword?: string) => {
    setIsLoading(true);
    try {
      let postsData;
      if (keyword) {
        postsData = await firestoreUtils.searchPostsByKeyword(keyword);
      } else {
        postsData = await firestoreUtils.getAllDocuments('posts');
      }
      
      const sortedPosts = postsData.sort((a, b) => 
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
    fetchPosts();
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      setSelectedKeyword(searchTerm.trim().toLowerCase());
      await fetchPosts(searchTerm.trim().toLowerCase());
    }
  };

  const clearSearch = async () => {
    setSearchTerm('');
    setSelectedKeyword(null);
    await fetchPosts();
  };

  const handleKeywordClick = async (keyword: string) => {
    setSearchTerm(keyword);
    setSelectedKeyword(keyword);
    await fetchPosts(keyword);
  };

  const handleDelete = async (postId: string, imageUrl?: string) => {
    try {
      if (imageUrl) {
        const imagePath = imageUrl.split('local-5e9a4.firebasestorage.app/o/')[1].split('?')[0];
        const decodedPath = decodeURIComponent(imagePath);
        await storageUtils.deleteFile(decodedPath);
      }
      await firestoreUtils.deleteDocument('posts', postId);
      await fetchPosts(selectedKeyword || undefined);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLike = async (post: Post) => {
    if (!auth.currentUser) {
      setError('You must be logged in to like posts');
      return;
    }

    const userId = auth.currentUser.uid;
    const isLiked = post.likedBy?.includes(userId);
    const updatedLikedBy = isLiked
      ? post.likedBy.filter(id => id !== userId)
      : [...(post.likedBy || []), userId];

    // Optimistically update UI
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === post.id
          ? {
              ...p,
              likes: isLiked ? p.likes - 1 : p.likes + 1,
              likedBy: updatedLikedBy
            }
          : p
      )
    );

    try {
      await firestoreUtils.updateDocument('posts', post.id, {
        likes: isLiked ? post.likes - 1 : post.likes + 1,
        likedBy: updatedLikedBy
      });
    } catch (err: any) {
      // Revert optimistic update on error
      setError('Failed to update like status');
      await fetchPosts(selectedKeyword || undefined);
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
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: selectedKeyword && (
              <InputAdornment position="end">
                <Chip
                  label={`Filtering: ${selectedKeyword}`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            {selectedKeyword 
              ? `No posts found with keyword "${selectedKeyword}"`
              : 'No posts yet'}
          </Typography>
        </Paper>
      ) : (
        posts.map((post) => (
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
            {post.keywords && post.keywords.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {post.keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      size="small"
                      icon={<LocalOfferIcon />}
                      variant={selectedKeyword === keyword ? "filled" : "outlined"}
                      onClick={() => handleKeywordClick(keyword)}
                      color={selectedKeyword === keyword ? "primary" : "default"}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => handleLike(post)}
                color="primary"
              >
                {post.likedBy?.includes(auth.currentUser?.uid || '') 
                  ? <FavoriteIcon /> 
                  : <FavoriteBorderIcon />
                }
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {post.likes}
              </Typography>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}