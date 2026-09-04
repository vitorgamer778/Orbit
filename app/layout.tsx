import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './auth-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://orbit-project-ops.vercel.app',
  ),
  alternates: { canonical: '/' },
  title: 'Orbit — Project operations, in flow',
  description:
    'A focused project management workspace for teams that move fast.',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Orbit',
    title: 'Orbit — Project operations, in flow',
    description:
      'A focused project management workspace for teams that move fast.',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbit — Project operations, in flow',
    description:
      'A focused project management workspace for teams that move fast.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
