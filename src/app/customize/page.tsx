"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { BasicInfoForm } from "./components/BasicInfoForm";
import { TokenomicsForm } from "./components/TokenomicsForm";
import { TeamForm } from "./components/TeamForm";
import { RoadmapForm } from "./components/RoadmapForm";
import { FaqForm } from "./components/FaqForm";
import { SocialLinksForm } from "./components/SocialLinksForm";
import { SeoForm } from "./components/SeoForm";
import { SectionsForm } from "./components/SectionsForm";
import { CustomizationFields } from "@/types";
import { SolanaPayment } from "@/components/SolanaPayment";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSubscription } from "@/hooks/useSubscription";

interface RoadmapPhase {
  title: string;
  description: string;
  date: string;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const tabs = [
  { id: "basic", label: "Basic Info" },
  { id: "sections", label: "Sections" },
  { id: "tokenomics", label: "Tokenomics" },
  { id: "team", label: "Team" },
  { id: "roadmap", label: "Roadmap" },
  { id: "faq", label: "FAQ" },
  { id: "social", label: "Social Links" },
  { id: "seo", label: "SEO" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function CustomizePage() {
  const { userId } = useAuth();
  const { isSubscribed } = useSubscription();
  const searchParams = useSearchParams();
  const rawTemplateId = searchParams.get("template");
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Map old template IDs to new ones for backward compatibility
  const mappedTemplateId =
    rawTemplateId === "modern"
      ? "modern-doge-v2"
      : rawTemplateId === "rocket"
      ? "moon-rocket-v2"
      : rawTemplateId === "cosmic"
      ? "cosmic-space-v1"
      : rawTemplateId;

  const defaultFields = {
    coinName: "DogeMoon",
    tokenSymbol: "DMOON",
    description:
      "DogeMoon is a community-driven memecoin that combines the playful spirit of memes with innovative DeFi features. Join our mission to the moon! 🚀🌕",
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    logoUrl: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
    contractAddress: "0x1234567890123456789012345678901234567890",
    buyLink: "https://app.uniswap.org/",
    templateId: mappedTemplateId || "",
    sections: {
      hero: true,
      tokenomics: true,
      roadmap: true,
      team: true,
      faq: true,
      community: true,
    },
    socialLinks: {
      telegram: "https://t.me/yourproject",
      twitter: "https://twitter.com/yourproject",
      discord: "https://discord.gg/yourproject",
    },
    tokenomics: {
      totalSupply: "1000000000",
      taxBuy: "2",
      taxSell: "3",
      lpLocked: "50",
    },
    roadmap: {
      phases: [
        {
          title: "Phase 1: Launch & Community Building",
          description:
            "Website launch, social media presence establishment, and initial community growth through engaging content and activities.",
          date: "Q1 2024",
        },
        {
          title: "Phase 2: Market Expansion",
          description:
            "Strategic partnerships, exchange listings, and enhanced marketing campaigns to increase visibility and adoption.",
          date: "Q2 2024",
        },
        {
          title: "Phase 3: Ecosystem Development",
          description:
            "Launch of additional features, community governance implementation, and expansion of use cases.",
          date: "Q3 2024",
        },
      ] as RoadmapPhase[],
    },
    team: [
      {
        name: "Alex Thompson",
        role: "Founder & CEO",
        avatar: "https://i.pravatar.cc/300?img=68",
      },
      {
        name: "Sam Chen",
        role: "CTO",
        avatar: "https://i.pravatar.cc/300?img=33",
      },
      {
        name: "Emma Rodriguez",
        role: "CMO",
        avatar: "https://i.pravatar.cc/300?img=48",
      },
    ] as TeamMember[],
    faq: [
      {
        question: "What makes this meme coin unique?",
        answer:
          "Our meme coin combines community-driven governance with innovative tokenomics, creating a unique ecosystem that rewards long-term holders while maintaining a fun and engaging community atmosphere.",
      },
      {
        question: "How can I buy and store the tokens?",
        answer:
          "You can purchase tokens through popular DEXs like Uniswap or PancakeSwap. For storage, we recommend using secure wallets like MetaMask or Trust Wallet to ensure the safety of your holdings.",
      },
      {
        question: "What are the tokenomics and distribution?",
        answer:
          "Our tokenomics are designed for sustainability and fairness. The total supply is carefully distributed across liquidity pools, community rewards, development, and marketing to ensure long-term project growth.",
      },
    ] as FaqItem[],
    seo: {
      title: "DogeMoon - The Next Generation Memecoin",
      description:
        "DogeMoon is a community-driven memecoin that combines the playful spirit of memes with innovative DeFi features. Join our mission to the moon! 🚀🌕",
      keywords:
        "DogeMoon, memecoin, cryptocurrency, token, defi, community, blockchain",
      ogImage: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
    },
  };

  const [fields, setFields] = useState<CustomizationFields>(defaultFields);
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFieldChange = (partialFields: Partial<CustomizationFields>) => {
    setFields((prev) => ({
      ...prev,
      ...partialFields,
    }));
  };

  const handleTabChange = (tabId: TabId) => {
    console.log("Changing tab to:", tabId);
    setActiveTab(tabId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubscribed) {
      // Skip payment for premium users
      handlePaymentSuccess();
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...fields,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate website");
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : `${fields.coinName.toLowerCase().replace(/\s+/g, "-")}-website.zip`;

      // Convert the response to a blob
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

      // Set a flag in session storage that we just downloaded
      sessionStorage.setItem("justDownloaded", "true");

      toast.success("Website generated successfully!");

      // Redirect to success page after ensuring download started
      router.push("/success");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto py-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    whitespace-nowrap py-2 px-4 text-sm font-medium rounded-md mr-4
                    ${
                      activeTab === tab.id
                        ? "bg-zinc-900 text-white"
                        : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="py-6">
              {activeTab === "basic" && (
                <BasicInfoForm fields={fields} onChange={handleFieldChange} />
              )}
              {activeTab === "sections" && (
                <SectionsForm fields={fields} onChange={handleFieldChange} />
              )}
              {activeTab === "tokenomics" && (
                <TokenomicsForm fields={fields} onChange={handleFieldChange} />
              )}
              {activeTab === "team" && (
                <TeamForm fields={fields} onChange={handleFieldChange} />
              )}
              {activeTab === "roadmap" && (
                <RoadmapForm fields={fields} onChange={handleFieldChange} />
              )}
              {activeTab === "faq" && (
                <FaqForm fields={fields} onChange={handleFieldChange} />
              )}
              {activeTab === "social" && (
                <SocialLinksForm fields={fields} onChange={handleFieldChange} />
              )}
              {activeTab === "seo" && (
                <SeoForm fields={fields} onChange={handleFieldChange} />
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-row items-center justify-between gap-4">
                {!isSubscribed && (
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-zinc-50 to-white px-4 py-2 rounded-lg border border-zinc-100">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <p className="text-sm text-zinc-600">
                      Tired of paying for each website?{" "}
                      <a
                        href="/pricing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150 hover:underline"
                      >
                        Upgrade to premium
                      </a>{" "}
                      and generate unlimited websites!
                    </p>
                  </div>
                )}
                <div className="flex flex-1 justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 font-medium transition-colors duration-150"
                  >
                    Generate Website
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <SolanaPayment
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPaymentModal(false)}
          />
        )}
      </div>
    </div>
  );
}
