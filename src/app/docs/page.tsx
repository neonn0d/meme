"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Code2,
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
    content: "Create your memecoin website in minutes:",
    subsections: [
      {
        title: "Quick Start",
        content:
          '1. Browse templates\n2. Customize your content\n3. Click "Generate Website"\n4. Get your code',
      }
    ],
  },
  {
    title: "Features",
    content: "Everything you need for your memecoin website:",
    subsections: [
      {
        title: "Built-in Features",
        content:
          "• Modern, responsive design\n• Token info & stats\n• Community sections\n• Social integration\n• Instant generation",
      }
    ],
  },
  {
    title: "Best Practices",
    content: "Tips for success:",
    subsections: [
      {
        title: "Guidelines",
        content:
          "• Keep content clear and professional\n• Use high-quality images\n• Update content regularly\n• Test on all devices\n• Maintain social presence",
      }
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
      </div>
    </div>
  );
}
