import { PreviewData, GeneratedTemplate } from '@/types';
import { generateTemplate3HTML } from './html';
import { generateTemplate3CSS } from './css';
import { generateTemplate3JS } from './js';

interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
}

interface RoadmapPhase {
  title: string;
  description: string;
  date: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface RocketTemplateData {
  coinName: string;
  tokenSymbol: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  contractAddress?: string;
  socialLinks: {
    telegram?: string;
    twitter?: string;
    discord?: string;
    website?: string;
  };
  tokenomics: {
    totalSupply: string;
    taxBuy: string;
    taxSell: string;
    lpLocked: string;
  };
  sections?: {
    hero?: boolean;
    tokenomics?: boolean;
    roadmap?: boolean;
    team?: boolean;
    faq?: boolean;
    community?: boolean;
  };
  roadmap?: {
    phases: RoadmapPhase[];
  };
  team?: TeamMember[];
  faq?: FAQItem[];
  chartLink?: string;
  buyLink?: string;
  dexScreenerLink?: string;
  dexToolsLink?: string;
}

export const generateRocketTemplate = (data: PreviewData): GeneratedTemplate => {
  return {
    html: generateTemplate3HTML(data),
    css: generateTemplate3CSS(data),
    js: generateTemplate3JS()
  };
};
