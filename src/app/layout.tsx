import type { Metadata } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansBengali = Noto_Sans_Bengali({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['bengali'], 
  variable: '--font-noto-bengali' 
});

export const metadata: Metadata = {
  title: 'Bangladesh Power Sector Dashboard',
  description:
    'Real-time hierarchy tree visualization of the Bangladesh national power sector infrastructure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansBengali.variable}`}>
      <body className="overflow-hidden font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
