"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { useState } from "react"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

interface NavbarProps {
  children?: React.ReactNode
  className?: string
}

export function Navbar({ children, className = "" }: NavbarProps) {
  const { isSignedIn, isLoaded } = useUser()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActivePath = (path: string) => {
    return pathname === path
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/templates", label: "Templates" },
    { href: "/pricing", label: "Pricing" },
  ]

  return (
    <nav
      className={`fixed w-full bg-white shadow-sm border-b border-zinc-200 z-50 ${className}`}
    >
      <div
        className={`mx-auto transition-[max-width] duration-200  ${
          pathname === "/customize" ? "max-w-full" : "max-w-7xl"
        } px-4 sm:px-8 lg:px-8`}
      >
        <div className="flex h-16 justify-between items-center">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-zinc-900 hover:text-zinc-700 transition-colors"
            >
              BUIDL
            </Link>
          </div>
          
          {/* Mobile menu button and user avatar */}
          <div className="flex items-center gap-2">
            {isSignedIn && (
              <div className="md:hidden">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            )}
            <div className="flex md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            {!isLoaded ? (
              // Skeleton loading state
              <>
                <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-zinc-200 rounded-full animate-pulse"></div>
              </>
            ) : isSignedIn ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActivePath(link.href)
                        ? "text-zinc-900"
                        : "text-zinc-600 hover:text-zinc-900"
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
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-zinc-200">
              {isSignedIn ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActivePath(link.href)
                          ? "text-zinc-900 bg-zinc-50"
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  <Link
                    href="/docs"
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActivePath("/docs")
                        ? "text-zinc-900 bg-zinc-50"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Docs
                  </Link>
                  <Link
                    href="/signin"
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-zinc-900 text-white hover:bg-zinc-800`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
