import { useState, useMemo, type FC } from 'react';
import { 
  Search, SlidersHorizontal, ArrowRight, ShieldCheck, 
  ExternalLink, Layers, CheckCircle2, ChevronRight,
  TrendingUp, Users, Award
} from 'lucide-react';
import { LISTED_TEMPLATES, MULTI_DEMO_TEMPLATES } from '../data/templates';
import { CATEGORIES, SORT_OPTIONS } from '../data/siteConfig';
import { TemplateCard } from '../components/TemplateCard';
import { AnimatedIcon } from '../components/AnimatedIcon';

const ALL_CATEGORIES = CATEGORIES[0];

interface HomeGalleryProps {
  navigate: (to: string) => void;
  selectedCategoryFromUrl?: string;
  /** Navbar-owned search text, shared so the header input drives this catalog. */
  initialSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
}

export const HomeGallery: FC<HomeGalleryProps> = ({
  navigate,
  selectedCategoryFromUrl,
  initialSearchQuery = '',
  onSearchQueryChange,
}) => {
  // Category is derived from the URL so deep links and the pill row stay in sync
  // without an effect that would re-render the whole catalog on every navigation.
  const selectedCategory =
    selectedCategoryFromUrl && CATEGORIES.includes(selectedCategoryFromUrl)
      ? selectedCategoryFromUrl
      : ALL_CATEGORIES;

  const searchQuery = initialSearchQuery;
  const setSearchQuery = (query: string) => onSearchQueryChange?.(query);
  const [selectedSort, setSelectedSort] = useState<string>('popular');
  const [selectedColumnFilter, setSelectedColumnFilter] = useState<string>('all');
  const [onlyTrial, setOnlyTrial] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredTemplates = useMemo(() => {
    return LISTED_TEMPLATES.filter((tpl) => {
      // Category match
      if (selectedCategory !== 'All Templates' && tpl.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tpl.title.toLowerCase().includes(q);
        const matchesTagline = tpl.tagline.toLowerCase().includes(q);
        const matchesTags = tpl.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesTagline && !matchesTags) return false;
      }
      // Columns filter
      if (selectedColumnFilter !== 'all' && tpl.columns !== selectedColumnFilter) {
        return false;
      }
      // Trial filter
      if (onlyTrial && !tpl.hasTrial) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'popular') return b.salesCount - a.salesCount;
      if (selectedSort === 'rating') return b.rating - a.rating;
      if (selectedSort === 'newest') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, searchQuery, selectedSort, selectedColumnFilter, onlyTrial]);

  // The featured banner is a real product reference, so it must survive the catalog
  // gate: if the flagship is not published the banner is dropped rather than
  // advertising a product the store will not sell.
  const spotlightTemplate = LISTED_TEMPLATES.find(t => t.slug === 'spotlight');

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white pt-20 pb-24">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-300 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>2026 Ready — Google Blogger XML v3 Architecture</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            High-Performance <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">Blogger Templates</span> Crafted for Publishers
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Turn your free Google Blogspot website into an ultra-fast, high-earning media portal. 99+ Core Web Vitals, pre-styled AdSense slots, and zero encrypted scripts.
          </p>

          {/* Hero Search Box */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by niche (e.g. Magazine, Tech, Minimal, Recipe)..."
                className="w-full px-3 py-3 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-hidden"
              />
              <button
                onClick={() => {
                  // Scroll to the catalog grid so the button actually does something.
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                Find Templates
              </button>
            </div>

            {/* Quick Keyword Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Popular:</span>
              {['Spotlight Magazine', 'SmartMag Multi-Demo', 'Tech Gadget', 'Dark Mode', 'RTL Arabic'].map((kw) => (
                <button
                  key={kw}
                  onClick={() => setSearchQuery(kw.split(' ')[0])}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          {/* Live Metrics Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10 text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/5">
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white">99 / 100</div>
                <div className="text-xs text-slate-400">PageSpeed Mobile</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/5">
              <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white">12,500+</div>
                <div className="text-xs text-slate-400">Active Bloggers</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/5">
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white">4.96 / 5.0</div>
                <div className="text-xs text-slate-400">Customer Rating</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-xs border border-white/5">
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-white">100%</div>
                <div className="text-xs text-slate-400">Clean Blogger XML</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Spotlight Banner — rendered only while the flagship is published */}
      {spotlightTemplate && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white">
                FEATURED FLAGSHIP
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Spotlight {spotlightTemplate.version}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {spotlightTemplate.title} — {spotlightTemplate.tagline}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {spotlightTemplate.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/templates/spotlight')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>View Full Spotlight Specs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/preview/spotlight')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                <span>Responsive Live Demo</span>
              </button>
              {spotlightTemplate.demos.length > 1 && (
                <button
                  onClick={() => navigate(`/showcase/${spotlightTemplate.slug}`)}
                  className="px-5 py-2.5 border border-emerald-300 text-emerald-800 bg-emerald-50/50 hover:bg-emerald-100 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Multi-Demo Showcase</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 relative group cursor-pointer" onClick={() => navigate(`/templates/${spotlightTemplate.slug}`)}>
            <div className="aspect-16/10 rounded-xl overflow-hidden shadow-lg border border-slate-200 relative bg-slate-900">
              <img
                src={spotlightTemplate.thumbnail}
                alt={spotlightTemplate.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white">
                  <span className="text-xs font-bold text-amber-400">
                    PageSpeed {spotlightTemplate.pageSpeedScore.mobile}/100 mobile
                  </span>
                  <h4 className="text-base font-bold">{spotlightTemplate.title}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Main Catalog Store Area */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore All Blogger Templates
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select from our curated collection of responsive, SEO-ready templates for your niche.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredTemplates.length}</span> of {LISTED_TEMPLATES.length} templates
          </div>
        </div>

        {/* Filter Bar (desktop only — hidden on mobile for a cleaner view) */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs space-y-4">
          
          {/* Categories Pill Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  // Keep the active category in the URL so it is shareable and survives reload.
                  if (cat === ALL_CATEGORIES) {
                    navigate('/');
                  } else {
                    navigate(`/?category=${encodeURIComponent(cat)}`);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </span>

              {/* Column Layout Filter */}
              <select
                value={selectedColumnFilter}
                onChange={(e) => setSelectedColumnFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">All Column Layouts</option>
                <option value="2 Columns">2 Columns</option>
                <option value="3 Columns">3 Columns</option>
                <option value="Grid / Masonry">Grid / Masonry</option>
              </select>

              {/* Trial Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={onlyTrial}
                  onChange={(e) => setOnlyTrial(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Includes 7-Day Free Trial</span>
              </label>
            </div>

            {/* Sorting Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Bar — the desktop panel is hidden below `md`, which
            otherwise leaves mobile users with no way to filter or sort at all. */}
        <div className="md:hidden bg-white rounded-2xl border border-slate-200 p-3 mb-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <label htmlFor="mobile-category" className="text-xs font-bold text-slate-500 shrink-0">
              Category
            </label>
            <select
              id="mobile-category"
              value={selectedCategory}
              onChange={(e) => {
                const cat = e.target.value;
                if (cat === ALL_CATEGORIES) {
                  navigate('/');
                } else {
                  navigate(`/?category=${encodeURIComponent(cat)}`);
                }
              }}
              className="flex-1 min-w-0 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:border-indigo-400 focus:outline-hidden"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="mobile-sort" className="text-xs font-bold text-slate-500 shrink-0">
              Sort by
            </label>
            <select
              id="mobile-sort"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium focus:border-indigo-400 focus:outline-hidden"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Template Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                navigate={navigate} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No templates matched your filter criteria.</p>
            <button
              onClick={() => {
                navigate('/');
                setSearchQuery('');
                setSelectedColumnFilter('all');
                setOnlyTrial(false);
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* Feature Showcase: Why TemplateMeva with Animated Icons */}
      <section className="bg-white py-20 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Engineered for Blogger
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Why 10,000+ Publishers Choose TemplateMeva
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-3">
              We eliminate the common pitfalls of slow Blogger templates. Clean, semantic XML code that loads instantly and ranks on Google.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                <AnimatedIcon type="rocket" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">99+ Google PageSpeed Score</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Minified CSS, lazy-loaded thumbnails, and zero third-party render-blocking scripts ensure your website passes Google Core Web Vitals on mobile and desktop.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                <AnimatedIcon type="shield" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Clean XML & No Encrypted Code</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Unlike untrusted sites with hidden redirects, our templates are 100% human-readable XML. Complete peace of mind for your domain and security.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6">
                <AnimatedIcon type="device" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">True Responsive & Retina Ready</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pixel-perfect presentation across iPhones, iPads, Android tablets, laptops, and 4K displays. Touch-friendly menus and readable typography everywhere.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                <AnimatedIcon type="zap" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Google AdSense Auto & In-Feed Ads</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Strategically tested ad placement slots designed to maximize revenue (RPM) while maintaining a clean, high-retention reading experience.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                <AnimatedIcon type="star" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Schema.org JSON-LD Rich Snippets</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Includes NewsArticle, BreadcrumbList, and Author profile structured data so Google search indexes your articles with star ratings and rich cards.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-all hover:shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                <AnimatedIcon type="lock" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">One-Click License Activation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Simple license verification unlocks 100% white-label freedom, removes trial footer credits, and grants lifetime updates and priority customer support.
              </p>
            </div>

          </div>

        </div>
      </section>

{/* Multi-Demo Callout Banner -- only while a listed product actually has
          concept demos to advertise. */}
      {MULTI_DEMO_TEMPLATES[0] && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white border border-emerald-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Concept Feature</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              Explore {MULTI_DEMO_TEMPLATES[0].title} Multi-Demo Showcase
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {MULTI_DEMO_TEMPLATES[0].demos.length} distinct concept demos ship inside this one
              template. Browse each one before picking the layout for your audience.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate(`/showcase/${MULTI_DEMO_TEMPLATES[0].slug}`)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Open Multi-Demo Showcase Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="w-full md:w-80 shrink-0">
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-emerald-500/30 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Concepts Included</div>
              <div className="space-y-2 text-xs text-slate-200">
                {MULTI_DEMO_TEMPLATES[0].demos.map((demo) => (
                  <div key={demo.id} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{demo.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

    </div>
  );
};
