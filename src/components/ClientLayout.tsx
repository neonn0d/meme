'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SolanaProvider } from './SolanaProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Only hide navbar and footer on preview and customize pages
  const isPreviewPage = pathname === "/preview";
  const isCustomizePage = pathname === "/customize";
  const hideNavbarAndFooter = isPreviewPage || isCustomizePage;

  return (
    <SolanaProvider>
      <AuthProvider>
        {!hideNavbarAndFooter && <Navbar />}
        <main className={!isPreviewPage ? "min-h-[calc(100vh-20rem)]" : "min-h-screen"}>
          {children}
        </main>
        {!hideNavbarAndFooter && <Footer />}
        <Toaster position="bottom-right" />
      </AuthProvider>
    </SolanaProvider>
  );
}
