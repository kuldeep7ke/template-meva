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
/**
 * Store-wide figures shown in the homepage stats strip.
 *
 * Every value here must be MEASURED. `null` means "not measured yet", and the
 * strip is hidden entirely rather than rendered with a placeholder, a zero or a
 * plausible-looking guess.
 *
 * This existed as hardcoded markup reading `99 / 100`, `12,500+ Active Bloggers`
 * and `4.96 / 5.0 Customer Rating` while the catalog listed nothing at all. That
 * is a store claiming twelve thousand users with no product for sale. The catalog
 * gate stopped the fixtures being sold; this is the same defect in the marketing
 * copy, and it needed the same treatment.
 */
export const STORE_STATS = {
  pageSpeedMobile: null as number | null,
  activeBloggers: null as number | null,
  customerRating: null as number | null,
  cleanXmlPercent: null as number | null,
};

/** True when at least one stat has a real measured value. */
export const HAS_STORE_STATS = Object.values(STORE_STATS).some((v) => typeof v === 'number');

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
