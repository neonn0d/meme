"use client";

import Link from "next/link";
import Image from "next/image";
import { templates, Template } from "../data/templates";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-900">
            Choose a Template
          </h2>
          <p className="mt-4 text-lg text-zinc-600 max-w-xl mx-auto">
            Select a template to start customizing your meme token website.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Existing Templates */}
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-xl shadow-sm border border-zinc-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden bg-white"
            >
              {/* Image Preview Section */}
              <div className="relative w-full h-96 overflow-hidden">
                <Image
                  src={template.image || "/og-image.png"}
                  alt={`${template.name} Template`}
                  fill
                  className="object-cover object-top group-hover:animate-scroll-y"
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Button Only - No Title */}
              <div className="p-4 text-center">
                <Link
                  href={`/customize?template=${template.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}

          {/* Coming Soon Placeholder */}
          <div className="group relative rounded-xl shadow-sm border border-zinc-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden bg-white">
            {/* Empty Image Container */}
            <div className="relative w-full h-96 overflow-hidden bg-zinc-100 flex items-center justify-center">
              <span className="text-xl font-medium text-zinc-400">Coming Soon</span>
            </div>

            {/* Disabled Button */}
            <div className="p-4 text-center">
              <button
                disabled
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-200 text-zinc-400 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
