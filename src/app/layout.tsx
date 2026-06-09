import type { Metadata } from 'next';
import './globals.css';

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
      <body className="overflow-hidden">{children}</body>
    </html>
  );
}
