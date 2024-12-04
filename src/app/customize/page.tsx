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
import { Monitor, Smartphone } from "lucide-react";

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
    sections: {
      hero: true,
      tokenomics: true,
      roadmap: true,
      team: true,
      faq: true,
      community: true,
    },
    primaryColor: "#3B82F6",
    secondaryColor: "#EFF6FF",
    coinName: "BUIDL Token",
    tokenSymbol: "BUIDL",
    description:
      "BUIDL helps you create and launch memecoin websites effortlessly. Build your community, showcase your coin, and get ready to moon! 🌙",
    logoUrl: "https://www.buidl.co.in/logo.png",
    contractAddress: "0xD0ntL34v3Th1sPl4c3h0ld3rHere",
    socialLinks: {
      telegram: "https://t.me/buidl_community",
      twitter: "https://x.com/buidlcoin",
      discord: "https://discord.gg/UHDdNH574Y",
    },
    buyLink: "https://raydium.io/swap/",
    tokenomics: {
      totalSupply: "1000000000",
      taxBuy: "5",
      taxSell: "5",
      lpLocked: "2 Years",
    },
    seo: {
      title: "BUIDL | Ultimate Solana Meme Generator",
      description:
        "Launch your own memecoin on Solana with BUIDL! Fast, easy, and community-driven. Create your moon mission today! 🚀",
      keywords:
        "solana, memecoin generator, cryptocurrency, SPL token, defi, meme token, solana token, launch platform",
      ogImage: "https://placehold.co/1200x630/3B82F6/ffffff?text=BUIDL",
    },
    roadmap: {
      phases: [
        {
          title: "Concept & Vision",
          description:
            "Define your big idea and lay out the foundation for your project. Set clear goals and build excitement around what’s coming next. 🚀",
          date: "Q1 2024",
        },
        {
          title: "Build & Launch",
          description:
            "Start creating! Focus on getting your product, service, or community up and running. This is where things start to come to life. 🌟",
          date: "Q2 2025",
        },
        {
          title: "Growth & Expansion",
          description:
            "Take things to the next level! Expand your reach, grow your audience, and roll out exciting new features to keep the momentum strong. 💫",
          date: "Q3 2025",
        },
      ],
    },

    team: [
      {
        name: "Meme Lord",
        role: "Platform Architect",
        avatar:
          "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&facialHairType=Blank&clotheType=BlazerShirt",
      },
      {
        name: "Degen Dev",
        role: "Smart Contract Wizard",
        avatar:
          "https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&facialHairType=Blank&clotheType=BlazerShirt",
      },
      {
        name: "Ser Launch",
        role: "Community Lead",
        avatar:
          "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortRound&facialHairType=BeardLight&clotheType=Hoodie",
      },
    ],
    faq: [
      {
        question: "What is BUIDL? 🚀",
        answer:
          "BUIDL is the ultimate tool for degens who need a memecoin website fast. No coding, no fluff—just pick, tweak, and you’re ready to shill your coin.",
      },
      {
        question: "How does it work? ⚡",
        answer:
          "Pick a template, add your coin’s story (and a touch of meme magic), and hit generate. Your site’s ready to download and take to the moon in minutes.",
      },
      {
        question: "Is it safe? 🔒",
        answer:
          "You bet, fren. We don’t keep your data or host anything. What you see is what you get, and the rest is up to you. Full control, no funny business.",
      },
      {
        question: "Why BUIDL? 🌟",
        answer:
          "Because you’ve got better things to do, like building hype. We make creating memecoin sites fast, fun, and simple. No stress, just vibes. LFG!",
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
    <div className=" bg-gray-50">
      <div className="w-screen min-w-full">
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
                      className={`p-2 rounded text-sm font-medium ${
                        !isMobile
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsMobile(true)}
                      className={`p-2 rounded text-sm font-medium ${
                        isMobile
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
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
          <div className="flex min-h-full">
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
            <div className={`flex-1  ${showPreview ? "block" : "hidden"}`}>
              <div className="w-full h-full min-h-[87.5vh] transition-all duration-300">
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
