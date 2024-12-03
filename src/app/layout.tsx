import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { ClientLayout } from '@/components/ClientLayout'
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
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}
