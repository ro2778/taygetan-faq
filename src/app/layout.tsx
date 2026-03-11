import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cosmic Agency FAQ — Knowledge From The Stars',
  description:
    'A searchable knowledge base of answers drawn from 834 Cosmic Agency transcripts covering extraterrestrial contact, consciousness, timelines, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  );
}
