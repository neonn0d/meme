"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowLeft,
  Rocket,
  Star,
  Clock,
  Code2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function TemplatesPage() {
  const { userId } = useAuth();

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
          <h1 className="text-3xl font-bold text-zinc-900">
            Choose Your Template
          </h1>
          <p className="mt-2 text-zinc-600">
            Select from our professionally designed templates to create your
            memecoin website.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Modern Template */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="mb-4">
              <Star className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              Modern Template
            </h2>
            <p className="mb-6 flex-grow text-zinc-600">
              Professional landing page focused on presenting your token's value
              proposition.
            </p>
            <div className="space-y-4">
              <ul className="text-sm space-y-3 text-zinc-600 mb-6">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Hero section with token overview
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Tokenomics breakdown section
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Roadmap presentation
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Team & partners showcase
                </li>
              </ul>
              <Link
                href="/customize?template=modern"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
              >
                Customize Template
              </Link>
            </div>
          </div>

          {/* Rocket Template */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="mb-4">
              <Rocket className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              Rocket Template
            </h2>
            <p className="mb-6 flex-grow text-zinc-600">
              Space-themed design perfect for moon-bound tokens with a focus on
              community growth.
            </p>
            <div className="space-y-4">
              <ul className="text-sm space-y-3 text-zinc-600 mb-6">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Dynamic token statistics
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Community milestones section
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Exchange listings showcase
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Integrated social media feeds
                </li>
              </ul>
              <Link
                href="/customize?template=rocket"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
              >
                Customize Template
              </Link>
            </div>
          </div>

          {/* Cosmic Template */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="mb-4">
              <Sparkles className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              Cosmic Template
            </h2>
            <p className="mb-6 flex-grow text-zinc-600">
              A cosmic-themed design with stunning space visuals and modern animations for an immersive experience.
            </p>
            <div className="space-y-4">
              <ul className="text-sm space-y-3 text-zinc-600 mb-6">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Cosmic particle animations
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Space-themed visuals
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Interactive star charts
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Galaxy gradient effects
                </li>
              </ul>
              <Link
                href="/customize?template=cosmic"
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
              >
                Customize Template
              </Link>
            </div>
          </div>

          {/* Coming Soon Template */}
          {/* <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div className="mb-4">
              <Clock className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              Coming Soon
            </h2>
            <p className="mb-6 flex-grow text-zinc-600">
              New templates are being developed to provide even more options for
              your memecoin website.
            </p>
            <div className="space-y-4">
              <ul className="text-sm space-y-3 text-zinc-600 mb-6">
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  DeFi-focused template
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Gaming theme template
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Community-driven design
                </li>
                <li className="flex items-start">
                  <span className="text-zinc-400 mr-2">•</span>
                  Advanced features
                </li>
              </ul>
              <button
                className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-100 text-zinc-400 cursor-not-allowed"
                disabled
              >
                Coming Soon
              </button>
            </div>
          </div> */}
        </div>

        {/* Custom Development Section */}
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
