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
import { Monitor, Smartphone, ChevronDown, Shuffle } from "lucide-react";
import { colorPairs } from "./components/BasicInfoForm";

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
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [activeView, setActiveView] = useState<'edit' | 'preview'>('edit');
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
    secondaryColor: "#c0bfbc",
    coinName: "BUIDL Token",
    tokenSymbol: "BUIDL",
    description:
      "BUIDL helps you create and launch memecoin websites effortlessly. Build your community, showcase your coin, and get ready to moon!",
    logoUrl: "https://www.buidl.co.in/logo.png",
    contractAddress: "0xD0ntL34v3Th1sPl4c3h0ld3rHere",
    socialLinks: {
      telegram: "https://t.me/buidl_community",
      twitter: "https://x.com/buidlcoin",
      discord: "https://discord.gg/UHDdNH574Y",
    },
    buyLink: "https://buidl.co.in",
    tokenomics: {
      totalSupply: "1000000000",
      taxBuy: "5",
      taxSell: "5",
      lpLocked: "2 Years",
    },
    seo: {
      title: "BUIDL | Ultimate Memecoin Website Generator",
      description:
        "Easily create your memecoin website with BUIDL! Fast, customizable, and perfect for building your community. Start your journey to the moon today! ",
      keywords:
        "memecoin website generator, customizable templates, crypto projects, cryptocurrency websites, blockchain templates, crypto community builder, tokenomics design, web3 tools, launchpad websites, crypto marketing tools, responsive crypto templates, degen tools, blockchain website creator, memecoin branding, crypto project showcase, Ethereum, Polygon, Solana websites, crypto growth platform, viral crypto campaigns",
      ogImage: "https://placehold.co/1200x630/ffffff/000000?text=BUIDL",
    },
    roadmap: {
      phases: [
        {
          title: "Concept & Vision",
          description:
            "Define your big idea and lay out the foundation for your project. Set clear goals and build excitement around what’s coming next. ",
          date: "Q1 2024",
        },
        {
          title: "Build & Launch",
          description:
            "Start creating! Focus on getting your product, service, or community up and running. This is where things start to come to life. ",
          date: "Q2 2025",
        },
        {
          title: "Growth & Expansion",
          description:
            "Take things to the next level! Expand your reach, grow your audience, and roll out exciting new features to keep the momentum strong. ",
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
        question: "What is BUIDL? ",
        answer:
          "BUIDL is the ultimate tool for degens who need a memecoin website fast. No coding, no fluff—just pick, tweak, and you’re ready to shill your coin.",
      },
      {
        question: "How does it work? ",
        answer:
          "Pick a template, add your coin’s story (and a touch of meme magic), and hit generate. Your site’s ready to download and take to the moon in minutes.",
      },
      {
        question: "Why BUIDL? ",
        answer:
          "Because you’ve got better things to do, like building hype. We make creating memecoin sites fast, fun, and simple. No stress, just vibes. LFG!",
      },
    ],
  });

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
      // Record website generation only for premium users
      if (isSubscribed) {
        await fetch('/api/websites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isPremium: true
          })
        });
      }

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

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true when component mounts (client-side only)
    setIsClient(true);
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Add a resize event listener to handle responsive behavior
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          // On medium screens and above, always show both panels
          document.querySelectorAll('.md\\:block').forEach(el => {
            (el as HTMLElement).style.display = 'block';
          });
        } else {
          // On small screens, respect the activeView state
          if (activeView === 'edit') {
            document.querySelector('.edit-panel')?.classList.remove('hidden');
            document.querySelector('.preview-panel')?.classList.add('hidden');
          } else {
            document.querySelector('.edit-panel')?.classList.add('hidden');
            document.querySelector('.preview-panel')?.classList.remove('hidden');
          }
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [activeView]);

  return (
    <div className=" bg-gray-50 overflow-x-hidden">
      <div className="w-screen min-w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 px-4 md:px-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold">Memecoin Website Generator</h1>
              <p className="text-gray-500 text-sm">
                Customize your website and preview in real-time
              </p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* View Mode Tabs - Only visible on small screens */}
              <div className="flex items-center mr-2 md:hidden">
                <button
                  onClick={() => setActiveView('edit')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-l-md ${
                    activeView === 'edit'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setActiveView('preview')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-r-md ${
                    activeView === 'preview'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Preview
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobile(false)}
                  className={`p-2 rounded text-sm font-medium ${
                    !isMobile
                      ? "bg-black text-white hover:opacity-90 transition-all duration-200"
                      : "bg-gray-100 text-black hover:bg-gray-200 transition-all duration-200"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMobile(true)}
                  className={`p-2 rounded text-sm font-medium ${
                    isMobile
                      ? "bg-black text-white hover:opacity-90 transition-all duration-200"
                      : "bg-gray-100 text-black hover:bg-gray-200 transition-all duration-200"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    // Get available color pairs
                    const availableIndices = Array.from(
                      { length: colorPairs.length },
                      (_, i) => i
                    );
                    
                    // Pick a random color pair
                    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
                    const randomPair = colorPairs[randomIndex];
                    
                    // Apply the new colors
                    setFields({
                      ...fields,
                      primaryColor: randomPair.primary,
                      secondaryColor: randomPair.secondary,
                    });
                  }}
                  style={{ 
                    background: `linear-gradient(to right, ${fields.primaryColor || '#FF4081'}, ${fields.secondaryColor || '#7C4DFF'})`,
                  }}
                  className="p-2 rounded-full text-white hover:opacity-90 transition-all duration-200"
                  title="Randomize Colors"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-2 bg-black text-white text-sm md:text-base font-medium rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {isLoading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex min-h-full">
            {/* Edit Panel - Always visible on larger screens, conditionally visible on small screens */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 overflow-y-auto max-h-[87.5vh] ${
              !isClient ? 'block' : activeView === 'edit' || (isClient && window.innerWidth >= 768) ? 'block' : 'hidden'
            }`}>
              <div className="pb-4 px-4 md:px-6">
                {/* Tab Navigation - Made sticky */}
                <div className="sticky top-0 bg-white z-10">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => setShowTabsMenu(!showTabsMenu)}
                      className="md:hidden flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      {tabs.find((tab) => tab.id === activeTab)?.label}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  {/* Mobile Dropdown Menu */}
                  {showTabsMenu && (
                    <div className="md:hidden absolute z-20 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                      <div className="py-1">
                        {tabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setShowTabsMenu(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              activeTab === tab.id
                                ? "bg-gray-100 text-gray-900 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Desktop Tabs */}
                  <div className="hidden md:flex space-x-1 overflow-x-auto pb-1 border-b">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-2 text-sm font-medium rounded-t-md whitespace-nowrap ${
                          activeTab === tab.id
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                  {/* Basic Info Section */}
                  {activeTab === "basic" && (
                    <div>
                      <BasicInfoForm
                        fields={fields}
                        onChange={handleFieldChange}
                      />
                    </div>
                  )}

                  {/* Sections Section */}
                  {activeTab === "sections" && (
                    <div>
                      <SectionsForm
                        fields={fields}
                        onChange={handleFieldChange}
                      />
                    </div>
                  )}

                  {/* Tokenomics Section */}
                  {activeTab === "tokenomics" && (
                    <div>
                      <TokenomicsForm
                        fields={fields}
                        onChange={handleFieldChange}
                      />
                    </div>
                  )}

                  {/* Team Section */}
                  {activeTab === "team" && (
                    <div>
                      <TeamForm 
                        fields={fields} 
                        onChange={handleFieldChange} 
                      />
                    </div>
                  )}

                  {/* Roadmap Section */}
                  {activeTab === "roadmap" && (
                    <div>
                      <RoadmapForm 
                        fields={fields} 
                        onChange={handleFieldChange} 
                      />
                    </div>
                  )}

                  {/* FAQ Section */}
                  {activeTab === "faq" && (
                    <div>
                      <FaqForm 
                        fields={fields} 
                        onChange={handleFieldChange} 
                      />
                    </div>
                  )}

                  {/* Social Links Section */}
                  {activeTab === "social" && (
                    <div>
                      <SocialLinksForm 
                        fields={fields} 
                        onChange={handleFieldChange} 
                      />
                    </div>
                  )}

                  {/* SEO Section */}
                  {activeTab === "seo" && (
                    <div>
                      <SeoForm 
                        fields={fields} 
                        onChange={handleFieldChange} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Preview Panel - Always visible on larger screens, conditionally visible on small screens */}
            <div className={`w-full md:w-2/3 ${
              !isClient ? 'block' : activeView === 'preview' || (isClient && window.innerWidth >= 768) ? 'block' : 'hidden'
            }`}>
              <div className="w-full h-full min-h-[87.5vh] transition-all duration-300 relative pr-5">
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
