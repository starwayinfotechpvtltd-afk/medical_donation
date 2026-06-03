import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mefigurefoundation.com'),
  title: {
    default: 'Mefigure Siddhi Vadanta Foundation Hospital',
    template: '%s | MeFigure Foundation',
  },
  description: 'Official website of Mefigure Siddhi Vadanta Foundation Hospital. Empowering lives through healthcare, support, and community initiatives.',
  applicationName: 'MeFigure Foundation',
  keywords: ['MeFigure Foundation', 'Mefigure Siddhi Vadanta Foundation Hospital', 'Healthcare', 'NGO', 'Support', 'Community'],
  
  icons: {
    icon: [
      { url: '/mefigurelogo.png' },
      { url: '/mefigurelogo.pngicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/mefigurelogo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/mefigurelogo.png',
  },

  openGraph: {
    title: 'Mefigure Siddhi Vadanta Foundation Hospital',
    description: 'Empowering lives through healthcare and community support.',
    url: 'https://mefigurefoundation.com',
    siteName: 'Mefigure Siddhi Vadanta Foundation',
    images: [
      {
        url: '/mefigurelogo.png',
        width: 1200,
        height: 630,
        alt: 'Mefigure Siddhi Vadanta Foundation',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Mefigure Siddhi Vadanta Foundation Hospital',
    description: 'Empowering lives through healthcare and community support.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${_geist.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}