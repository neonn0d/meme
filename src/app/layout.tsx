import React from "react";
import { Inter } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BUIDL - Memecoin Website Generator",
  description: "Create your own customized memecoin website in minutes with BUIDL",
  metadataBase: new URL('https://www.buidl.co.in'),
  icons: {
    icon: '/buidl-black.ico',
    shortcut: '/buidl-black.ico',
    apple: '/buidl-black.ico',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/buidl-black.ico',
    },
  },
  openGraph: {
    url: "https://www.buidl.co.in",
    title: "BUIDL - Memecoin Website Generator",
    description: "Create your own customized memecoin website in minutes with BUIDL",
    type: "website",
    siteName: "BUIDL",
    images: [
      {
        url: "https://www.buidl.co.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "BUIDL - Memecoin Website Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@buidlcoin",
    creator: "@buidlcoin",
    title: "BUIDL - Memecoin Website Generator",
    description: "Create your own customized memecoin website in minutes with BUIDL",
    images: {
      url: "https://www.buidl.co.in/og-image.png",
      alt: "BUIDL - Memecoin Website Generator"
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

// Import our providers
import { SolanaProvider } from '@/components/SolanaProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-J8F5NSD35N`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J8F5NSD35N');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SolanaProvider>
          <AuthProvider>
            <ClientLayout>
              {children}
              <SpeedInsights />
            </ClientLayout>
          </AuthProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
