import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connect Your Telegram Account | BUIDL Marketing Tool',
  description: 'Connect your Telegram account to BUIDL to start sending marketing messages to multiple crypto groups. Secure login with Telegram.',
  keywords: 'telegram login, telegram marketing, connect telegram, telegram bot, crypto marketing',
  openGraph: {
    title: 'Connect Your Telegram Account | BUIDL Marketing Tool',
    description: 'Connect your Telegram account to BUIDL to start sending marketing messages to multiple crypto groups.',
    url: 'https://buidl.co.in/telegram/login',
    images: [{
      url: '/blog/ogimage.webp',
      width: 1200,
      height: 630,
      alt: 'BUIDL Telegram Marketing Tool',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connect Your Telegram Account | BUIDL Marketing Tool',
    description: 'Connect your Telegram account to BUIDL to start sending marketing messages to multiple crypto groups.',
    images: ['/blog/ogimage.webp'],
  },
};
