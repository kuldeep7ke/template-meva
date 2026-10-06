import { useState, type FC } from 'react';
import { 
  BookOpen, Download, Key, Layers, HelpCircle, 
  Search, Check, Copy, ArrowRight, Mail
} from 'lucide-react';
import { DOCS_ARTICLES } from '../data/docs';

interface HelpDocsProps {
  initialSlug?: string;
  navigate: (to: string) => void;
}

export const HelpDocs: FC<HelpDocsProps> = ({ initialSlug = 'installation', navigate }) => {
  const [searchDocQuery, setSearchDocQuery] = useState<string>('');
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  // The route owns the selected article; unknown slugs fall back to the first guide.
  const currentArticle =
    DOCS_ARTICLES.find((a) => a.slug === initialSlug) ?? DOCS_ARTICLES[0];
  const selectedSlug = currentArticle.slug;
  const currentIndex = DOCS_ARTICLES.findIndex((a) => a.slug === selectedSlug);
  const prevArticle = currentIndex > 0 ? DOCS_ARTICLES[currentIndex - 1] : null;

  const filteredArticles = DOCS_ARTICLES.filter((a) => {
    if (!searchDocQuery.trim()) return true;
    const q = searchDocQuery.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
  });

  const handleCopyCode = async (code: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 2500);
    } catch {
      // Clipboard access can be blocked (insecure origin or denied permission).
      setCopiedCodeIdx(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Installation': return <Download className="w-4 h-4 text-indigo-500" />;
      case 'Activation': return <Key className="w-4 h-4 text-amber-500" />;
      case 'Customization': return <Layers className="w-4 h-4 text-cyan-500" />;
      case 'Troubleshooting':
      default: return <HelpCircle className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Universal Blogger Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Blogger Help & Documentation Center
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Comprehensive setup, installation, activation, and customization guides common to all TemplateMeva Blogger templates.
          </p>

          {/* Search Docs Input */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search help topics (e.g. restore xml, license key)..."
              value={searchDocQuery}
              onChange={(e) => setSearchDocQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Main Documentation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Documentation Guides
            </h3>
            <div className="space-y-1 mt-1">
              {filteredArticles.map((art) => {
                const isActive = art.slug === selectedSlug;
                return (
                  <button
                    key={art.id}
                    onClick={() => navigate(`/docs/${art.slug}`)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200/80 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200/80 shrink-0 mt-0.5">
                      {getCategoryIcon(art.category)}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs leading-snug">{art.title}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {art.category} • {art.readingTime}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Need More Assistance Card */}
            <div className="mt-6 pt-4 border-t border-slate-100 p-3 bg-slate-50 rounded-xl text-xs space-y-2">
              <span className="font-bold text-slate-800 block">Still Need Help?</span>
              <p className="text-slate-500 text-[11px]">
                Our dedicated support team is available 6 days a week to help with custom installations.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Support</span>
              </button>
            </div>
          </div>

          {/* Right Main Article Content */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            
            {/* Article Header */}
            <div className="border-b border-slate-100 pb-6 mb-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-2">
                <span>{currentArticle.category}</span>
                <span>•</span>
                <span className="text-slate-400">Updated: {currentArticle.updatedAt}</span>
                <span>•</span>
                <span className="text-slate-400">{currentArticle.readingTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {currentArticle.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {currentArticle.excerpt}
              </p>
            </div>

            {/* Article Steps */}
            <div className="space-y-8">
              {currentArticle.steps.map((step, idx) => (
                <div key={idx} className="relative pl-0 sm:pl-10">
                  {/* Step Number Badge */}
                  <div className="hidden sm:flex absolute left-0 top-0 w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs items-center justify-center">
                    {step.stepNumber}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span className="sm:hidden inline-flex w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <span>{step.title}</span>
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {step.content}
                    </p>

                    {/* Optional Code Snippet */}
                    {step.codeSnippet && (
                      <div className="mt-3 bg-slate-950 rounded-xl p-4 text-xs font-mono text-emerald-400 relative overflow-x-auto border border-slate-800">
                        <button
                          onClick={() => handleCopyCode(step.codeSnippet!, idx)}
                          className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedCodeIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <pre className="pr-16">{step.codeSnippet}</pre>
                      </div>
                    )}

                    {/* Optional Tip */}
                    {step.tip && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-start gap-2.5">
                        <span className="font-bold text-indigo-700">💡 Pro Tip:</span>
                        <span>{step.tip}</span>
                      </div>
                    )}

                    {/* Optional Warning */}
                    {step.warning && (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                        <span className="font-bold text-amber-700">⚠️ Note:</span>
                        <span>{step.warning}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Next/Prev Guide Navigator */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
              {prevArticle ? (
                <button
                  onClick={() => navigate(`/docs/${prevArticle.slug}`)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 cursor-pointer text-left"
                >
                  &larr; {prevArticle.title}
                </button>
              ) : (
                <span />
              )}

              <button
                onClick={() => navigate('/templates/spotlight')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All Templates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
