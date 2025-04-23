export interface Post {
  id: string;
  converted_link: string;
  created_at: string;
  current_price: string;
  group_data: any;
  image: any;
  imageUrl: any;
  market_place: string;
  previous_price: string;
  product_link: string;
  product_name: string;
  min_price: string;
  max_price: string;
  purchaseType: string;
  schedule_post: any;
  coupons: string[];
  special_conditions: any;
  status: string;
  updated_at: string;
  user_id: any;
}
export interface Marketplace {
  id: string;
  app_id: string;
  app_secret: string;
  marketplace: string;
  name: string;
  partner_id: string;
  status: string;
  user_id: string;
  website_link: string;
  updated_at: string;
  created_at: string;
}
export interface Stats {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  activeMarketplaces: number;
}