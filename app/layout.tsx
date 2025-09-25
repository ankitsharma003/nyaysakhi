// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'
import { LanguageProvider } from '@/lib/language-context'
import { ChatbotProvider } from '@/lib/chatbot-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { AuthLoadingWrapper } from '@/components/auth-loading-wrapper'
import { ChatbotWrapper } from '@/components/chatbot-wrapper'
// import SiteHeader from '@/components/site-header';
import ClientLangManager from '@/components/client-lang-manager'

const inter = Inter({ subsets: ['latin'] })

// CSS variable to mark a Hindi font — you can use it in your CSS to apply font-family.
const hindiFontFallback = {
  variable: '--font-hindi',
}

export const metadata: Metadata = {
  title: 'Nyāy Sakhi - AI-Powered Legal Assistant',
  description:
    'Upload your legal documents, get instant analysis, and connect with verified lawyers in your area.',
  keywords: [
    'legal tech',
    'AI',
    'document analysis',
    'lawyer matching',
    'India',
    'constitution',
  ],
  authors: [{ name: 'Nyāy Sakhi Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${hindiFontFallback.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Default server-loaded font: Latin Inter */}
        {/* Noto Devanagari font will be loaded on demand by ClientLangManager when Hindi is active */}
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <ErrorBoundary>
          <LanguageProvider>
            <AuthProvider>
              <ChatbotProvider>
                <AuthLoadingWrapper>
                  {/* <SiteHeader /> */}
                  {children}
                  <ChatbotWrapper />
                  {/* Client-side manager will update document.lang and load Devanagari font if needed */}
                  <ClientLangManager />
                </AuthLoadingWrapper>
              </ChatbotProvider>
            </AuthProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
