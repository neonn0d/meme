export interface WebsiteGeneration {
  hash: string;
  price: number;
  timestamp: string;
}

export interface UserWebsiteMetadata {
  websites: WebsiteGeneration[];
  totalGenerated: number;
  totalSpent: number;
}
