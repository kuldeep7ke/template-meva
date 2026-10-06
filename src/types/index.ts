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

/**
 * Storefront lifecycle of a catalog entry.
 *
 * - `placeholder` an invented demo product. Excluded from the sitemap. Never ship one.
 * - `draft`      a real Machine-registered project, deliberately not published.
 * - `published`  live in the catalog and in the sitemap.
 */
export type ProductStatus = 'placeholder' | 'draft' | 'published';

/**
 * Resale consent for a registered product.
 *
 * `docs/products.json` records this per project, and `tests/check-registry.cjs`
 * refuses to let anything other than `allowed` reach `published`. A finished
 * template is not automatically a sellable one.
 */
export type ResaleStatus = 'allowed' | 'not-for-resale' | 'undecided';

export interface Template {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  fullOverview: string;
  status: ProductStatus; // Storefront lifecycle -- see ProductStatus
  /** The Machine ProjectID this product was generated from, e.g. `BLG-GEL-002`. */
  projectId?: string; // Absent on invented placeholders
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
