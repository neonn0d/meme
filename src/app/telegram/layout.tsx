import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Telegram Marketing Tool | Send Messages to Multiple Groups | BUIDL',
  description: 'Automate your Telegram marketing with BUIDL. Send messages to multiple crypto groups with customizable delays to avoid bans. Free and premium plans available.',
  keywords: 'telegram marketing, telegram bot, crypto marketing, telegram groups, telegram shilling, memecoin promotion',
  openGraph: {
    title: 'Telegram Marketing Tool | Send Messages to Multiple Groups | BUIDL',
    description: 'Automate your Telegram marketing with BUIDL. Send messages to multiple crypto groups with customizable delays to avoid bans.',
    url: 'https://buidl.co.in/telegram',
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
    title: 'Telegram Marketing Tool | Send Messages to Multiple Groups',
    description: 'Automate your Telegram marketing with BUIDL. Send messages to multiple crypto groups with customizable delays.',
    images: ['/blog/ogimage.webp'],
  },
};

export default function TelegramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>{children}</div>
  );
}
