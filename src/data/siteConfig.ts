import type { SiteConfig } from '../types';

export const SITE_CONFIG: SiteConfig = {
  siteName: 'TemplateMeva',
  siteTitle: 'TemplateMeva - Premium Blogger Templates Store (7-Day Free Trial)',
  siteDescription: 'Discover the fastest, SEO-optimized, and most beautiful Blogger (Blogspot) templates. Designed for high PageSpeed, maximum AdSense revenue, and effortless customization.',
  siteUrl: 'https://templatemeva.com',
  supportEmail: 'support@templatemeva.com',
  author: 'TemplateMeva',
  currencySymbol: '$',
  contactAddress: 'TemplateMeva, Global Digital Hub, Cloudflare Edge',
  workingHours: 'Mon - Sat: 9AM - 5PM UTC',
  socials: {
    twitter: 'https://twitter.com/templatemeva',
    facebook: 'https://facebook.com/templatemeva',
    youtube: 'https://youtube.com/@templatemeva',
    github: 'https://github.com/templatemeva',
    telegram: 'https://t.me/templatemeva'
  }
};

/**
 * Store categories. The first entry is the "no filter" sentinel and is excluded
 * from dropdowns. Every value below must match a `category` in `TEMPLATES`
 * (except 'Newspaper', which is a live filter with no catalog entries yet —
 * retire it or add a template to avoid an always-empty results grid).
 */
export const CATEGORIES = [
  'All Templates',
  'Magazine',
  'Tech',
  'Clean / Minimal',
  'Portfolio',
  'E-Commerce',
  'Newspaper'
];

export const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' }
];
