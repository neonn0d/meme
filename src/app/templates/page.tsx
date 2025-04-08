"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
} from "lucide-react";
import { templates, Template } from "../../data/templates";

export default function TemplatesPage() {
  const { userId } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Back Button */}
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Page Title */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200 mb-5">
          <h1 className="text-3xl font-bold text-zinc-900">Choose a Template</h1>
          <p className="mt-2 text-lg text-zinc-600">
            Select a template to start customizing your meme token website.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Existing Templates */}
          {templates.map((template: Template) => (
            <div
              key={template.id}
              className="group relative rounded-xl shadow-sm border border-zinc-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden bg-white"
            >
              {/* Image Preview Section */}
              {template.image ? (
                <div className="relative w-full h-96 overflow-hidden">
                  <Image
                    src={template.image}
                    alt={`${template.name} Template`}
                    fill
                    className="object-cover object-top group-hover:animate-scroll-y"
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="relative w-full h-96 overflow-hidden bg-zinc-100 flex items-center justify-center">
                  <span className="text-xl font-medium text-zinc-400">Coming Soon</span>
                </div>
              )}

              {/* Button Only - No Title */}
              <div className="p-4 text-center">
                {template.name === "Coming Soon" ? (
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <Link
                    href={`/customize?template=${template.id}${
                      userId ? "" : "&demo=true"
                    }`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                  >
                    Use Template
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
