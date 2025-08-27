import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'FormCraft AI - AI-Powered Form Builder',
  description: 'Create beautiful, intelligent forms in seconds with AI. Transform your ideas into stunning, professional forms with natural language.',
  keywords: 'form builder, AI forms, survey creator, feedback forms, online forms',
  authors: [{ name: 'FormCraft AI' }],
  creator: 'FormCraft AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://formcraft-ai.vercel.app',
    title: 'FormCraft AI - AI-Powered Form Builder',
    description: 'Create beautiful, intelligent forms in seconds with AI',
    siteName: 'FormCraft AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormCraft AI - AI-Powered Form Builder',
    description: 'Create beautiful, intelligent forms in seconds with AI',
    creator: '@formcraftai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
