'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Partners() {
  return (
    <section className="py-12 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="https://trusteeglobal.eu/?r=4CXbx0zQPGb"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="bg-[#161517] rounded-2xl overflow-hidden relative h-64 md:h-56">
            <img
              src="/trustee.png"
              alt="Trustee Plus"
              className="absolute right-0 top-0 h-full w-auto hidden md:block"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <img
              src="/trustee-card.png"
              alt="Trustee Plus Card"
              className="absolute right-0 top-0 h-full w-auto md:hidden"
              style={{ imageRendering: 'crisp-edges' }}
            />
            <div className="absolute inset-0 w-full md:w-2/3 p-6 md:p-8 bg-gradient-to-r from-[#161517] via-[#161517] to-transparent">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-2xl font-bold text-white">
                  Trustee Plus
                </h3>
              </div>
              <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
                Get your virtual and physical crypto card with zero fees. Spend crypto worldwide and enjoy unlimited cashback rewards.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-white font-medium group-hover:text-zinc-200 transition-colors duration-200">
                Get your crypto card
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
