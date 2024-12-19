"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Partners() {
  return (
    <section className="py-12 border-t border-zinc-200 space-y-5">
      <h2 className="text-3xl font-bold text-center mb-8">Our Partners</h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="https://xol.wtf"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="bg-[#161517] rounded-2xl overflow-hidden relative h-64 md:h-56">
            <img
              src="/partners/xol.png"
              alt="XOL"
              className="absolute right-0 top-0 h-full w-auto hidden md:block"
            />
            <img
              src="/partners/xol.png"
              alt="XOL"
              className="absolute right-0 top-0 h-full w-auto md:hidden"
            />
            <div className="absolute inset-0 w-full md:w-2/3 p-6 md:p-8 bg-gradient-to-r from-[#161517] via-[#161517] to-transparent">
             <div className="flex flex-col h-full justify-between">

              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-2xl font-bold text-white">XOL.WTF</h3>
              </div>
              <p className="text-base md:text-xl md:text-zinc-400  text-zinc-50 leading-relaxed">
                Create your meme coin website that lives forever on the Solana
                blockchain
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white group-hover:bg-zinc-200 w-max rounded-full px-4 py-2 text-black font-medium group-hover:text-zinc-700 transition-colors duration-200">
                Mint Your Website On-Chain <ArrowUpRight className="w-4 h-4" />
              </div>
             </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
