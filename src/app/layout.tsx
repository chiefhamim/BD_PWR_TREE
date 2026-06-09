import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Bangladesh Power Sector Interactive Dashboard',
  description:
    'Real-time hierarchy tree visualization of the Bangladesh national power sector infrastructure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
