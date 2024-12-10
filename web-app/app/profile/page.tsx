'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../providers/auth-provider';
import { authUtils } from '../firebase/utils/auth';
import { storageUtils } from '../firebase/utils/storage';
import { firestoreUtils } from '../firebase/utils/firestore';
import UserPosts from '../components/posts/UserPosts';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PostAddIcon from '@mui/icons-material/PostAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  bio?: string;
  joinDate?: string;
  totalPosts?: number;
  totalLikes?: number;
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
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        // Get additional user data from Firestore
        const userData = await firestoreUtils.getDocument('users', user.uid);
        
        setProfile({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          bio: userData?.bio || '',
          joinDate: user.metadata.creationTime || '',
          totalPosts: userData?.totalPosts || 0,
          totalLikes: userData?.totalLikes || 0,
        });

        setFormData({
          displayName: user.displayName || '',
          bio: userData?.bio || ''
        });
      } catch (err: any) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    setError('');
    
    try {
      const photoPath = `profile-photos/${user.uid}/${file.name}`;
      await storageUtils.uploadFile(photoPath, file);
      const photoURL = await storageUtils.getFileURL(photoPath);
      
      await Promise.all([
        // Update auth profile
        authUtils.getCurrentUser()?.updateProfile({ photoURL }),
        // Update Firestore profile
        firestoreUtils.updateDocument('users', user.uid, { photoURL })
      ]);

      setProfile(prev => prev ? { ...prev, photoURL } : null);
      setSuccess('Profile photo updated successfully');
    } catch (err: any) {
      setError('Failed to update profile photo');
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setSuccess('');
    
    try {
      await Promise.all([
        // Update auth profile
        authUtils.getCurrentUser()?.updateProfile({ displayName: formData.displayName }),
        // Update Firestore profile
        firestoreUtils.updateDocument('users', user.uid, {
          displayName: formData.displayName,
          bio: formData.bio
        })
      ]);

      setProfile(prev => prev ? {
        ...prev,
        displayName: formData.displayName,
        bio: formData.bio
      } : null);
      
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err: any) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePostDeleted = async () => {
    if (!user) return;
    
    try {
      const userData = await firestoreUtils.getDocument('users', user.uid);
      setProfile(prev => prev ? {
        ...prev,
        totalPosts: userData?.totalPosts || 0,
        totalLikes: userData?.totalLikes || 0,
      } : null);
    } catch (err) {
      console.error('Failed to update profile stats:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile.photoURL}
              alt={profile.displayName}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <input
              accept="image/*"
              type="file"
              id="photo-upload"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="photo-upload">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: -10,
                  bgcolor: 'background.paper'
                }}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? <CircularProgress size={24} /> : <PhotoCamera />}
              </IconButton>
            </label>
          </Box>

          {editMode ? (
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
              <TextField
                fullWidth
                label="Display Name"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                margin="normal"
                multiline
                rows={4}
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" type="submit">
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                {profile.displayName}
              </Typography>
              {profile.bio && (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  {profile.bio}
                </Typography>
              )}
              <Button variant="outlined" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box>
          <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
            <Tab label="Profile Info" />
            <Tab label="Posts" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon color="action" />
                    <Typography>{profile.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="action" />
                    <Typography>{profile.displayName}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon color="action" />
                    <Typography>
                      Joined {new Date(profile.joinDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Activity Statistics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PostAddIcon color="action" />
                    <Typography>{profile.totalPosts} Posts</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteIcon color="action" />
                    <Typography>{profile.totalLikes} Likes Received</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {user && <UserPosts userId={user.uid} onPostDeleted={handlePostDeleted} />}
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}