"use client";

import { useState, useEffect, useRef } from "react";
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
import { PreviewFrame } from "@/components/PreviewFrame";
import Link from "next/link";

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
  const [isMobile, setIsMobile] = useState(false);

  // Initialize fields with demo content
  const [fields, setFields] = useState<CustomizationFields>({
    templateId: rawTemplateId || "modern",
    coinName: "DemoMeme Coin",
    sections: {
      hero: true,
      tokenomics: true,
      roadmap: true,
      team: true,
      faq: true,
      community: true,
    },
    primaryColor: "#6D28D9",
    secondaryColor: "#ffffff",
    tokenSymbol: "DEMO",
    description:
      "Welcome to DemoMeme Coin - where memes meet innovation! Our community-driven token combines humor with serious DeFi potential. Join us on this exciting journey to the moon! 🚀",
    logoUrl: "https://pngimg.com/d/coin_PNG36910.png",
    contractAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    socialLinks: {
      telegram: "https://t.me/demomeme",
      twitter: "https://twitter.com/demomeme",
      discord: "https://discord.gg/demomeme",
    },
    buyLink: "https://pancakeswap.finance/",
    tokenomics: {
      totalSupply: "1,000,000,000",
      taxBuy: "5",
      taxSell: "5",
      lpLocked: "2 Years",
    },
    seo: {
      title: "DemoMeme Coin | The Next Generation Meme Token",
      description:
        "Join the DemoMeme revolution - where memes meet innovation in the world of cryptocurrency. Community-driven, secure, and ready for the moon!",
      keywords: "meme coin, cryptocurrency, defi, blockchain, community token",
      ogImage: "https://placehold.co/1200x630/6D28D9/ffffff?text=DEMO+MEME",
    },
    roadmap: {
      phases: [
        {
          title: "Launch",
          description:
            "Website launch, community building, and token fair launch on DEX",
          date: "Q1 2024",
        },
        {
          title: "Growth",
          description:
            "Marketing campaigns, CEX listings, and partnership developments",
          date: "Q2 2024",
        },
        {
          title: "Expansion",
          description:
            "NFT marketplace launch, governance token implementation",
          date: "Q3 2024",
        },
      ],
    },
    team: [
      {
        name: "Alex Thompson",
        role: "Project Lead",
        avatar: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&facialHairType=Blank&clotheType=BlazerShirt",
      },
      {
        name: "Sarah Chen",
        role: "Marketing Director",
        avatar: "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&facialHairType=Blank&clotheType=BlazerShirt",
      },
      {
        name: "Mike Rodriguez",
        role: "Lead Developer",
        avatar: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortRound&facialHairType=BeardLight&clotheType=Hoodie",
      },
    ],
     
    faq: [
      {
        question: "What is DemoMeme Coin?",
        answer:
          "DemoMeme Coin is a community-driven cryptocurrency that combines the fun of memes with serious DeFi functionality. Our goal is to create a strong, engaged community while delivering innovative blockchain solutions.",
      },
      {
        question: "How can I buy DemoMeme Coin?",
        answer:
          "You can buy DemoMeme Coin on PancakeSwap using BNB. Simply connect your wallet, set appropriate slippage, and swap BNB for DEMO tokens.",
      },
      {
        question: "Is the liquidity locked?",
        answer:
          "Yes, our liquidity is locked for 2 years to ensure the safety and stability of our token.",
      },
      {
        question: "What are the tokenomics?",
        answer:
          "We have a total supply of 1 billion tokens, with 5% buy and sell taxes that contribute to marketing, development, and liquidity.",
      },
    ],
  });

  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewData, setPreviewData] = useState<CustomizationFields>({
    templateId: searchParams?.get("template") || "modern",
    coinName: "",
    sections: {
      hero: true,
      tokenomics: true,
      roadmap: true,
      team: true,
      faq: true,
      community: true,
    },
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    tokenSymbol: "",
    description: "",
    logoUrl: "",
    contractAddress: "",
    socialLinks: {
      telegram: "",
      twitter: "",
      discord: "",
    },
    buyLink: "",
    tokenomics: {
      totalSupply: "",
      taxBuy: "",
      taxSell: "",
      lpLocked: "",
    },
    seo: {
      title: "",
      description: "",
      keywords: "",
      ogImage: "",
    },
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleFieldChange = (partialFields: Partial<CustomizationFields>) => {
    setFields((prev) => ({
      ...prev,
      ...partialFields,
    }));
    setPreviewData((prev) => ({ ...prev, ...partialFields }));
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

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const generatePreviewUrl = () => {
    const params = new URLSearchParams();
    params.set("template", fields.templateId);
    params.set("coinName", encodeURIComponent(fields.coinName));
    params.set("sections", encodeURIComponent(JSON.stringify(fields.sections)));
    params.set("primaryColor", fields.primaryColor);
    params.set("secondaryColor", fields.secondaryColor);
    params.set("tokenSymbol", encodeURIComponent(fields.tokenSymbol));
    params.set("description", encodeURIComponent(fields.description));
    params.set("logoUrl", encodeURIComponent(fields.logoUrl));
    params.set("contractAddress", encodeURIComponent(fields.contractAddress));
    params.set(
      "socialLinks",
      encodeURIComponent(JSON.stringify(fields.socialLinks))
    );
    params.set("buyLink", encodeURIComponent(fields.buyLink));
    params.set(
      "tokenomics",
      encodeURIComponent(JSON.stringify(fields.tokenomics))
    );
    params.set("seo", encodeURIComponent(JSON.stringify(fields.seo)));
    params.set("roadmap", encodeURIComponent(JSON.stringify(fields.roadmap)));
    params.set("team", encodeURIComponent(JSON.stringify(fields.team)));
    params.set("faq", encodeURIComponent(JSON.stringify(fields.faq)));
    params.set("view", isMobile ? "mobile" : "desktop");
    return `/preview?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 max-w-8xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="space-x-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    !showPreview
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                    showPreview
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="flex items-center gap-4">
                {showPreview && (
                  <div className="flex items-center gap-2 mr-4">
                    <button
                      onClick={() => setIsMobile(false)}
                      className={`px-3 py-1.5 rounded text-sm font-medium ${
                        !isMobile
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setIsMobile(true)}
                      className={`px-3 py-1.5 rounded text-sm font-medium ${
                        isMobile
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? "Generating..." : "Generate Website"}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex min-h-[calc(100vh-12rem)]">
            {/* Edit Panel */}
            <div className={`flex-1 ${showPreview ? "hidden" : "block"}`}>
              <div className="overflow-y-auto">
                <div className="p-4">
                  <div className="flex space-x-2 mb-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          activeTab === tab.id
                            ? "bg-black/10 text-primary"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  {/* Form Content */}
                  {activeTab === "basic" && (
                    <BasicInfoForm
                      fields={fields}
                      onChange={handleFieldChange}
                    />
                  )}
                  {activeTab === "sections" && (
                    <SectionsForm
                      fields={fields}
                      onChange={handleFieldChange}
                    />
                  )}
                  {activeTab === "tokenomics" && (
                    <TokenomicsForm
                      fields={fields}
                      onChange={handleFieldChange}
                    />
                  )}
                  {activeTab === "roadmap" && (
                    <RoadmapForm fields={fields} onChange={handleFieldChange} />
                  )}
                  {activeTab === "team" && (
                    <TeamForm fields={fields} onChange={handleFieldChange} />
                  )}
                  {activeTab === "faq" && (
                    <FaqForm fields={fields} onChange={handleFieldChange} />
                  )}
                  {activeTab === "social" && (
                    <SocialLinksForm
                      fields={fields}
                      onChange={handleFieldChange}
                    />
                  )}
                  {activeTab === "seo" && (
                    <SeoForm fields={fields} onChange={handleFieldChange} />
                  )}
                </div>
              </div>
            </div>
            {/* Preview Panel */}
            <div
              className={`flex-1 border-l border-gray-200 ${
                showPreview ? "block" : "hidden"
              }`}
            >
              <div className="h-full">
                <iframe
                  src={generatePreviewUrl()}
                  className={`w-full h-full border-0 transition-all duration-300 ${
                    isMobile ? "max-w-[375px] mx-auto border border-black" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            <SolanaPayment
              onSuccess={handlePaymentSuccess}
              onClose={() => setShowPaymentModal(false)}
            />
            <button
              onClick={() => setShowPaymentModal(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
