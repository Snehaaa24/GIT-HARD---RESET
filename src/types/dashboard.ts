export interface DashboardStats {
  totalProducts: number;
  totalReviews: number;
  suspiciousReviews: number;
  trustScore: number;
}

export interface FlaggedReview {
  id: string;
  text: string;
  reason: string;
  confidence: number;
  timestamp: string;
  reviewerName: string;
  reviewerVerified: boolean;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  totalReviews: number;
  suspiciousReviews: number;
  trustScore: number;
  flaggedReviews: FlaggedReview[];
}

export interface DashboardData {
  stats: DashboardStats;
  products: Product[];
}