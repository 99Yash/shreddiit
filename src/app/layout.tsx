import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { siteConfig } from '../siteConfig';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'TypeScript',
    'App Router',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Server Actions',
    'Shadcn/UI',
  ],
  authors: [
    {
      name: 'Yash Gourav Kar',
      url: 'https://github.com/99Yash',
    },
  ],
  creator: '99Yash',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    // url: 'https://shredit.vercel.app/',
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
  },
};

const inter = Inter({
  subsets: ['latin'],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <ClerkProvider>
        <html
          lang="en"
          className={cn(
            'bg-slate-100 text-slate-900 antialiased light',
            inter.className
          )}
        >
          <body
            suppressHydrationWarning
            className="min-h-screen pt-12 bg-slate-50 antialiased"
          >
            <Navbar />
            <div className="container max-w-7xl mx-auto h-full pt-12">
              {children}
            </div>
            <Toaster />
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
