import { useState, type FC } from 'react';
import { 
  Menu, X, ChevronDown, BookOpen, Key, Download, HelpCircle, 
  Layers, Mail, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { CATEGORIES } from '../data/siteConfig';
import { MULTI_DEMO_TEMPLATES, FEATURED_TEMPLATES } from '../data/templates';

interface NavbarProps {
  currentPath: string;
  navigate: (to: string) => void;
}

/**
 * The navbar is for navigation only. Search lives in the hero on the store
 * page, where it filters the catalog grid directly below it — keeping a
 * second entry point here cost header width and fought with the nav links.
 */
export const Navbar: FC<NavbarProps> = ({ 
  currentPath, 
  navigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsDropdownOpen, setDocsDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setDocsDropdownOpen(false);
    setCategoriesDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-white">Cloudflare Edge Powered</span>
            <span>— Ultra-fast loading speeds & 99+ Core Web Vitals Blogger templates</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => handleNav('/unlicensed')} 
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Trial / Unlicensed Notice Demo</span>
            </button>
            <span>•</span>
            <button 
              onClick={() => handleNav('/docs/activation')} 
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>Licence Activation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* `gap` + `shrink-0` on both clusters keeps the nav links from being
            squeezed against the search field at narrow desktop widths. */}
        <div className="flex items-center justify-between gap-4 h-20">
          
          {/* Brand Logo + nav cluster. The logo is `shrink-0` so it never gets
              squeezed away; the nav beside it is allowed to be the flexible part. */}
          <div className="flex items-center gap-8 min-w-0">
            <button 
              onClick={() => handleNav('/')} 
              className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
            >
              <img 
                src="/logo.svg" 
                alt="TemplateMeva" 
                className="h-10 w-auto shrink-0 group-hover:scale-105 transition-transform" 
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleNav('/')}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  currentPath === '/' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              >
                Store Gallery
              </button>

              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                aria-haspopup="true"
                aria-expanded={categoriesDropdownOpen}
              >
                  Categories
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {CATEGORIES.slice(1).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleNav(`/?category=${encodeURIComponent(cat)}`)}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors flex items-center justify-between"
                      >
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Showcase Hub -- points at whichever listed product actually
                  ships multiple demos, rather than a hardcoded slug the catalog
                  gate can withdraw. */}
              {MULTI_DEMO_TEMPLATES[0] && (
              <button
                onClick={() => handleNav(`/showcase/${MULTI_DEMO_TEMPLATES[0].slug}`)}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  currentPath.includes('/showcase')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Multi-Demo Hub</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">New</span>
              </button>
              )}

              {/* Help Docs Dropdown (Installation & Activation common guide) */}
              <div 
                className="relative"
                onMouseEnter={() => setDocsDropdownOpen(true)}
                onMouseLeave={() => setDocsDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNav('/docs')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${
                    currentPath.startsWith('/docs')
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <span>Help Docs</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {docsDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Standard Guides
                    </div>
                    <button
                      onClick={() => handleNav('/docs/installation')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2.5"
                    >
                      <Download className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="font-semibold">Installation Guide</div>
                        <div className="text-xs text-slate-500 font-normal">How to upload XML to Blogger</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNav('/docs/activation')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2.5"
                    >
                      <Key className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="font-semibold">Activation & License</div>
                        <div className="text-xs text-slate-500 font-normal">Domain verify & unlock credits</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNav('/docs/customization')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2.5"
                    >
                      <Layers className="w-4 h-4 text-cyan-600" />
                      <div>
                        <div className="font-semibold">Customization & Menus</div>
                        <div className="text-xs text-slate-500 font-normal">Logo, mega menu & colors</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNav('/docs/troubleshooting')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2.5"
                    >
                      <HelpCircle className="w-4 h-4 text-rose-500" />
                      <div>
                        <div className="font-semibold">Troubleshooting & FAQ</div>
                        <div className="text-xs text-slate-500 font-normal">Fix save errors & redirects</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Link — `ml` on the wrapper (not padding on the button) keeps the
                  hover pill visually detached from the search icon beside it. */}
              <span className="ml-2 shrink-0">
                <button
                  onClick={() => handleNav('/contact')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    currentPath === '/contact'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>Contact & Notes</span>
                </button>
              </span>
            </nav>
          </div>

          {/* Right Actions. The flagship CTA resolves through the catalog too, so it
              cannot advertise a product the store has withdrawn. */}
          <div className="hidden md:flex items-center gap-3 shrink-0 lg:ml-4 lg:pl-5 lg:border-l lg:border-slate-200">
            {FEATURED_TEMPLATES[0] && (
            <button
              onClick={() => handleNav(`/templates/${FEATURED_TEMPLATES[0].slug}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Get {FEATURED_TEMPLATES[0].title.replace(/ Blogger Template$/, '')}</span>
            </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200">
          <button
            onClick={() => handleNav('/')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Store Gallery
          </button>
          {MULTI_DEMO_TEMPLATES[0] && (
          <button
            onClick={() => handleNav(`/showcase/${MULTI_DEMO_TEMPLATES[0].slug}`)}
            className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-between"
          >
            <span>Multi-Demo Showcase</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">New</span>
          </button>
          )}

          {/* Inset divider — a full-bleed rule reads as a stray horizontal line
              across the drawer, so it is kept inside the content gutter. */}
          <div className="pt-2 mt-2">
            <div className="h-px bg-slate-100 mx-3" role="presentation" />
            <div className="text-xs font-bold text-slate-400 uppercase px-3 pt-3 pb-1">Help Documentation</div>
            <button
              onClick={() => handleNav('/docs/installation')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-indigo-500" />
              <span>Installation Guide</span>
            </button>
            <button
              onClick={() => handleNav('/docs/activation')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
            >
              <Key className="w-4 h-4 text-amber-500" />
              <span>Serial & Activation</span>
            </button>
            <button
              onClick={() => handleNav('/docs/troubleshooting')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-rose-500" />
              <span>Troubleshooting & FAQs</span>
            </button>
          </div>

          <div className="pt-2 mt-2">
            <div className="h-px bg-slate-100 mx-3 mb-2" role="presentation" />
            <button
              onClick={() => handleNav('/unlicensed')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Unlicensed Notice Page (Demo)</span>
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Contact & Notes</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
