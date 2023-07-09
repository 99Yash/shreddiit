import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { siteConfig } from '../siteConfig';

export const metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.authorName,
      url: siteConfig.authorGithub,
    },
  ],
  creator: '99Yash',
  icons: [
    {
      url: '../../public/favicon.ico',
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.siteUrl,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: '../../public/favicon.ico',
        width: 512,
        height: 512,
        alt: siteConfig.title,
      },
    ],
  },
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
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
            'bg-slate-100 tracking-tight text-slate-900 antialiased light',
            inter.className
          )}
        >
          <body
            className="min-h-screen pt-12 bg-slate-50 antialiased"
            suppressHydrationWarning
          >
            <Providers>
              <Navbar />
              <div className="container max-w-7xl mx-auto h-full pt-12">
                {children}
              </div>
              <Toaster />
            </Providers>
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
