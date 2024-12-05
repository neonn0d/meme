import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { ClientLayout } from '@/components/ClientLayout'
import { Analytics } from "@vercel/analytics/react"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = { 
  title: 'BUIDL - Memecoin Website Generator',
  description: 'Create your own customized memecoin website in minutes with BUIDL',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClientLayout>
            {children}
            <Analytics />
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}
