import { useState, type FC } from 'react';
import { 
  ArrowLeft, ExternalLink, ShoppingBag, Eye,
  Sliders, Star, Sparkles, BookOpen
} from 'lucide-react';
import { TEMPLATES } from '../data/templates';

interface DemoShowcaseHubProps {
  slug: string;
  navigate: (to: string) => void;
}

export const DemoShowcaseHub: FC<DemoShowcaseHubProps> = ({ slug, navigate }) => {
  const [selectedDemoCategory, setSelectedDemoCategory] = useState<string>('All');

  // Match template, defaulting to SmartMag or Spotlight
  const template = TEMPLATES.find((t) => t.slug === slug) || 
                   TEMPLATES.find((t) => t.slug === 'smartmag') || 
                   TEMPLATES[0];

  const demoCategories = ['All', ...Array.from(new Set(template.demos.map(d => d.category)))];

  const filteredDemos = selectedDemoCategory === 'All' 
    ? template.demos 
    : template.demos.filter(d => d.category === selectedDemoCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      
      {/* Top Floating Showcase Navigation Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/template/${template.slug}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Template Details</span>
          </button>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white">{template.title}</span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
              v{template.version} Showcase
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/docs/installation')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Docs</span>
          </button>

          <a
            href={template.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Template (${template.price.toFixed(2)})</span>
          </a>
        </div>
      </div>

      {/* Hero Showcase Header (SmartMag style) */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Concept Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Explore Pre-Built Demos for <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
            {template.title}
          </span>
        </h1>

        <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          One template, infinite possibilities. Click any concept demo below to launch and explore the live Blogger implementation in real-time.
        </p>

        {/* Demo Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {demoCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedDemoCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDemoCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat} Concepts
            </button>
          ))}
        </div>
      </section>

      {/* Demos Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDemos.map((demo) => (
            <div 
              key={demo.id}
              className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
                <img
                  src={demo.thumbnail}
                  alt={demo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {demo.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 shadow-sm">
                    {demo.badge}
                  </span>
                )}

                {/* Quick Action — always visible below `md` so touch users are not
                    locked out of the demo links, hover-revealed on desktop. */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                  <a
                    href={demo.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 text-xs font-black rounded-lg shadow-lg flex items-center gap-1.5 transition-transform"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Launch Live Demo</span>
                  </a>
                  <button
                    onClick={() => navigate(`/preview/${template.slug}`)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white text-xs font-bold rounded-lg border border-slate-700 transition-transform cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Device Test</span>
                  </button>
                </div>
              </div>

              {/* Demo Meta */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="text-emerald-400 font-semibold">{demo.category} Edition</span>
                    <span>Blogger XML Layout</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {demo.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {demo.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <a
                    href={demo.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Open Demo on Blogger</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => navigate(`/template/${template.slug}`)}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Specs &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights & Modules Section (SmartMag style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Smart Architecture
          </span>
          <h2 className="text-3xl font-black text-white mt-3">
            Core Modules Built Right Into the Template
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            No messy plugins or third-party servers required. Everything runs inside Google Blogger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Custom Mega Menu Layouts</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Auto-generate recent posts and thumbnail grids directly under navigation links using Blogger labels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Star className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Infinite Scroll & Ajax Pagination</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamlessly load subsequent articles without page reloads to maximize session duration and ad impressions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">AdSense & Native Ad Widgets</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built-in placements for leaderboard 728x90, middle post ads, sidebar sticky banners, and sticky bottom bars.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-10 border border-indigo-500/30 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Build Your Website with {template.title}?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Get instant access to all {template.demos.length} concept demos, detailed documentation, and lifetime version updates.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <a
              href={template.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Get Lifetime License (${template.price.toFixed(2)})</span>
            </a>
            <button
              onClick={() => navigate(`/template/${template.slug}`)}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <span>View Full Features & Specs</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
