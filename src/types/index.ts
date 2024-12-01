export interface SocialLinks {
  telegram: string;
  twitter: string;
  discord: string;
}

export interface TokenomicsData {
  totalSupply: string;
  taxBuy: string;
  taxSell: string;
  lpLocked: string;
}

export interface SeoData {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

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
  templateId: string;
  coinName: string;
  sections: {
    hero: boolean;
    tokenomics: boolean;
    roadmap: boolean;
    team: boolean;
    faq: boolean;
    community: boolean;
  };
  primaryColor: string;
  secondaryColor: string;
  tokenSymbol: string;
  description: string;
  logoUrl: string;
  contractAddress: string;
  socialLinks: SocialLinks;
  buyLink: string;
  tokenomics: TokenomicsData;
  roadmap?: {
    phases: RoadmapPhase[];
  };
  team?: TeamMember[];
  faq?: FaqItem[];
  seo: SeoData;
}

export interface GeneratedTemplate {
  html: string;
  css: string;
  js: string;
}

export type TemplateFiles = GeneratedTemplate | string;

export interface GenerateRequestBody extends CustomizationFields {
  files: TemplateFiles;
}

export type PreviewData = CustomizationFields;
