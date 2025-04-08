"use client"

import Hero from "@/components/Hero"
import Features from "@/components/Features"
import CTA from "@/components/CTA"
import BuidlToken from "@/components/BuidlToken"
import FAQ from "@/components/FAQ"
import Partners from "@/components/Partners"
import TemplateGrid from "@/components/templategrid"
import TelegramMarketing from "@/components/TelegramMarketing"

export default function Home() {
  return (
    <div className="min-h-screen bg-white md:pt-20">
      <main>
        <Hero />
        <Features />
        <TemplateGrid />
        <FAQ />
        <TelegramMarketing />
        <BuidlToken />
        <Partners />
        <CTA />
      </main>
    </div>
  )
}
