'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  Card, 
  CardContent, 
  Chip, 
  Stack, 
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SearchIcon from '@mui/icons-material/Search';
import PostForm from './components/posts/PostForm';
import PostList from './components/posts/PostList';
import { firestoreUtils } from './firebase/utils/firestore';

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

interface Stats {
  totalPosts: number;
  totalUsers: number;
  totalInteractions: number;
}

export default function Page() {
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>({ totalPosts: 0, totalUsers: 0, totalInteractions: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trending posts (most liked)
        const posts = await firestoreUtils.getAllDocuments('posts');
        const sorted = (posts as Post[])
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 3);
        setTrendingPosts(sorted);

        // Extract and count keywords
        const allKeywords = posts.flatMap((post: Post) => post.keywords || []);
        const keywordCount = allKeywords.reduce((acc: Record<string, number>, keyword) => {
          acc[keyword] = (acc[keyword] || 0) + 1;
          return acc;
        }, {});
        const topKeywords = Object.entries(keywordCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([keyword]) => keyword);
        setPopularKeywords(topKeywords);

        // Set stats
        setStats({
          totalPosts: posts.length,
          totalUsers: new Set(posts.map((post: Post) => post.authorId)).size,
          totalInteractions: posts.reduce((sum: number, post: Post) => sum + post.likes, 0),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Paper 
        component="form" 
        onSubmit={handleSearch}
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 4, 
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <TextField
          fullWidth
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {/* Left Sidebar - Stats */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="primary" /> Statistics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Posts</Typography>
              <Typography variant="h5" color="primary">{stats.totalPosts}</Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Active Users</Typography>
              <Typography variant="h5" color="primary">{stats.totalUsers}</Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>Total Interactions</Typography>
              <Typography variant="h5" color="primary">{stats.totalInteractions}</Typography>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalFireDepartmentIcon color="primary" /> Trending Topics
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {popularKeywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={() => router.push(`/search?keyword=${encodeURIComponent(keyword)}`)}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6}>
          <PostForm />
          <Box sx={{ mb: 4 }}>
            <PostList />
          </Box>
        </Grid>

        {/* Right Sidebar - Trending Posts */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BookmarkIcon color="primary" /> Trending Posts
            </Typography>
            {trendingPosts.map((post) => (
              <Card key={post.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {post.authorName}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {post.content}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="primary">
                      ❤️ {post.likes} likes
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}