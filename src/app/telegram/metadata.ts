import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Telegram Marketing Dashboard | Send Messages to Multiple Groups | BUIDL',
  description: 'Manage your Telegram marketing campaigns with BUIDL. Send messages to multiple crypto groups, track performance, and optimize your promotions. Free and premium plans available.',
  keywords: 'telegram dashboard, telegram marketing, telegram groups, crypto promotion, telegram shilling, memecoin marketing',
  openGraph: {
    title: 'Telegram Marketing Dashboard | BUIDL',
    description: 'Manage your Telegram marketing campaigns with BUIDL. Send messages to multiple crypto groups with customizable delays to avoid bans.',
    url: 'https://buidl.co.in/telegram',
    images: [{
      url: '/blog/ogimage.webp',
      width: 1200,
      height: 630,
      alt: 'BUIDL Telegram Marketing Dashboard',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telegram Marketing Dashboard | BUIDL',
    description: 'Manage your Telegram marketing campaigns with BUIDL. Send messages to multiple crypto groups with customizable delays.',
    images: ['/blog/ogimage.webp'],
  },
};
