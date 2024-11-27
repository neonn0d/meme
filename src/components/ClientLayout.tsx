'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SolanaProvider } from './SolanaProvider';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isPreviewPage = pathname === '/preview';

  return (
    <SolanaProvider>
      {!isPreviewPage && <Navbar />}
      <main className={!isPreviewPage ? "min-h-[calc(100vh-64px-56px)] pt-16" : "min-h-screen"}>
        {children}
      </main>
      {!isPreviewPage && <Footer />}
    </SolanaProvider>
  );
}
