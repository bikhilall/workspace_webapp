import { FirebaseProvider } from './providers/firebase-provider'
import './globals.css'

export const metadata = {
  title: 'Create Web App',
  description: 'AI Generated web app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
      </body>
    </html>
  )
}