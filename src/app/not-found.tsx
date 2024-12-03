import Link from "next/link";
import { Home, Coins } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* 404 with animated gradient */}
          <div className="relative">
            <h1 className="text-[8rem] sm:text-[10rem] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 via-zinc-500 to-zinc-800 animate-gradient">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Main content */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Wen Page?
            </h2>
            <p className="text-zinc-600 max-w-md">
              Looks like this page pulled a rugpull. Don't worry anon, 
              our diamond hands will guide you back to safety.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 w-full max-w-xs">
            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-900">404</div>
              <div className="text-sm text-zinc-500">Error</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-zinc-900">∞</div>
              <div className="text-sm text-zinc-500">Pages Found</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <Link 
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white px-5 py-2.5 rounded-xl hover:from-zinc-800 hover:to-zinc-700 transition-all duration-200 font-medium shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Take Me Home</span>
            </Link>
            <Link 
              href="/templates"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-zinc-100 to-zinc-50 text-zinc-900 px-5 py-2.5 rounded-xl hover:from-zinc-50 hover:to-white transition-all duration-200 font-medium border border-zinc-200"
            >
              <Coins className="w-4 h-4" />
              <span>Start Building</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
