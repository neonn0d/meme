'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

interface NavbarProps {
  children?: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/templates', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/docs', label: 'Docs' },
  ];

  return (
    <nav className="fixed w-full bg-white shadow-sm border-b border-zinc-200 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-zinc-900 hover:text-zinc-700 transition-colors">
            MemeGen
            </Link>
          </div>
          <div className="flex items-center gap-6">
            {isSignedIn ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActivePath(link.href)
                        ? 'text-zinc-900'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {children}
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <Link
                  href="/docs"
                  className={`text-sm font-medium transition-colors ${
                    isActivePath('/docs')
                      ? 'text-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Docs
                </Link>
                <SignInButton mode="modal">
                  <button className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
