"use client";

import Link from "next/link";
import Image from "next/image";

interface Template {
  id: string;
  name: string;
  description: string;
  image?: string;
  features: string[];
}

const templates: Template[] = [
  {
    id: "modern",
    name: "Modern Template",
    description:
      "Professional landing page focused on presenting your token's value proposition.",
    image: "/templates/modern.png",
    features: [
      "Hero section with token overview",
      "Tokenomics breakdown section",
      "Roadmap presentation",
      "Team & partners showcase",
    ],
  },
  {
    id: "pepe",
    name: "Pepe Template",
    description: "Modern Pepe-themed design with smooth animations.",
    image: "/templates/pepe.png",
    features: [
      "Modern, clean design",
      "Smooth animations",
      "Tokenomics section",
      "Mobile responsive",
    ],
  },
  {
    id: "rocket",
    name: "Rocket Template",
    description:
      "Space-themed design perfect for moon-bound tokens with a focus on community growth.",
    image: "/templates/rocket.png",
    features: [
      "Dynamic token statistics",
      "Community milestones section",
      "Exchange listings showcase",
      "Integrated social media feeds",
    ],
  },
  {
    id: "minimal",
    name: "Minimal Template",
    description:
      "A clean, minimalist black and white design focused on simplicity and readability.",
    image: "/templates/minimal.png",
    features: [
      "Monochromatic design",
      "Fast loading performance",
      "Responsive layout",
      "Clean typography",
    ],
  },
  {
    id: "cosmic",
    name: "Cosmic Template",
    description:
      "A cosmic-themed design with stunning space visuals and modern animations for an immersive experience.",
    image: "/templates/cosmic.png",
    features: [
      "Cosmic particle animations",
      "Space-themed visuals",
      "Interactive star charts",
      "Galaxy gradient effects",
    ],
  },
  {
    id: "playful",
    name: "Playful Template",
    description:
      "Playful, animated design with character-driven visuals and engaging animations.",
    image: "/templates/playful.png",
    features: [
      "Hero section with token overview",
      "Tokenomics breakdown section",
      "Roadmap presentation",
      "Team & partners showcase",
    ],
  },
  {
    id: "test",
    name: "Test Template",
    description:
      "A modern space-themed template with Tailwind CSS and smooth animations for a professional look.",
    image: "/templates/modern.png", // Using modern template image as placeholder
    features: [
      "Tailwind CSS design",
      "Responsive layout",
      "Smooth animations",
      "Mobile-friendly navigation",
    ],
  },
];

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
            Select a template to start customizing your meme token website. Each
            template comes with unique features and animations.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative p-6 sm:p-8 rounded-xl shadow-sm border border-zinc-200 hover:shadow-lg transition-all duration-300 flex flex-col h-full overflow-hidden bg-white"
            >
              {/* Image Preview Section */}
              <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden border border-zinc-200">
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={template.image || "/og-image.png"}
                    alt={`${template.name} Preview`}
                    fill
                    className="object-cover object-top group-hover:animate-scroll-y"
                    priority
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-zinc-600 mb-4">{template.description}</p>
              </div>

              {/* Customize Button */}
              {template.name.includes("Coming Soon") ? (
                <button
                  className="w-full mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  disabled
                >
                  Coming Soon
                </button>
              ) : (
                <Link
                  href={`/customize?template=${template.id}`}
                  className="w-full inline-flex items-center justify-center mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                >
                  Customize Template
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
