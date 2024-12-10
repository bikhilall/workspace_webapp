'use client';

import { Inter } from 'next/font/google';
import { AuthProvider } from './providers/auth-provider';
import { FirebaseProvider } from './providers/firebase-provider';
import NavigationBar from './components/navigation/NavigationBar';
import Footer from './components/navigation/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <NavigationBar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}