'use client';

import { useState, useEffect } from 'react';
import { firestoreUtils } from '@/app/firebase/utils/firestore';
import {
  Container,
  Typography,
  Box,
  TextField,
  Paper,
  IconButton,
  CardMedia,
  Chip,
  Stack,
  CircularProgress,
  InputAdornment,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { auth } from '@/app/firebase/config';
import { useRouter, useSearchParams } from 'next/navigation';

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes: number;
  imageUrl?: string;
  keywords?: string[];
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      setSearchTerm(keyword);
      performSearch(keyword);
    }
  }, [searchParams]);

  const performSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const results = await firestoreUtils.searchPostsByKeyword(term.toLowerCase());
      setPosts(results as Post[]);
    } catch (err: any) {
      setError(err.message);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    router.push(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
    await performSearch(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPosts([]);
    router.push('/search');
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Posts
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts by keyword..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 && searchTerm ? (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No posts found with keyword "{searchTerm}"
          </Typography>
        </Paper>
      ) : (
        posts.map((post) => (
          <Paper key={post.id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {post.authorName} • {formatDate(post.createdAt)}
              </Typography>
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
                      onClick={() => {
                        setSearchTerm(keyword);
                        router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
                      }}
                      color={searchTerm === keyword ? "primary" : "default"}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <IconButton size="small">
                <FavoriteBorderIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {post.likes}
              </Typography>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
}