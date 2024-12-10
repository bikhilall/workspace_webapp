'use client';

import { useState, useRef } from 'react';
import { firestoreUtils } from '@/app/firebase/utils/firestore';
import { storageUtils } from '@/app/firebase/utils/storage';
import { auth } from '@/app/firebase/config';
import {
  Paper,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  CardMedia,
  CircularProgress,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import ClearIcon from '@mui/icons-material/Clear';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function PostForm({ onPostCreated }: { onPostCreated?: () => void }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = '';
      if (selectedImage) {
        const timestamp = Date.now();
        const fileExtension = selectedImage.name.split('.').pop();
        const imagePath = `posts/${auth.currentUser.uid}/${timestamp}.${fileExtension}`;
        
        try {
          const uploadResult = await storageUtils.uploadFile(imagePath, selectedImage);
          imageUrl = uploadResult.downloadURL;
        } catch (err: any) {
          throw new Error('Failed to upload image: ' + err.message);
        }
      }

      const postId = Date.now().toString();
      const postData = {
        id: postId,
        content: content.trim(),
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
        likes: 0,
        ...(imageUrl && { imageUrl }),
      };

      await firestoreUtils.createDocument('posts', postId, postData);
      
      setContent('');
      clearImage();
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          sx={{ mb: 2 }}
        />

        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <CardMedia
              component="img"
              image={imagePreview}
              alt="Selected image"
              sx={{ 
                borderRadius: 1,
                maxHeight: '200px',
                width: '100%',
                objectFit: 'contain',
                bgcolor: 'background.paper'
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' },
              }}
              onClick={clearImage}
              disabled={isSubmitting}
            >
              <ClearIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input
            type="file"
            accept={ALLOWED_FILE_TYPES.join(',')}
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageSelect}
            disabled={isSubmitting}
          />
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            color="primary"
          >
            <ImageIcon />
          </IconButton>
          <Button
            type="submit"
            variant="contained"
            disabled={!content.trim() || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}