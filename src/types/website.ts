export interface WebsiteMetadata {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
  url?: string;
  customDomain?: string;
  settings?: {
    theme?: string;
    features?: string[];
    [key: string]: any;
  };
}

export interface UserWebsiteMetadata {
  websites: WebsiteMetadata[];
  totalWebsites: number;
}
