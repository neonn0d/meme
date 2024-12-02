"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Code2,
  ExternalLink,
  Rocket,
  Search,
  Shield,
  Zap,
} from "lucide-react"

interface AboutSection {
  title: string
  content: string
  subsections?: { title: string; content: string }[]
}

const aboutSections: AboutSection[] = [
  {
    title: "Our Mission",
    content:
      "BUIDL simplifies the memecoin website creation process by generating beautiful, professional website files that help projects establish credibility and trust in the Solana ecosystem.",
    subsections: [
      {
        title: "Vision",
        content:
          "To become the go-to platform for memecoin creators, enabling them to generate professional website files within minutes with zero technical knowledge required.",
      },
      {
        title: "Values",
        content:
          "• Simplicity: Making website creation accessible to everyone\n• Speed: Instant website generation\n• Quality: Professional-grade templates\n• Community: Supporting the growth of the Solana ecosystem",
      },
    ],
  },
  {
    title: "Why Choose BUIDL",
    content:
      "Our platform offers unique advantages that set us apart in the memecoin space:",
    subsections: [
      {
        title: "Professional Templates",
        content:
          "• Modern and eye-catching designs\n• Mobile-responsive layouts\n• Multiple template options\n• Clean and professional look\n• Optimized for memecoin projects",
      },
      {
        title: "Easy Customization",
        content:
          "• Customize coin name and description\n• Set token details and contract address\n• Choose from beautiful color combinations\n• Add your logo and branding\n• Configure buy links and social media",
      },
      {
        title: "Built for Memecoins",
        content:
          "• Detailed tokenomics section (supply, taxes, LP lock)\n• Team member profiles\n• Interactive roadmap timeline\n• FAQ section\n• Social links and community section",
      },
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Back Button */}
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <h1 className="text-3xl font-bold text-zinc-900">About BUIDL</h1>
          <p className="mt-2 text-zinc-600">
            The fastest way to create your memecoin website
          </p>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">
                  Quick Generation
                </h3>
                <p className="text-sm text-zinc-600">
                  Website files in minutes
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">No Code Needed</h3>
                <p className="text-sm text-zinc-600">Simple customization</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Memecoin Ready</h3>
                <p className="text-sm text-zinc-600">Built for your token</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Search className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">SEO Optimized</h3>
                <p className="text-sm text-zinc-600">Built for visibility</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Sections */}
        <div className="space-y-8">
          {aboutSections.map((section, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200"
            >
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                {section.title}
              </h2>
              <p className="text-zinc-600 whitespace-pre-line mb-6">
                {section.content}
              </p>

              {section.subsections?.map((subsection, subIndex) => (
                <div key={subIndex} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                    {subsection.title}
                  </h3>
                  <p className="text-zinc-600 whitespace-pre-line">
                    {subsection.content}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
