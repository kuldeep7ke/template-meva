export interface TemplateDemo {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  demoUrl: string;
  category: string;
  badge?: string;
  accentColor?: string;
}

export interface SpecificationItem {
  label: string;
  value: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  iconName: string;
  isHighlight?: boolean;
}

export interface ComparisonItem {
  feature: string;
  trial: boolean | string; // 7-Day Free Trial Edition
  active: boolean | string; // Activated Full Lifetime Edition
  note?: string;
}

export interface TemplateReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Template {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  fullOverview: string;
  price: number; // Full activation price
  originalPrice: number;
  hasTrial: boolean; // Has 7-day free trial
  trialDuration: string; // "7 Days Free Trial"
  trialDownloadUrl: string; // Download link for trial .xml
  buyUrl: string; // Link to purchase permanent activation license
  rating: number;
  reviewCount: number;
  salesCount: number;
  version: string;
  releaseDate: string;
  lastUpdated: string;
  category: string;
  tags: string[];
  columns: '1 Column' | '2 Columns' | '3 Columns' | 'Grid / Masonry';
  layout: 'Magazine' | 'Clean / Minimal' | 'Personal' | 'Tech' | 'E-Commerce' | 'Portfolio';
  pageSpeedScore: {
    mobile: number;
    desktop: number;
  };
  features: FeatureItem[];
  specifications: SpecificationItem[];
  demos: TemplateDemo[];
  comparisonTable: ComparisonItem[];
  reviews: TemplateReview[];
  thumbnail: string;
  galleryImages: string[];
  liveDemoUrl: string; // The primary Blogger demo link
  badge?: 'HOT' | 'NEW' | 'FEATURED' | 'BESTSELLER';
  rtlSupported: boolean;
  darkModeSupported: boolean;
  adsenseOptimized: boolean;
  seoReady: boolean;
}

export interface DocGuideStep {
  stepNumber: number;
  title: string;
  content: string;
  codeSnippet?: string;
  tip?: string;
  warning?: string;
}

export interface DocArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Installation' | 'Activation' | 'Customization' | 'Troubleshooting' | 'Licensing';
  excerpt: string;
  readingTime: string;
  updatedAt: string;
  steps: DocGuideStep[];
}

export interface SiteConfig {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  supportEmail: string;
  author: string;
  currencySymbol: string;
  contactAddress: string;
  workingHours: string;
  socials: {
    twitter: string;
    facebook: string;
    youtube: string;
    github: string;
    telegram: string;
  };
}
