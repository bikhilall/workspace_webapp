'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  CardMedia,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ImageIcon from '@mui/icons-material/Image';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { firestoreUtils } from '../firebase/utils/firestore';

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

interface SearchFilters {
  hasImage: boolean;
  minLikes: number;
  dateRange: [number, number];
  selectedCategories: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`search-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 10;

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState({
    totalResults: 0,
    avgLikes: 0,
    withImages: 0,
  });

  const [filters, setFilters] = useState<SearchFilters>({
    hasImage: false,
    minLikes: 0,
    dateRange: [0, 100],
    selectedCategories: [],
  });

  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    const keyword = searchParams.get('keyword');
    if (keyword) {
      setSearchTerm(keyword);
      performSearch(keyword);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [filters, posts]);

  const applyFilters = () => {
    let filtered = [...posts];

    if (filters.hasImage) {
      filtered = filtered.filter(post => post.imageUrl);
    }

    filtered = filtered.filter(post => post.likes >= filters.minLikes);

    // Apply date range filter
    const now = new Date();
    const oldestDate = new Date();
    oldestDate.setDate(oldestDate.getDate() - 30); // 30 days ago
    const dateRange = filters.dateRange;
    filtered = filtered.filter(post => {
      const postDate = new Date(post.createdAt);
      const ageInDays = (now.getTime() - postDate.getTime()) / (1000 * 3600 * 24);
      return ageInDays >= dateRange[0] && ageInDays <= dateRange[1];
    });

    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(post =>
        post.keywords?.some(keyword => filters.selectedCategories.includes(keyword))
      );
    }

    setFilteredPosts(filtered);

    // Update analytics
    setSearchAnalytics({
      totalResults: filtered.length,
      avgLikes: Math.round(filtered.reduce((sum, post) => sum + post.likes, 0) / filtered.length) || 0,
      withImages: filtered.filter(post => post.imageUrl).length,
    });
  };

  const addToSearchHistory = (term: string) => {
    const newHistory = [
      term,
      ...searchHistory.filter(item => item !== term)
    ].slice(0, MAX_HISTORY_ITEMS);
    
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const removeFromHistory = (term: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newHistory = searchHistory.filter(item => item !== term);
    setSearchHistory(newHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setShowHistory(false);
  };

  const performSearch = async (term: string) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    setError('');
    setShowHistory(false);
    
    try {
      const results = await firestoreUtils.searchPostsByKeyword(term.toLowerCase());
      setPosts(results as Post[]);
      addToSearchHistory(term.trim());

      // Extract related topics from search results
      const topics = new Set<string>();
      results.forEach((post: Post) => {
        post.keywords?.forEach(keyword => {
          if (keyword !== term.toLowerCase()) {
            topics.add(keyword);
          }
        });
      });
      setRelatedTopics(Array.from(topics).slice(0, 5));

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

  const handleHistoryItemClick = (term: string) => {
    setSearchTerm(term);
    router.push(`/search?keyword=${encodeURIComponent(term)}`);
    performSearch(term);
    setShowHistory(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPosts([]);
    router.push('/search');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left Sidebar - Filters and Analytics */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Filters
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.hasImage}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasImage: e.target.checked }))}
                  />
                }
                label="Has Image"
              />
            </FormGroup>
            
            <Typography gutterBottom>Minimum Likes</Typography>
            <Slider
              value={filters.minLikes}
              onChange={(_, value) => setFilters(prev => ({ ...prev, minLikes: value as number }))}
              min={0}
              max={100}
              valueLabelDisplay="auto"
            />

            <Typography gutterBottom>Date Range (days ago)</Typography>
            <Slider
              value={filters.dateRange}
              onChange={(_, value) => setFilters(prev => ({ ...prev, dateRange: value as [number, number] }))}
              min={0}
              max={30}
              valueLabelDisplay="auto"
            />
          </Paper>

          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="primary" /> Search Analytics
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Results</Typography>
              <Typography variant="h6" color="primary">{searchAnalytics.totalResults}</Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Average Likes</Typography>
              <Typography variant="h6" color="primary">{searchAnalytics.avgLikes}</Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Posts with Images</Typography>
              <Typography variant="h6" color="primary">{searchAnalytics.withImages}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative', mb: 4 }}>
            <Box component="form" onSubmit={handleSearch}>
              <TextField
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowHistory(true)}
                placeholder="Search posts..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchHistory.length > 0 && (
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHistory(!showHistory);
                          }}
                        >
                          <HistoryIcon />
                        </IconButton>
                      )}
                      {searchTerm && (
                        <IconButton onClick={clearSearch}>
                          <ClearIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {showHistory && searchHistory.length > 0 && (
              <Box className="search-history-dropdown">
                {searchHistory.map((term, index) => (
                  <div
                    key={index}
                    className="search-history-item"
                    onClick={() => handleHistoryItemClick(term)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <HistoryIcon fontSize="small" color="action" />
                      <Typography>{term}</Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => removeFromHistory(term, e)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
                <div
                  className="search-history-clear"
                  onClick={clearSearchHistory}
                >
                  Clear All History
                </div>
              </Box>
            )}
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
          ) : filteredPosts.length > 0 ? (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="All Results" />
                  <Tab label="With Images" />
                  <Tab label="Most Liked" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                {filteredPosts.map((post) => (
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
                ))}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {filteredPosts.filter(post => post.imageUrl).map((post) => (
                  <Paper key={post.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                    {/* Same post content structure as above */}
                    {/* ... */}
                  </Paper>
                ))}
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                {[...filteredPosts].sort((a, b) => b.likes - a.likes).map((post) => (
                  <Paper key={post.id} elevation={2} sx={{ p: 2, mb: 2 }}>
                    {/* Same post content structure as above */}
                    {/* ... */}
                  </Paper>
                ))}
              </TabPanel>
            </>
          ) : (
            searchTerm && (
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary" gutterBottom>
                  No posts found with keyword "{searchTerm}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try different keywords or check the spelling
                </Typography>
              </Paper>
            )
          )}
        </Grid>

        {/* Right Sidebar - Related Topics */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Related Topics
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {relatedTopics.map((topic) => (
                <Chip
                  key={topic}
                  label={topic}
                  size="small"
                  onClick={() => {
                    setSearchTerm(topic);
                    router.push(`/search?keyword=${encodeURIComponent(topic)}`);
                  }}
                />
              ))}
            </Stack>
          </Paper>

          {searchTerm && (
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Search Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Use specific keywords for better results
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Try related topics shown above
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                • Use filters to narrow down results
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}