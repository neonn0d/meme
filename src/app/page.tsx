'use client';

import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import BuidlToken from "@/components/BuidlToken";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        <Features />
        <CTA />
        <BuidlToken />
      </main>
    </div>
  );
}