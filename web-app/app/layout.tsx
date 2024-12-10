'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { FirebaseProvider } from './providers/firebase-provider';
import { AuthProvider } from './providers/auth-provider';
import NavigationBar from './components/navigation/NavigationBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <FirebaseProvider>
            <AuthProvider>
              <NavigationBar />
              <main>{children}</main>
            </AuthProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}