"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@solana/wallet-adapter-react";
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
import { Monitor, Smartphone, ChevronDown, Shuffle, Eye, Edit } from "lucide-react";
import { colorPairs } from "./components/BasicInfoForm";
import Head from "next/head";
import { MiniNav } from "@/components/MiniNav";

// Animation styles will be injected via a component
const CustomStyles = () => {
  return (
    <Head>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </Head>
  );
};

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

// Main component with suspense boundary
export default function CustomizePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CustomizePageContent />
    </Suspense>
  );
}

// Wrapper component that uses searchParams
function CustomizePageContent() {
  const { userId } = useAuth();
  const { publicKey } = useWallet();
  const { subscriptionData } = useSubscription();
  const isSubscribed = subscriptionData.isSubscribed;
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
    secondaryColor: "#0e376c",
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
      totalSupply: "10000000",
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
    console.log('Generate button clicked');
    if (isSubscribed) {
      // Skip payment for premium users
      handlePaymentSuccess();
    } else {
      setShowPaymentModal(true);
      console.log('Payment modal should be shown now');
    }
  };

  const handlePaymentSuccess = async (paymentInfo?: {
    paymentTx: string;
    paymentAmount: number;
    explorerUrl: string;
  }) => {
    setShowPaymentModal(false);
    setIsLoading(true);

    try {
      // Get wallet address for authentication
      const walletAddress = publicKey ? publicKey.toString() : null;
      
      if (!walletAddress) {
        throw new Error("Wallet not connected");
      }
      
      console.log('Using wallet address for authentication:', walletAddress);
      console.log('Payment info:', paymentInfo);
      
      // Record website generation only for premium users
      if (isSubscribed) {
        await fetch('/api/websites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${walletAddress}`,
          },
          body: JSON.stringify({
            isPremium: true
          })
        });
      }

      // We already have the wallet address from above
      console.log('Sending generate request with wallet address:', walletAddress);
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${walletAddress}`,
        },
        body: JSON.stringify({
          userId,
          ...fields,
          // Include payment information if available
          ...(paymentInfo ? {
            paymentTx: paymentInfo.paymentTx,
            paymentAmount: paymentInfo.paymentAmount,
            explorerUrl: paymentInfo.explorerUrl
          } : {})
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
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: '0px',
    width: '0px',
  });

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

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (isClient && activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab, isClient]);

  // Update the indicator position when the active tab changes
  useEffect(() => {
    if (tabsRef.current && isClient) {
      const activeTabElement = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
      if (activeTabElement) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const activeRect = activeTabElement.getBoundingClientRect();
        
        setIndicatorStyle({
          left: `${activeRect.left - tabsRect.left}px`,
          width: `${activeRect.width}px`,
        });
      }
    }
  }, [activeTab, isClient]);

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <CustomStyles />
      <div className="w-screen min-w-full">
        <div className="bg-white shadow-lg overflow-hidden">
          {/* Main Content */}
          <div className="flex min-h-full h-screen">
            {/* Edit Panel - Always visible on larger screens, conditionally visible on small screens */}
            <div className={`w-full md:w-1/4 border-r border-gray-200 overflow-y-auto max-h-[100vh] ${
              !isClient ? 'block' : activeView === 'edit' || (isClient && window.innerWidth >= 768) ? 'block' : 'hidden'
            }`}>
              <div className="pb-4 px-4 md:px-2">
                {/* Memecoin Website Generator Title */}
                <div className="sticky top-0 bg-white z-20 pt-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-200 mb-2">
                    <MiniNav />
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 gap-2">
                    {/* Device Switchers */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setIsMobile(false)}
                        className={`p-1.5 rounded text-sm font-medium ${
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
                        className={`p-1.5 rounded text-sm font-medium ${
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
                        className="p-1.5 rounded-full text-white hover:opacity-90 transition-all duration-200"
                        title="Randomize Colors"
                      >
                        <Shuffle className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Generate Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {isLoading ? "Generating..." : "Generate"}
                    </button>
                  </div>
                  </div>
                  
                
                 
                
                  {/* Compact Horizontal Tabs for Desktop */}
                  <div 
                    ref={tabsRef} 
                    className="hidden md:flex overflow-x-hidden border-b scrollbar-hide"
                  >
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        ref={activeTab === tab.id ? activeTabRef : null}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 text-sm whitespace-nowrap transition-all duration-200 border-b-2 ${
                          activeTab === tab.id
                            ? "border-black text-black font-medium"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Mobile Tab Selector - Compact Dropdown */}
                  <div className="md:hidden mb-3">
                    <div className="relative">
                      <button
                        onClick={() => setShowTabsMenu(!showTabsMenu)}
                        className="flex items-center justify-between w-full px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-all duration-200"
                      >
                        <span>{tabs.find((tab) => tab.id === activeTab)?.label}</span>
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${showTabsMenu ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Mobile Dropdown Menu */}
                      {showTabsMenu && (
                        <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden animate-slideDown">
                          <div className="py-1">
                            {tabs.map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setActiveTab(tab.id);
                                  setShowTabsMenu(false);
                                }}
                                className={`block w-full text-left px-3 py-1.5 text-sm transition-colors duration-150 ${
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
                    </div>
                  </div>
                </div>
                
                {/* Tab Content with padding to account for sticky header */}
                <div className="space-y-6 pt-2">
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
            <div className={`w-full md:w-3/4 ${
              !isClient ? 'block' : activeView === 'preview' || (isClient && window.innerWidth >= 768) ? 'block' : 'hidden'
            }`}>
              <div className="w-full h-full min-h- scrollbar-hide  transition-all duration-300 relative bg-gray-100">
                <iframe
                  src={generatePreviewUrl()}
                  className={`w-full h-full border-0 transition-all duration-300 ${
                    isLoading ? 'opacity-50' : 'opacity-100'
                  } ${isMobile ? "max-w-[375px] mx-auto border border-black" : ""}`}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Toggle Button */}
      <button
        onClick={() => setActiveView(activeView === 'edit' ? 'preview' : 'edit')}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50 md:hidden"
        title={activeView === 'edit' ? 'Switch to Preview' : 'Switch to Editor'}
      >
        {activeView === 'edit' ? <Eye className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
      </button>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            <SolanaPayment
              onSuccess={handlePaymentSuccess}
              onClose={() => setShowPaymentModal(false)}
              websiteDetails={{
                coinName: fields.coinName,
                tokenSymbol: fields.tokenSymbol,
                contractAddress: fields.contractAddress
              }}
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
