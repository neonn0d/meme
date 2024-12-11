export interface WebsiteGeneration {
  transactionHash?: string;  // Optional, present for paid generations
  hash?: string;  // Optional, present for paid generations
  price?: number;  // Optional, present for paid generations
  timestamp: string;
}

export interface UserWebsiteMetadata {
  websites: WebsiteGeneration[];
  totalGenerated: number;
  totalSpent: number;
}
