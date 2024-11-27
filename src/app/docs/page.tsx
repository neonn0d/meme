"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  ExternalLink,
} from "lucide-react";

interface DocSection {
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
  code?: string;
}

const documentation: DocSection[] = [
  {
    title: "Getting Started",
    content:
      "Our platform offers two professionally designed templates to kickstart your memecoin website. Follow these steps to get started:",
    subsections: [
      {
        title: "Choose a Template",
        content:
          "• Modern Template: Professional landing page with token overview, tokenomics, and team sections\n• Rocket Template: Space-themed design with dynamic statistics and community features",
      },
      {
        title: "Customization Process",
        content:
          '1. Select your preferred template\n2. Click "Customize Template"\n3. Modify content and styling\n4. Preview changes in real-time\n5. Deploy when ready',
      },
    ],
  },
  {
    title: "Template Features",
    content:
      "Each template comes with a comprehensive set of features designed for memecoin projects:",
    subsections: [
      {
        title: "Modern Template",
        content:
          "• Hero section with token overview\n• Tokenomics breakdown section\n• Interactive roadmap presentation\n• Team & partners showcase\n• Mobile-responsive design",
      },
      {
        title: "Rocket Template",
        content:
          "• Dynamic token statistics display\n• Community milestones section\n• Exchange listings showcase\n• Integrated social media feeds\n• Space-themed animations",
      },
    ],
  },
  {
    title: "Customization",
    content: "Customize your website using our intuitive configuration system:",
    code: `{
  "website": {
    "name": "Your Coin Name",
    "symbol": "SYMBOL",
    "description": "Your coin description",
    "links": {
      "telegram": "https://t.me/yourcoin",
      "twitter": "https://twitter.com/yourcoin",
      "chart": "https://dextools.io/...",
      "contract": "0x..."
    },
    "tokenomics": {
      "totalSupply": "1,000,000,000",
      "taxBuy": "0%",
      "taxSell": "0%"
    }
  }
}`,
  },
  {
    title: "Best Practices",
    content: "Follow these guidelines for the best results:",
    subsections: [
      {
        title: "Content Guidelines",
        content:
          "• Keep descriptions clear and concise\n• Use professional imagery\n• Provide accurate tokenomics information\n• Include all relevant social links\n• Maintain transparency with your community",
      },
      {
        title: "Technical Optimization",
        content:
          "• Test your website on multiple devices\n• Optimize images for fast loading\n• Verify all links are working\n• Keep contract information up to date\n• Regular content updates",
      },
    ],
  },
];

export default function DocsPage() {
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
          <h1 className="text-3xl font-bold text-zinc-900">Documentation</h1>
          <p className="mt-2 text-zinc-600">
            Learn how to create and customize your memecoin website
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-8">
          {documentation.map((section, index) => (
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

              {section.code && (
                <pre className="bg-zinc-50 p-4 rounded-lg overflow-x-auto border border-zinc-200">
                  <code className="text-sm text-zinc-800">{section.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <div className="flex items-start gap-8">
            <div className="p-4 rounded-xl bg-white shadow-sm border border-zinc-200">
              <Code2 className="w-8 h-8 text-zinc-800" />
            </div>
            <div className="space-y-6 flex-1">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Need Custom Development?
                </h2>
                <p className="text-zinc-600 leading-relaxed max-w-2xl">
                  Looking for a unique web3 solution? Our experienced team can help bring your vision to life, 
                  whether it's a DeFi dashboard, NFT platform, or any other blockchain project.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://x.com/b0tstepfather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors font-medium"
                >
                  Contact Developer
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
