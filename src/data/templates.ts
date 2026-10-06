import type { Template } from '../types';

export const TEMPLATES: Template[] = [
  {
    id: 'spotlight',
    slug: 'spotlight',
    title: 'Spotlight Blogger Template',
    tagline: 'Modern, High-Speed Magazine & Newspaper Blogger Template',
    description: 'Spotlight is a fast, responsive, and SEO-optimized Blogger template crafted for news sites, tech blogs, personal portfolios, and editorial magazines. Test it with our 7 Days Free Trial and activate with your license key for full permanent lifetime access.',
    fullOverview: `Spotlight is one of the most versatile and high-performance Blogger templates ever built. Designed from scratch following modern web standards, it achieves a 99+ Core Web Vitals score on both mobile and desktop. 
    
You can test Spotlight risk-free on your blog with our 7 Days Free Trial. Once activated with your official license key, all trial limits and expiration locks are removed, granting you 100% white-label freedom, lifetime updates, and priority developer support.`,
    price: 12.95,
    originalPrice: 29.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/spotlight-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/spotlight-blogger-template',
    rating: 4.95,
    reviewCount: 142,
    salesCount: 1840,
    version: 'v2.4.0',
    releaseDate: '2025-01-10',
    lastUpdated: '2026-09-15',
    category: 'Magazine',
    tags: ['Magazine', 'Newspaper', '7-Day Trial', 'Dark Mode', 'AdSense Ready', 'SEO Rich', 'RTL Support', 'High Speed'],
    columns: '2 Columns',
    layout: 'Magazine',
    pageSpeedScore: {
      mobile: 98,
      desktop: 100
    },
    thumbnail: '/images/spotlight-thumb.svg',
    galleryImages: [
      '/images/spotlight-hero.svg',
      '/images/spotlight-thumb.svg',
      '/images/smartmag-thumb.svg',
    ],
    liveDemoUrl: 'https://spotlight-template-demo.blogspot.com',
    badge: 'BESTSELLER',
    rtlSupported: true,
    darkModeSupported: true,
    adsenseOptimized: true,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger (Blogspot)' },
      { label: 'Trial Period', value: '7 Days Free Trial (Fully Functional)' },
      { label: 'Full Version', value: 'Activated via Official License Key' },
      { label: 'Layout Version', value: 'Version 3 (Blogger Latest XML Layout)' },
      { label: 'Files Included', value: 'XML Theme File, Documentation HTML, Demo Data' },
      { label: 'Browser Support', value: 'Chrome, Firefox, Safari, Edge, Opera' },
      { label: 'Responsive Design', value: 'Yes, 100% Fluid & Retina Ready' },
      { label: 'Speed Score', value: '99/100 Google PageSpeed Insights' },
      { label: 'RTL (Right to Left)', value: 'Supported (Arabic, Hebrew, Persian, Urdu)' },
      { label: 'Ad Placements', value: 'Header, In-Article, Sidebar, Sticky Footer' },
      { label: 'License', value: 'Single Domain Lifetime Activation + Free Updates' },
    ],
    features: [
      {
        title: '7 Days Free Trial Testing',
        description: 'Test all features risk-free for 7 days. Enter your license key at any time to activate permanently.',
        iconName: 'Zap',
        isHighlight: true
      },
      {
        title: '100% Mobile Responsive & Retina Ready',
        description: 'Engineered to fit flawlessly on smartphones, tablets, laptops, and ultra-wide desktop screens.',
        iconName: 'Smartphone',
        isHighlight: true
      },
      {
        title: 'Dark Mode / Light Mode Switcher',
        description: 'Instant zero-flicker dark mode toggle with automatic user device preference memory.',
        iconName: 'Moon',
        isHighlight: true
      },
      {
        title: 'Google AdSense & In-Feed Ads Ready',
        description: 'Strategically engineered ad slots that boost click-through rates (CTR) and earnings safely.',
        iconName: 'DollarSign',
        isHighlight: true
      },
      {
        title: 'Schema.org Rich Snippets & SEO',
        description: 'Integrated Article, BreadcrumbList, and Author JSON-LD metadata for highest Google rankings.',
        iconName: 'Search',
        isHighlight: true
      },
      {
        title: 'Ajax Live Search with Instant Thumbnails',
        description: 'Interactive search modal that queries articles on the fly as the user types.',
        iconName: 'Zap'
      },
      {
        title: 'Mega Menu & Categorized Tabs',
        description: 'Multi-column dropdown navigation that loads recent posts by label dynamically.',
        iconName: 'Layout'
      },
      {
        title: 'Disqus & Native Blogger Comments',
        description: 'Switch seamlessly between standard Blogger comment system, Disqus, or Facebook comments.',
        iconName: 'MessageSquare'
      },
    ],
    demos: [
      {
        id: 'spotlight-main',
        title: 'Default Main Magazine',
        slug: 'spotlight-main',
        description: 'The flagship multi-section layout featuring breaking ticker, slider carousel, and tabbed sidebar.',
        thumbnail: '/images/spotlight-thumb.svg',
        demoUrl: 'https://spotlight-template-demo.blogspot.com',
        category: 'Magazine',
        badge: 'POPULAR'
      },
      {
        id: 'spotlight-tech',
        title: 'Tech & Gadgets Demo',
        slug: 'spotlight-tech',
        description: 'High-contrast dark-blue theme optimized for electronics, reviews, specs, and benchmark tables.',
        thumbnail: '/images/techpulse-thumb.svg',
        demoUrl: 'https://spotlight-tech-demo.blogspot.com',
        category: 'Tech',
        badge: 'NEW'
      },
      {
        id: 'spotlight-dark',
        title: 'Pure Dark Mode Demo',
        slug: 'spotlight-dark',
        description: 'A striking pitch-black aesthetic tailored for night readers, crypto traders, and developers.',
        thumbnail: '/images/spotlight-hero.svg',
        demoUrl: 'https://spotlight-dark-demo.blogspot.com',
        category: 'Dark',
        badge: 'TRENDING'
      },
      {
        id: 'spotlight-rtl',
        title: 'RTL Language Edition (Arabic/Hebrew)',
        slug: 'spotlight-rtl',
        description: 'Completely mirrored typography and navigational structure for Right-to-Left scripts.',
        thumbnail: '/images/spotlight-thumb.svg',
        demoUrl: 'https://spotlight-rtl-demo.blogspot.com',
        category: 'RTL'
      },
      {
        id: 'spotlight-lifestyle',
        title: 'Lifestyle & Travel Demo',
        slug: 'spotlight-lifestyle',
        description: 'Vibrant photo-first aesthetic with masonry cards and Instagram gallery integration.',
        thumbnail: '/images/foodiebite-thumb.svg',
        demoUrl: 'https://spotlight-lifestyle-demo.blogspot.com',
        category: 'Lifestyle'
      }
    ],
    comparisonTable: [
      { feature: 'Trial Evaluation Period', trial: '7 Days Free Trial', active: 'Lifetime Unlimited Access' },
      { feature: 'Core Layout & Responsive Grid', trial: true, active: true },
      { feature: 'PageSpeed 99+ Optimization', trial: true, active: true },
      { feature: 'Dark Mode / Light Mode Switcher', trial: true, active: true },
      { feature: 'Mega Menu & Ajax Live Search', trial: true, active: true },
      { feature: 'Full Feature Activation & Lock Removal', trial: false, active: true, note: 'Trial redirects to activation page after 7 days if unactivated' },
      { feature: 'Remove Footer Attribution Credits', trial: false, active: true, note: 'Trial requires attribution until license key is entered' },
      { feature: 'Google AdSense High-CTR Ad Widgets', trial: '1 Slot (Trial)', active: 'Unlimited High-CTR Slots' },
      { feature: 'Schema.org JSON-LD Rich Snippets', trial: 'Basic', active: 'Full Article & Author Snippets' },
      { feature: 'Lifetime Updates & Bug Fixes', trial: false, active: true },
      { feature: 'Priority 24/7 Support & Setup Help', trial: false, active: true },
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Alex Henderson',
        rating: 5,
        date: '2026-08-14',
        comment: 'Tested Spotlight on the 7-day trial and bought the active license on day 3. PageSpeed score jumped from 61 to 99 right away!',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        author: 'Sarah Al-Mansoor',
        rating: 5,
        date: '2026-07-28',
        comment: 'The activation took 10 seconds. Pasted my license key into the widget and all trial notices vanished immediately.',
        verifiedPurchase: true
      },
      {
        id: 'rev-3',
        author: 'Marcus Vance',
        rating: 5,
        date: '2026-07-02',
        comment: 'Great to have a 7 days trial to test my content before paying. Once activated, the full version runs completely smooth and fast.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'smartmag',
    slug: 'smartmag',
    title: 'SmartMag Multi-Concept Blogger Template',
    tagline: 'Ultimate Multi-Concept Magazine with 6+ Distinct Demo Layouts',
    description: 'SmartMag is a powerhouse template modeled after high-end magazine designs. Comes with 6 purpose-built demos for Tech, Viral, Crypto, Travel, and Fashion. Try with 7 Days Free Trial, activate for permanent use.',
    fullOverview: `SmartMag offers unmatched versatility for publishers who want a distinctive magazine feel. With its multi-concept design, you can switch between a sleek editorial look, a high-octane viral blog, or a clean crypto news layout with a few clicks.
    
Install the 7 Days Free Trial to experience all 6 concept demos. Activating with your license key permanently unlocks full functionality with zero expiration restrictions.`,
    price: 14.95,
    originalPrice: 35.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/smartmag-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/smartmag-blogger-template',
    rating: 4.98,
    reviewCount: 210,
    salesCount: 3120,
    version: 'v3.1.2',
    releaseDate: '2024-11-20',
    lastUpdated: '2026-09-28',
    category: 'Magazine',
    tags: ['Multi-Concept', 'Magazine', '7-Day Trial', 'Viral', 'Crypto', 'Infinite Scroll', 'AdSense'],
    columns: '3 Columns',
    layout: 'Magazine',
    pageSpeedScore: {
      mobile: 97,
      desktop: 99
    },
    thumbnail: '/images/smartmag-thumb.svg',
    galleryImages: [
      '/images/smartmag-thumb.svg',
      '/images/spotlight-hero.svg',
      '/images/techpulse-thumb.svg'
    ],
    liveDemoUrl: 'https://smartmag-preview.blogspot.com',
    badge: 'HOT',
    rtlSupported: true,
    darkModeSupported: true,
    adsenseOptimized: true,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger (Blogspot)' },
      { label: 'Trial Period', value: '7 Days Free Trial' },
      { label: 'Full Version', value: 'Activated via License Key' },
      { label: 'Included Concepts', value: '6 Pre-Built Demos' },
      { label: 'Speed Score', value: '98/100 PageSpeed' },
      { label: 'License', value: 'Lifetime Usage & Free Updates' }
    ],
    features: [
      {
        title: '7 Days Free Trial',
        description: 'Test all 6 concepts for 7 days before purchasing your activation key.',
        iconName: 'Zap',
        isHighlight: true
      },
      {
        title: '6+ Ready-to-Use Unique Demos',
        description: 'Launch distinct styles for Tech, Viral, Finance, Crypto, and Fashion instantly.',
        iconName: 'Layers',
        isHighlight: true
      },
      {
        title: 'AdSense High-CTR Placements',
        description: 'Under-title, in-middle-content, and sticky bottom billboard ad slots.',
        iconName: 'DollarSign',
        isHighlight: true
      }
    ],
    demos: [
      {
        id: 'smartmag-classic',
        title: 'Classic Newspaper Concept',
        slug: 'smartmag-classic',
        description: 'Traditional multi-column newspaper layout with breaking banner and video widget.',
        thumbnail: '/images/smartmag-thumb.svg',
        demoUrl: 'https://smartmag-preview.blogspot.com',
        category: 'Newspaper',
        badge: 'DEFAULT'
      },
      {
        id: 'smartmag-tech',
        title: 'Tech & Gaming Hub Concept',
        slug: 'smartmag-tech',
        description: 'Dark-accented gadget portal with review scoring badges and comparison tables.',
        thumbnail: '/images/techpulse-thumb.svg',
        demoUrl: 'https://smartmag-preview.blogspot.com',
        category: 'Tech',
        badge: 'POPULAR'
      },
      {
        id: 'smartmag-viral',
        title: 'Viral & Entertainment Buzz',
        slug: 'smartmag-viral',
        description: 'Engaging layout featuring trending reaction badges, social share counts, and quiz widgets.',
        thumbnail: '/images/spotlight-hero.svg',
        demoUrl: 'https://smartmag-preview.blogspot.com',
        category: 'Viral'
      },
      {
        id: 'smartmag-crypto',
        title: 'Crypto, Stocks & Finance',
        slug: 'smartmag-crypto',
        description: 'Includes live crypto ticker simulation, market watch headers, and sleek finance tables.',
        thumbnail: '/images/novastore-thumb.svg',
        demoUrl: 'https://smartmag-preview.blogspot.com',
        category: 'Finance'
      },
      {
        id: 'smartmag-food',
        title: 'Food & Culinary Recipes',
        slug: 'smartmag-food',
        description: 'Beautiful imagery presentation with prep time, calorie tags, and ingredient checklists.',
        thumbnail: '/images/foodiebite-thumb.svg',
        demoUrl: 'https://smartmag-preview.blogspot.com',
        category: 'Food'
      },
      {
        id: 'smartmag-fashion',
        title: 'Fashion & Style Journal',
        slug: 'smartmag-fashion',
        description: 'Chic editorial typography, full-width lookbook carousels, and minimal borders.',
        thumbnail: '/images/minimalgrid-thumb.svg',
        demoUrl: 'https://smartmag-preview.blogspot.com',
        category: 'Fashion'
      }
    ],
    comparisonTable: [
      { feature: 'Trial Access to All 6 Demos', trial: '7 Days Free Trial', active: 'Permanent Full Access' },
      { feature: 'Core Web Vitals 99 Score', trial: true, active: true },
      { feature: 'Permanent Activation (No Redirects)', trial: false, active: true, note: 'Trial expires after 7 days' },
      { feature: 'Remove Footer Attribution', trial: false, active: true },
      { feature: 'Full AdSense Slots', trial: '1 Slot (Trial)', active: 'All 8 Ad Widgets' },
      { feature: 'Lifetime Updates & Support', trial: false, active: true }
    ],
    reviews: [
      {
        id: 'sm-rev-1',
        author: 'Elena Rostova',
        rating: 5,
        date: '2026-09-10',
        comment: 'Tested the 7-day trial and activated the full version immediately. The multi-demo selector makes it so easy to pick a style.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'techpulse',
    slug: 'techpulse',
    title: 'TechPulse Gadget & Software Blogger Template',
    tagline: 'Ultra-Fast Technology, AI, and Gadgets Review Theme',
    description: 'Designed specifically for tech blogs and tutorial creators with integrated review stars, pros/cons boxes, and code highlighting. Available with a 7 Days Free Trial.',
    fullOverview: `TechPulse is the premier choice for tech influencers, gadget reviewers, and coding tutorial bloggers. It includes built-in Prism code syntax highlighting, structured pros & cons review boxes with schema ratings, and automated affiliate button widgets. Test free for 7 days.`,
    price: 12.95,
    originalPrice: 28.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/techpulse-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/techpulse-blogger-template',
    rating: 4.90,
    reviewCount: 96,
    salesCount: 1240,
    version: 'v2.1.0',
    releaseDate: '2025-03-01',
    lastUpdated: '2026-08-20',
    category: 'Tech',
    tags: ['Tech', 'Reviews', '7-Day Trial', 'Gadgets', 'Code Highlighting', 'Affiliate Ready'],
    columns: '2 Columns',
    layout: 'Tech',
    pageSpeedScore: {
      mobile: 99,
      desktop: 100
    },
    thumbnail: '/images/techpulse-thumb.svg',
    galleryImages: ['/images/techpulse-thumb.svg', '/images/spotlight-hero.svg'],
    liveDemoUrl: 'https://techpulse-demo.blogspot.com',
    badge: 'NEW',
    rtlSupported: true,
    darkModeSupported: true,
    adsenseOptimized: true,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger' },
      { label: 'Trial Period', value: '7 Days Free Trial' },
      { label: 'Full Version', value: 'Activated via License Key' },
      { label: 'Code Highlighting', value: 'Prism.js Built-in' },
      { label: 'PageSpeed', value: '100/100 Desktop' }
    ],
    features: [
      {
        title: '7 Days Free Trial',
        description: 'Test all features for 7 days before purchasing full activation.',
        iconName: 'Zap',
        isHighlight: true
      },
      {
        title: 'Review Schema & Rating Stars',
        description: 'Display Google-indexed star ratings directly in search results.',
        iconName: 'Star'
      }
    ],
    demos: [
      {
        id: 'techpulse-default',
        title: 'Tech Review Demo',
        slug: 'techpulse-default',
        description: 'Full review setup with affiliate buttons and comparison cards.',
        thumbnail: '/images/techpulse-thumb.svg',
        demoUrl: 'https://techpulse-demo.blogspot.com',
        category: 'Tech'
      }
    ],
    comparisonTable: [
      { feature: 'Evaluation Period', trial: '7 Days Free Trial', active: 'Permanent Lifetime Access' },
      { feature: 'Pros & Cons Box Widget', trial: true, active: true },
      { feature: 'Permanent Activation (No Expiration)', trial: false, active: true },
      { feature: 'Support & Updates', trial: false, active: true }
    ],
    reviews: []
  },
  {
    id: 'foodiebite',
    slug: 'foodiebite',
    title: 'FoodieBite Culinary & Recipe Blogger Template',
    tagline: 'Clean, Mouth-Watering Recipe Cards with Rich Cooking Schema',
    description: 'Crafted for foodies, chefs, and cooking creators. Includes print-ready recipe cards, prep/cook time counters, and ingredient checkboxes. 7 Days Free Trial included.',
    fullOverview: `FoodieBite turns standard Blogger into a gourmet food portal. Readers can check off ingredients as they cook, toggle metric/imperial servings, and print recipes without ads cluttering the page. Activate full version with your license key.`,
    price: 11.95,
    originalPrice: 24.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/foodiebite-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/foodiebite-blogger-template',
    rating: 4.92,
    reviewCount: 78,
    salesCount: 890,
    version: 'v1.8.0',
    releaseDate: '2025-02-15',
    lastUpdated: '2026-07-10',
    category: 'Clean / Minimal',
    tags: ['Recipe', 'Food', '7-Day Trial', 'Cooking', 'Printable Card', 'Nutritional Schema'],
    columns: '2 Columns',
    layout: 'Clean / Minimal',
    pageSpeedScore: {
      mobile: 98,
      desktop: 100
    },
    thumbnail: '/images/foodiebite-thumb.svg',
    galleryImages: ['/images/foodiebite-thumb.svg'],
    liveDemoUrl: 'https://foodiebite-demo.blogspot.com',
    rtlSupported: false,
    darkModeSupported: false,
    adsenseOptimized: true,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger' },
      { label: 'Trial Period', value: '7 Days Free Trial' },
      { label: 'Recipe Schema', value: 'Google Recipe Rich Snippet' }
    ],
    features: [
      {
        title: '7 Days Free Trial',
        description: 'Test all culinary widgets on your blog for 7 days.',
        iconName: 'Zap',
        isHighlight: true
      }
    ],
    demos: [
      {
        id: 'foodiebite-default',
        title: 'Culinary Demo',
        slug: 'foodiebite-default',
        description: 'Vibrant recipe layout with step-by-step cooking photos.',
        thumbnail: '/images/foodiebite-thumb.svg',
        demoUrl: 'https://foodiebite-demo.blogspot.com',
        category: 'Food'
      }
    ],
    comparisonTable: [
      { feature: 'Evaluation Period', trial: '7 Days Free Trial', active: 'Permanent Lifetime Access' },
      { feature: 'Interactive Recipe Cards', trial: true, active: true },
      { feature: 'Permanent Activation (No Expiration)', trial: false, active: true }
    ],
    reviews: []
  },
  {
    id: 'minimalgrid',
    slug: 'minimalgrid',
    title: 'MinimalGrid Clean Portfolio Blogger Template',
    tagline: 'Ultra-Minimalist Masonry & Grid Layout for Photographers and Writers',
    description: 'A distraction-free, black-and-white minimalist grid template focusing purely on typography, photography, and narrative storytelling. Try with 7 Days Free Trial.',
    fullOverview: `MinimalGrid strips away unnecessary clutter to highlight your visual craft and words. Featuring subtle micro-animations, lazy-loaded lightbox galleries, and custom typography pairings.`,
    price: 9.95,
    originalPrice: 22.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/minimalgrid-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/minimalgrid-blogger-template',
    rating: 4.88,
    reviewCount: 64,
    salesCount: 710,
    version: 'v2.0.0',
    releaseDate: '2025-04-12',
    lastUpdated: '2026-08-01',
    category: 'Portfolio',
    tags: ['Minimal', 'Grid', '7-Day Trial', 'Masonry', 'Photography', 'Portfolio', 'Clean'],
    columns: 'Grid / Masonry',
    layout: 'Portfolio',
    pageSpeedScore: {
      mobile: 100,
      desktop: 100
    },
    thumbnail: '/images/minimalgrid-thumb.svg',
    galleryImages: ['/images/minimalgrid-thumb.svg'],
    liveDemoUrl: 'https://minimalgrid-demo.blogspot.com',
    rtlSupported: true,
    darkModeSupported: true,
    adsenseOptimized: false,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger' },
      { label: 'Trial Period', value: '7 Days Free Trial' },
      { label: 'Weight', value: 'Under 18KB Pure CSS' }
    ],
    features: [
      {
        title: '7 Days Free Trial',
        description: 'Test the ultra-fast minimalist layout on your blog for 7 days.',
        iconName: 'Zap',
        isHighlight: true
      }
    ],
    demos: [
      {
        id: 'minimalgrid-default',
        title: 'Masonry Portfolio Demo',
        slug: 'minimalgrid-default',
        description: 'Clean responsive grid with lightbox image zoom.',
        thumbnail: '/images/minimalgrid-thumb.svg',
        demoUrl: 'https://minimalgrid-demo.blogspot.com',
        category: 'Portfolio'
      }
    ],
    comparisonTable: [
      { feature: 'Evaluation Period', trial: '7 Days Free Trial', active: 'Permanent Lifetime Access' },
      { feature: 'Permanent Activation (No Expiration)', trial: false, active: true }
    ],
    reviews: []
  },
  {
    id: 'chrononews',
    slug: 'chrononews',
    title: 'ChronoNews Editorial Newspaper Blogger Template',
    tagline: 'High-Density Editorial Layout for Political, Financial & World News',
    description: 'ChronoNews brings the prestige of the New York Times and The Guardian to Blogger. Designed for high volume daily publications. Includes 7 Days Free Trial.',
    fullOverview: `Built for serious publishing operations, ChronoNews provides structured multi-tier headlines, author attribution cards, audio article player placeholders, and live breaking alerts.`,
    price: 12.95,
    originalPrice: 29.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/chrononews-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/chrononews-blogger-template',
    rating: 4.94,
    reviewCount: 112,
    salesCount: 1450,
    version: 'v2.3.0',
    releaseDate: '2025-01-20',
    lastUpdated: '2026-09-02',
    category: 'Newspaper',
    tags: ['Editorial', 'Newspaper', '7-Day Trial', 'Politics', 'Finance', 'Breaking News'],
    columns: '3 Columns',
    layout: 'Magazine',
    pageSpeedScore: {
      mobile: 98,
      desktop: 100
    },
    thumbnail: '/images/chrononews-thumb.svg',
    galleryImages: ['/images/chrononews-thumb.svg'],
    liveDemoUrl: 'https://chrononews-demo.blogspot.com',
    rtlSupported: true,
    darkModeSupported: true,
    adsenseOptimized: true,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger' },
      { label: 'Trial Period', value: '7 Days Free Trial' },
      { label: 'Breaking News Ticker', value: 'Ajax Feed Supported' }
    ],
    features: [
      {
        title: '7 Days Free Trial',
        description: 'Test the editorial layout for 7 days before purchasing activation.',
        iconName: 'Zap',
        isHighlight: true
      }
    ],
    demos: [
      {
        id: 'chrononews-default',
        title: 'Editorial News Demo',
        slug: 'chrononews-default',
        description: 'Multi-column traditional newspaper layout.',
        thumbnail: '/images/chrononews-thumb.svg',
        demoUrl: 'https://chrononews-demo.blogspot.com',
        category: 'News'
      }
    ],
    comparisonTable: [
      { feature: 'Evaluation Period', trial: '7 Days Free Trial', active: 'Permanent Lifetime Access' },
      { feature: 'Permanent Activation (No Expiration)', trial: false, active: true }
    ],
    reviews: []
  },
  {
    id: 'novastore',
    slug: 'novastore',
    title: 'NovaStore Blogger E-Commerce Template',
    tagline: 'Sell Products Directly on Blogger with WhatsApp & PayPal Checkout',
    description: 'Transform your free Blogger website into a professional online store with shopping cart, currency switcher, WhatsApp direct ordering, and PayPal checkout. Try with 7 Days Free Trial.',
    fullOverview: `NovaStore eliminates expensive monthly e-commerce platform fees by enabling full store capability on Google Blogger. Features product variants (size/color), discount coupons, and instant WhatsApp ordering.`,
    price: 15.95,
    originalPrice: 39.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/novastore-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/novastore-blogger-template',
    rating: 4.96,
    reviewCount: 88,
    salesCount: 950,
    version: 'v2.2.0',
    releaseDate: '2025-05-10',
    lastUpdated: '2026-09-18',
    category: 'E-Commerce',
    tags: ['E-Commerce', 'Store', '7-Day Trial', 'WhatsApp Checkout', 'PayPal', 'Shopping Cart'],
    columns: 'Grid / Masonry',
    layout: 'E-Commerce',
    pageSpeedScore: {
      mobile: 96,
      desktop: 99
    },
    thumbnail: '/images/novastore-thumb.svg',
    galleryImages: ['/images/novastore-thumb.svg'],
    liveDemoUrl: 'https://novastore-demo.blogspot.com',
    badge: 'FEATURED',
    rtlSupported: true,
    darkModeSupported: false,
    adsenseOptimized: false,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger' },
      { label: 'Trial Period', value: '7 Days Free Trial' },
      { label: 'Cart Engine', value: 'Local Storage Shopping Cart' }
    ],
    features: [
      {
        title: '7 Days Free Trial',
        description: 'Test your product store for 7 days before activating full license.',
        iconName: 'Zap',
        isHighlight: true
      }
    ],
    demos: [
      {
        id: 'novastore-default',
        title: 'Retail Store Demo',
        slug: 'novastore-default',
        description: 'Full product grid with category filter and cart drawer.',
        thumbnail: '/images/novastore-thumb.svg',
        demoUrl: 'https://novastore-demo.blogspot.com',
        category: 'Shop'
      }
    ],
    comparisonTable: [
      { feature: 'Evaluation Period', trial: '7 Days Free Trial', active: 'Permanent Lifetime Access' },
      { feature: 'Permanent Activation (No Expiration)', trial: false, active: true }
    ],
    reviews: []
  },
  {
    id: 'lumenlife',
    slug: 'lumenlife',
    title: 'LumenLife Personal Blog & Journal Blogger Template',
    tagline: 'A Calm, Typography-First Template for Daily Journals & Life Logs',
    description: 'LumenLife is a warm, readable personal blog theme built around beautiful typography and generous whitespace. Ideal for journals, daily logs, and lifestyle writing. Try with 7 Days Free Trial.',
    fullOverview: `LumenLife strips the noise away so your writing leads. It ships with a distraction-free reading mode, infinite scroll for archives, native dark mode, and a full right-to-left translation. Built for writers who publish often and care about how the page feels.`,
    price: 9.95,
    originalPrice: 24.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/lumenlife-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/lumenlife-blogger-template',
    rating: 4.91,
    reviewCount: 64,
    salesCount: 730,
    version: 'v1.4.0',
    releaseDate: '2025-08-22',
    lastUpdated: '2026-09-27',
    category: 'Clean / Minimal',
    tags: ['Personal Blog', 'Journal', 'Dark Mode', 'RTL Ready', '7-Day Trial', 'Typography'],
    columns: '2 Columns',
    layout: 'Personal',
    pageSpeedScore: {
      mobile: 99,
      desktop: 100
    },
    thumbnail: '/images/lumenlife-thumb.svg',
    galleryImages: ['/images/lumenlife-thumb.svg'],
    liveDemoUrl: 'https://lumenlife-demo.blogspot.com',
    badge: 'NEW',
    rtlSupported: true,
    darkModeSupported: true,
    adsenseOptimized: true,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger' },
      { label: 'Reading Mode', value: 'Distraction-Free Toggle' },
      { label: 'Archive Style', value: 'Infinite Scroll' }
    ],
    features: [
      {
        title: 'Distraction-Free Reading',
        description: 'One tap strips the chrome away and leaves only your words.',
        iconName: 'Search',
        isHighlight: true
      },
      {
        title: 'Native Dark Mode',
        description: 'Follows the system setting automatically, no toggle needed.',
        iconName: 'Moon'
      }
    ],
    demos: [
      {
        id: 'lumenlife-journal',
        title: 'Daily Journal Demo',
        slug: 'lumenlife-journal',
        description: 'Chronological journal layout with mood tags and reading time.',
        thumbnail: '/images/lumenlife-thumb.svg',
        demoUrl: 'https://lumenlife-demo.blogspot.com',
        category: 'Journal',
        badge: 'DEFAULT'
      }
    ],
    comparisonTable: [
      { feature: 'Typography & Layout Engine', trial: true, active: true },
      { feature: 'Remove Footer Credits', trial: false, active: true },
      { feature: 'Evaluation Period', trial: '7 Days Free Trial', active: 'Permanent Lifetime Access' },
      { feature: 'Permanent Activation (No Expiration)', trial: false, active: true }
    ],
    reviews: [
      {
        id: 'lumenlife-r1',
        author: 'Priya N.',
        rating: 5,
        date: 'September 12, 2026',
        comment: 'I write almost every day and this is the first theme that made long posts genuinely pleasant to read. The reading mode alone is worth it.',
        verifiedPurchase: true
      },
      {
        id: 'lumenlife-r2',
        author: 'Tom H.',
        rating: 4,
        date: 'August 30, 2026',
        comment: 'Loads instantly on mobile and the dark mode is properly done. Setup took about ten minutes using the installation guide.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'traveltrove',
    slug: 'traveltrove',
    title: 'TravelTrove Adventure Blogger Template',
    tagline: 'Photo-Led Travel Blog Template with Route Maps & Photo Lightbox',
    description: 'TravelTrove is built for visual storytelling. Full-width photo galleries, a drag-and-drop route map, offline-friendly itinerary posts, and an integrated travel journal. Try with 7 Days Free Trial.',
    fullOverview: `TravelTrove puts the photography first with edge-to-edge galleries, a swipeable lightbox, and lazy-loaded image grids that stay fast even on hundreds of photos. It includes itinerary post types, a static route map block for offline readers, and print-optimised travelogue layouts.`,
    price: 11.95,
    originalPrice: 29.00,
    hasTrial: true,
    trialDuration: '7 Days Free Trial',
    trialDownloadUrl: '/download/traveltrove-7day-trial.zip',
    buyUrl: 'https://gumroad.com/l/traveltrove-blogger-template',
    rating: 4.93,
    reviewCount: 57,
    salesCount: 640,
    version: 'v1.2.0',
    releaseDate: '2026-02-14',
    lastUpdated: '2026-10-01',
    category: 'Magazine',
    tags: ['Travel', 'Photo Blog', 'Gallery', 'Itinerary', '7-Day Trial', 'AdSense Ready'],
    columns: '3 Columns',
    layout: 'Magazine',
    pageSpeedScore: {
      mobile: 97,
      desktop: 99
    },
    thumbnail: '/images/traveltrove-thumb.svg',
    galleryImages: ['/images/traveltrove-thumb.svg'],
    liveDemoUrl: 'https://traveltrove-demo.blogspot.com',
    badge: 'HOT',
    rtlSupported: true,
    darkModeSupported: true,
    adsenseOptimized: true,
    seoReady: true,
    specifications: [
      { label: 'Template Platform', value: 'Google Blogger' },
      { label: 'Gallery Engine', value: 'Lazy-Loaded Masonry + Lightbox' },
      { label: 'Post Types', value: 'Standard, Itinerary, Photo Essay' }
    ],
    features: [
      {
        title: 'Photo-First Galleries',
        description: 'Edge-to-edge masonry grids that stay fast with hundreds of images.',
        iconName: 'Layers',
        isHighlight: true
      },
      {
        title: 'Offline Route Maps',
        description: 'Itinerary posts embed a static map that works without a connection.',
        iconName: 'Layout'
      }
    ],
    demos: [
      {
        id: 'traveltrove-adventure',
        title: 'Adventure Blog Demo',
        slug: 'traveltrove-adventure',
        description: 'Full-bleed trip recaps with photo essays and route maps.',
        thumbnail: '/images/traveltrove-thumb.svg',
        demoUrl: 'https://traveltrove-demo.blogspot.com',
        category: 'Adventure',
        badge: 'DEFAULT'
      },
      {
        id: 'traveltrove-city',
        title: 'City Guide Demo',
        slug: 'traveltrove-city',
        description: 'Dense neighbourhood guides with itinerary blocks and maps.',
        thumbnail: '/images/traveltrove-thumb.svg',
        demoUrl: 'https://traveltrove-city.blogspot.com',
        category: 'City Guides',
        badge: 'NEW'
      }
    ],
    comparisonTable: [
      { feature: 'Core Layout & Galleries', trial: true, active: true },
      { feature: 'Route Map Post Type', trial: true, active: true },
      { feature: 'Remove Footer Credits', trial: false, active: true },
      { feature: 'Evaluation Period', trial: '7 Days Free Trial', active: 'Permanent Lifetime Access' },
      { feature: 'Permanent Activation (No Expiration)', trial: false, active: true }
    ],
    reviews: [
      {
        id: 'traveltrove-r1',
        author: 'Marcus L.',
        rating: 5,
        date: 'September 28, 2026',
        comment: 'I post 40+ photos a trip and this is the first Blogger theme that has not made my pages crawl. Gallery performance is excellent.',
        verifiedPurchase: true
      },
      {
        id: 'traveltrove-r2',
        author: 'Aisha R.',
        rating: 5,
        date: 'September 3, 2026',
        comment: 'The itinerary post type saved me hours per trip. Buyers on my travel Facebook group keep asking which theme I use.',
        verifiedPurchase: true
      }
    ]
  }
];
