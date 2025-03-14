"use client"

import Link from "next/link"
import { useUser } from "@clerk/nextjs"

interface MiniNavProps {
  className?: string
}

export function MiniNav({ className = "" }: MiniNavProps) {
  const { isSignedIn } = useUser()

  return (
    <div className={`flex items-center space-x-3 ${className}`} style={{ maxWidth: "440px" }}>
      <Link
        href="/"
        className="text-lg font-bold text-zinc-900 hover:text-zinc-700 transition-colors"
      >
        BUIDL
      </Link>
      
      <span className="text-zinc-400">/</span>
      {isSignedIn && (
        <Link
          href="/dashboard"
          className="ml-auto text-xs text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          Dashboard
        </Link>
      )}
    </div>
  )
}
