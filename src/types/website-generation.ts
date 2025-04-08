export interface WebsiteGeneration {
  transactionHash?: string;  // Optional, present for paid generations
  hash?: string;  // Optional, present for paid generations
  price?: number;  // Optional, present for paid generations
  coinName?: string;  // Name of the coin
  tokenSymbol?: string;  // Token symbol
  contractAddress?: string;  // Contract address
  explorerUrl?: string;  // Explorer URL for the transaction
  timestamp: string;
}

export interface UserWebsiteMetadata {
  user_id: string;
  websites: WebsiteGeneration[];
  total_generated: number;
  total_spent: number;
  payments?: any[];
}
