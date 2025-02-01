"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  return (
    <footer className="bg-white border-t border-zinc-200">
      <div
        className={`mx-auto transition-[max-width] duration-200  ${
          pathname === "/customize" ? "max-w-full" : "max-w-7xl"
        } py-12 px-4 sm:px-8 lg:px-8`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Company Info */}
          <div className="md:col-span-5 order-1 space-y-4">
            <h3 className="text-xl font-bold text-zinc-900">BUIDL</h3>
            <p className="text-sm leading-relaxed text-zinc-600 max-w-md">
              Generate professional memecoin websites quickly and effortlessly.
              <br />
              Join thousands of creators building the future of memecoins.
            </p>
            <div className="inline-flex items-center rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-800">
              Powered by
              <Image
                src="/solana.svg"
                alt="Solana Logo"
                width={15}
                height={15}
                className="ml-1.5"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="md:col-span-4 order-2">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="https://buidl.openstatus.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  Status
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
              <Link
                  href="/blog"
                  className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div className="md:col-span-3 order-3 md:justify-self-end">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/buidlcoin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
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
                className="text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
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
                className="text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
              >
                <span className="sr-only">Telegram</span>
                <svg
                  className="h-5 w-5 mt-[0.05rem]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.12.13.145.309.164.472-.001.089.016.181.003.288z" />
                </svg>
              </a>
              <a
                href="https://buidlcoin.medium.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
              >
                <span className="sr-only">Medium</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z" />
                </svg>
              </a>
            </div>
            <div className="mt-10">
              <a
                href="https://www.producthunt.com/posts/buidl-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-buidl&#0045;2"
                target="_blank"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=702734&theme=dark"
                  alt="BUIDL - Memecoin&#0032;website&#0032;generator | Product Hunt"
                  className="w-[250px] h-[54px]"
                  width="250"
                  height="54"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 pt-4 border-t border-zinc-200">
          <div className="flex justify-between items-center">
            <p className="text-xs text-zinc-500">
              2025 BUIDL. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-xs text-zinc-500 hover:text-zinc-900"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-zinc-500 hover:text-zinc-900"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
