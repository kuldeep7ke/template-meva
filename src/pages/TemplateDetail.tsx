import { useState, type FC } from 'react';
import {
  Star, Eye, Download, ShoppingBag, CheckCircle2, PackageX,
  ExternalLink, Layers, ArrowLeft,
  Share2, Check, Smartphone, Moon, DollarSign, Search,
  Sliders, MessageSquare, Zap, BookOpen, Clock, Key
} from 'lucide-react';
import { findListed, LISTED_TEMPLATES } from '../data/templates';
import { TrialVsActiveTable } from '../components/TrialVsActiveTable';
import { TemplateCard } from '../components/TemplateCard';

interface TemplateDetailProps {
  slug: string;
  navigate: (to: string) => void;
}

export const TemplateDetail: FC<TemplateDetailProps> = ({ slug, navigate }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'specs' | 'reviews'>('overview');

  // An unpublished slug must not fall back to some other product: that is how a
  // draft or placeholder page ends up showing a real product's price and reviews
  // under the wrong URL.
  const template = findListed(slug);

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white rounded-2xl border border-slate-200 p-10 shadow-xs">
          <PackageX className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <h1 className="text-xl font-black text-slate-900 mb-2">This template is not published</h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            <span className="font-mono text-xs">{slug}</span> is registered but not on sale, or does not
            exist. Products appear here once they are published.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl cursor-pointer"
          >
            Back to the store
          </button>
        </div>
      </div>
    );
  }

  const relatedTemplates = LISTED_TEMPLATES.filter((t) => t.id !== template.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-600" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5 text-emerald-600" />;
      case 'Search': return <Search className="w-5 h-5 text-sky-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Layout': return <Layers className="w-5 h-5 text-purple-600" />;
      case 'Sliders': return <Sliders className="w-5 h-5 text-cyan-600" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-rose-500" />;
      case 'Star': return <Star className="w-5 h-5 text-amber-500" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-600" />;
      default: return <CheckCircle2 className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="hover:text-indigo-600 font-medium cursor-pointer">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/')} className="hover:text-indigo-600 font-medium cursor-pointer">Templates</button>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs">{template.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button onClick={() => navigate('/')} className="hidden sm:flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8">

            {/* Left: Title, Rating, Badges + Preview — column stretches so the preview fills all remaining vertical space */}
            <div className="flex-1 lg:flex lg:flex-col lg:self-stretch">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {template.category}
                </span>
                {template.badge && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-amber-500 text-white shadow-xs">
                    {template.badge}
                  </span>
                )}
                {template.hasTrial && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {template.trialDuration}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
                  PageSpeed {template.pageSpeedScore.desktop}/100
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {template.title}
              </h1>
              <p className="mt-2 text-base text-slate-600 max-w-3xl leading-relaxed">
                {template.tagline}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                  <span className="font-bold text-slate-800 ml-1">{template.rating.toFixed(2)}</span>
                  <span>({template.reviewCount} reviews)</span>
                </div>
                <span>•</span>
                <span className="font-medium text-slate-700">
                  {template.salesCount.toLocaleString()} active users
                </span>
                <span>•</span>
                <span>Updated: {template.lastUpdated} (v{template.version})</span>
              </div>

              {/* Screenshot Preview — grows on large screens to fill the gap left by the taller buy-box column; keeps 16:9 on mobile */}
              <div className="mt-6 lg:flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 aspect-16/9 relative group">
                <img
                  src={template.thumbnail}
                  alt={template.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => navigate(`/preview/${template.slug}`)}
                    className="px-4 py-2 bg-slate-950/90 hover:bg-slate-950 text-white backdrop-blur-md rounded-xl text-xs font-bold shadow-xl border border-white/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                  >
                    <Eye className="w-4 h-4 text-indigo-400" />
                    <span>Launch Full Responsive Preview</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Buy Box + Trial Highlight */}
            <div className="lg:w-96 shrink-0">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-3xl font-black text-slate-900">${template.price.toFixed(2)}</span>
                  {template.originalPrice > template.price && (
                    <span className="text-sm text-slate-400 line-through ml-2">
                      ${template.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xs text-slate-500 block font-normal mt-0.5">
                    One-Time Lifetime Activation License
                  </span>
                </div>
                <span className="px-2 py-1 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  SAVE {Math.round(((template.originalPrice - template.price) / template.originalPrice) * 100)}%
                </span>
              </div>

              <div className="space-y-2.5">
                {/* Primary: Live Preview */}
                <button
                  onClick={() => navigate(`/preview/${template.slug}`)}
                  className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Live Preview (All Demos)</span>
                </button>

                {/* Multi-demo if available */}
                {template.demos.length > 1 && (
                  <button
                    onClick={() => navigate(`/showcase/${template.slug}`)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-indigo-500" />
                    <span>All {template.demos.length} Concept Demos</span>
                  </button>
                )}

                {/* Buy — primary CTA */}
                <a
                  href={template.buyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center block"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Activation License (${template.price.toFixed(2)})</span>
                </a>

                {/* Trial download — secondary */}
                {template.hasTrial && (
                  <a
                    href={template.trialDownloadUrl}
                    download
                    className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center block"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Start 7-Day Free Trial (No Login Needed)</span>
                  </a>
                )}
              </div>

              {/* Trust Checklist */}
              <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>7-Day trial — test on your blog, no credit card</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Instant digital download (.xml + full docs)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>One serial activates your blog permanently</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Lifetime updates & 24/7 priority support</span>
                </div>
              </div>

              {/* Activation quick tip */}
              <div className="mt-3 pt-3 border-t border-slate-200/70">
                <div className="flex items-start gap-2 text-[11px] text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                  <Key className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>How to activate:</strong> Paste your serial into the Blogger
                    Layout &rarr; <strong>Licence Activation</strong> gadget &rarr; Edit HTML.
                    Done in under 30 seconds.
                    <button onClick={() => navigate('/docs/activation')} className="block mt-0.5 underline font-bold text-indigo-600">
                      View Activation Guide →
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* 7-Day Trial Highlight Bar — snug under the buy box so the right column fills perfectly */}
            {template.hasTrial && (
              <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-900">
                    7-Day Free Trial Available — No Credit Card Required
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Download and install the trial on your Blogger blog today. All features work fully during the trial period. Paste your serial into the Licence Activation gadget at any time to activate permanently.
                  </p>
                  <a
                    href={template.trialDownloadUrl}
                    download
                    className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download 7-Day Trial (.xml)</span>
                  </a>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 sm:space-x-8 text-sm font-semibold overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'overview', label: 'Features & Overview' },
              { id: 'comparison', label: 'Trial vs. Activated' },
              { id: 'specs', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${template.reviewCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Bodies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-12">

            {/* Overview Text */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <h2 className="text-xl font-black text-slate-900 mb-4">Template Overview</h2>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {template.fullOverview}
              </div>
            </div>

            {/* Feature Grid */}
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {template.features.map((feat, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      {getFeatureIcon(feat.iconName)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{feat.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How Trial & Activation Works */}
            <div className="bg-gradient-to-r from-amber-50 via-white to-indigo-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h3 className="text-xl font-black text-slate-900 mb-6">How the 7-Day Trial & Activation Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Download the 7-Day Trial</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Download the trial XML file — no credit card or account required. Install it on your Blogger blog via Theme → Restore → Upload.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Test Everything for 7 Days</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All features — Dark Mode, Mega Menu, AdSense placements, Infinite Scroll, RTL — are fully enabled during the trial. Evaluate on real content with real traffic.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Activate with your serial</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Purchase your licence and paste your serial into the Blogger Layout &rarr; Licence Activation gadget. Done in under 30 seconds — no re-upload required.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/docs/activation')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Activation Guide →</span>
                </button>
                <button
                  onClick={() => navigate('/docs/installation')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Installation Guide →</span>
                </button>
                <button
                  onClick={() => navigate('/unlicensed')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>What happens after trial expires? →</span>
                </button>
              </div>
            </div>

            {/* Demos Showcase */}
            {template.demos.length > 0 && (
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-black">Pre-Built Concept Demos</h3>
                    <p className="text-xs text-slate-400 mt-1">All demos are available inside the trial and activated versions.</p>
                  </div>
                  <button
                    onClick={() => navigate(`/showcase/${template.slug}`)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 self-start cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Full Showcase Hub</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {template.demos.map((demo) => (
                    <div key={demo.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/80 group hover:border-indigo-400 transition-all flex flex-col">
                      <div className="aspect-16/10 bg-slate-950 relative overflow-hidden">
                        <img src={demo.thumbnail} alt={demo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {demo.badge && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded">{demo.badge}</span>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm mb-1">{demo.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{demo.description}</p>
                        </div>
                        <a
                          href={demo.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 w-full py-2 bg-slate-700 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 text-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Live Demo</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inline Trial vs Active Table */}
            <TrialVsActiveTable
              comparisonItems={template.comparisonTable}
              templatePrice={template.price}
              templateTitle={template.title}
              trialDuration={template.trialDuration}
              onDownloadTrial={() => { window.location.href = template.trialDownloadUrl; }}
              onBuyActive={() => { window.open(template.buyUrl, '_blank'); }}
            />

            {/* Docs CTA */}
            <div className="bg-indigo-50/70 rounded-2xl p-6 sm:p-8 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>Looking for setup or activation instructions?</span>
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  Common Installation & Activation Documentation
                </h4>
                <p className="text-xs text-slate-600 max-w-xl">
                  These guides apply to all TemplateMeva templates — learn how to upload the XML, activate your serial, setup your logo, and configure AdSense ad widgets.
                </p>
              </div>
              <button
                onClick={() => navigate('/docs/installation')}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Read Setup Guide
              </button>
            </div>
          </div>
        )}

        {/* TRIAL vs ACTIVE TAB */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <TrialVsActiveTable
              comparisonItems={template.comparisonTable}
              templatePrice={template.price}
              templateTitle={template.title}
              trialDuration={template.trialDuration}
              onDownloadTrial={() => { window.location.href = template.trialDownloadUrl; }}
              onBuyActive={() => { window.open(template.buyUrl, '_blank'); }}
            />

            {/* What happens when trial expires box */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-amber-900 text-xs space-y-3">
              <h4 className="font-bold text-sm flex items-center gap-1.5 text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
                What Happens When the 7-Day Trial Expires?
              </h4>
              <p>
                After 7 days without activation, the template displays a friendly activation notice to your blog visitors informing them the site owner is still setting up their theme. Your content remains online and accessible — the notice does not break your blog.
              </p>
              <p>
                To dismiss the notice and restore full operation, simply purchase your licence and paste your serial into the Blogger Layout &rarr; Licence Activation gadget. Activation is instant with no re-upload required.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <button onClick={() => navigate('/unlicensed')} className="font-bold text-amber-800 underline hover:text-amber-950">
                  See the trial expiry notice page →
                </button>
                <button onClick={() => navigate('/docs/activation')} className="font-bold text-indigo-700 underline hover:text-indigo-900">
                  License activation guide →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SPECS TAB */}
        {activeTab === 'specs' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-black text-slate-900 text-lg">Technical Specifications</h3>
              <p className="text-xs text-slate-500 mt-1">Compatibility, trial period, and architecture metadata</p>
            </div>
            <div className="divide-y divide-slate-100 text-sm">
              {template.specifications.map((spec, i) => (
                <div key={i} className="py-3.5 px-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <span className="font-bold text-slate-600 text-xs">{spec.label}</span>
                  <span className="sm:col-span-2 font-medium text-slate-900 text-xs">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-slate-900">{template.rating.toFixed(1)}</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Based on {template.reviewCount} verified buyer ratings</p>
              </div>
              <button
                onClick={() => alert('Please sign in with your verified purchase Order ID to leave a review.')}
                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Write a Review
              </button>
            </div>

            <div className="space-y-4">
              {template.reviews.length > 0 ? template.reviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{rev.author}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{rev.comment}</p>
                </div>
              )) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                  Be the first verified buyer to review {template.title}!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Related Templates */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">You May Also Like</h3>
              <p className="text-xs text-slate-500 mt-1">Other high-performance Blogger templates with 7-day trials</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTemplates.map((t) => (
              <TemplateCard key={t.id} template={t} navigate={navigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
