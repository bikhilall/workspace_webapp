'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../providers/auth-provider';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import { authUtils } from '../../firebase/utils/auth';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';

export default function NavigationBar() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authUtils.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  const handleProfileClick = () => {
    router.push('/profile');
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        {/* Brand/Logo */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <HomeIcon /> Social App
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, ml: 4 }}>
          <Button
            color="inherit"
            startIcon={<SearchIcon />}
            onClick={() => router.push('/search')}
          >
            Search
          </Button>
        </Box>

        {/* User Profile Section */}
        {user ? (
          <>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                src={user.photoURL || undefined}
                alt={user.displayName || 'User'}
                sx={{ width: 32, height: 32 }}
              >
                {user.displayName?.[0] || user.email?.[0] || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileClick}>
                <PersonIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToAppIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="inherit"
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}