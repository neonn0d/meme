"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company Info */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900">BUIDL</h3>
            <p className="text-sm text-zinc-600 max-w-xs">
              The fastest way to launch your memecoin website. Built with modern
              tech stack and Solana blockchain integration.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/templates"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="https://buidl.openstatus.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    <span className="flex items-center gap-2">

                      Status<span className="mt-1 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & Contact */}
          <div className="md:col-span-4 md:flex md:justify-end space-y-4">
            <div>
              <div className="flex justify-end">
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                  Connect
                </h3>
              </div>
              <div className="mt-4 flex space-x-4 justify-end">
                <a
                  href="https://twitter.com/buidlcoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/UHDdNH574Y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span className="sr-only">Discord</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/buidl_community"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  <span className="sr-only">Telegram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-zinc-200 text-center">
          <p className="text-sm text-zinc-500">
            {new Date().getFullYear()} BUIDL. All rights reserved.
          </p>

          <Link
            href="https://misfitsclub.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-900 transition-colors font-medium"
          >
            <span className="font-semibold tracking-wide">Misfits Club</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
