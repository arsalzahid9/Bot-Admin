export interface Post {
  id: string;
  marketplace: string;
  productLink: string;
  productName: string;
  previousPrice: number;
  currentPrice: number;
  convertedLink: string;
  coupons: string[];
  specialConditions: string[];
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Marketplace {
  id: string;
  name: string;
  isActive: boolean;
  apiKey?: string;
  createdAt: string;
}

export interface Stats {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  activeMarketplaces: number;
}