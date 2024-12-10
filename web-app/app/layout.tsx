import './globals.css'
import { AuthProvider } from './providers/auth-provider'
import TopBar from './components/layout/TopBar'

export const metadata = {
  title: 'My App',
  description: 'A Next.js app with Firebase integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TopBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}