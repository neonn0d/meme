export type SectionKey = keyof CustomizationFields['sections'];

export interface RoadmapPhase {
  title: string;
  description: string;
  date: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CustomizationFields {
  coinName: string;
  tokenSymbol: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  contractAddress: string;
  buyLink: string;
  templateId: string;
  sections: {
    hero: boolean;
    tokenomics: boolean;
    roadmap: boolean;
    team: boolean;
    faq: boolean;
    community: boolean;
  };
  socialLinks: {
    telegram: string;
    twitter: string;
    discord: string;
  };
  tokenomics: {
    totalSupply: string;
    taxBuy: string;
    taxSell: string;
    lpLocked: string;
  };
  roadmap?: {
    phases: RoadmapPhase[];
  };
  team?: TeamMember[];
  faq?: FaqItem[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
}

export interface GeneratedTemplate {
  html: string;
  css: string;
  js: string;
}

export interface PreviewData {
  templateId: string;
  sections: {
    hero: boolean;
    tokenomics: boolean;
    roadmap: boolean;
    team: boolean;
    faq: boolean;
    community: boolean;
  };
  coinName: string;
  tokenSymbol: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  contractAddress: string;
  buyLink: string;
  socialLinks: {
    telegram: string;
    twitter: string;
    discord: string;
  };
  tokenomics: {
    totalSupply: string;
    taxBuy: string;
    taxSell: string;
    lpLocked: string;
  };
  roadmap?: {
    phases: RoadmapPhase[];
  };
  team?: TeamMember[];
  faq?: FaqItem[];
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
}

export interface GenerateRequestBody extends CustomizationFields {
  userId: string;
}
