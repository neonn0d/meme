import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ClientLayout } from "@/components/ClientLayout";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BUIDL - Memecoin Website Generator",
  description: "Create your own customized memecoin website in minutes with BUIDL",
  keywords: ["memecoin", "cryptocurrency", "website generator", "crypto", "blockchain", "web3"],
  openGraph: {
    title: "BUIDL - Memecoin Website Generator",
    description: "Create your own customized memecoin website in minutes with BUIDL",
    type: "website",
    locale: "en_US",
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
    title: "BUIDL - Memecoin Website Generator",
    description: "Create your own customized memecoin website in minutes with BUIDL",
    images: ["https://www.buidl.co.in/og-image.png"],
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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClientLayout>
            {children}
            <Analytics />
            <SpeedInsights />
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
