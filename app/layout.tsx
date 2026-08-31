import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

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
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: 'Orbit — Project operations, in flow',
  description: 'A focused project management workspace for teams that move fast.',
  openGraph: {
    title: 'Orbit — Project operations, in flow',
    description: 'A focused project management workspace for teams that move fast.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbit — Project operations, in flow',
    description: 'A focused project management workspace for teams that move fast.',
    images: ['/og.png'],
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
        {children}
      </body>
    </html>
  );
}
