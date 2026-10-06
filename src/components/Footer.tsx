import { useState, type FC, type FormEvent } from 'react';
import {
  ShieldCheck, Heart, Send, CheckCircle2,
  HelpCircle, BookOpen, Key,
  Sparkles, LayoutGrid, LifeBuoy
} from 'lucide-react';
import { SITE_CONFIG, CATEGORIES } from '../data/siteConfig';

// Resolved once at module load so rendering stays pure and re-renders are stable.
const COPYRIGHT_YEAR = new Date().getFullYear();

interface FooterProps {
  navigate: (to: string) => void;
}

export const Footer: FC<FooterProps> = ({ navigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder capture — wire this to your mailing list provider before launch.
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Clean Code</h4>
              <p className="text-xs text-slate-400">Zero encrypted scripts or malicious bloat</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <span className="text-base font-black">99+</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Google PageSpeed</h4>
              <p className="text-xs text-slate-400">Optimized for Core Web Vitals pass rate</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Lifetime License</h4>
              <p className="text-xs text-slate-400">One-time payment with unlimited updates</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Expert assistance from theme creators</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 pb-12 border-b border-slate-800 items-stretch">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </span>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Why TemplateMeva</h4>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            TemplateMeva is the premier destination for high-speed, SEO-optimized, and AdSense-ready Google Blogger (Blogspot) themes. Built for ambitious publishers, editors, and bloggers worldwide.
          </p>

          {/* Newsletter Box */}
          <div className="pt-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Get Free Blogger Tips & Discounts</h5>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-sm text-white px-3 py-2 rounded-lg grow focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Join</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <div className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Thank you! Check your inbox for your 15% discount coupon.</span>
              </div>
            )}
          </div>
        </div>

        {/* Categories Column */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
            </span>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Categories</h4>
          </div>
          <ul className="space-y-2.5 text-sm">
            {CATEGORIES.slice(1).map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => navigate(`/?category=${encodeURIComponent(cat)}`)}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  {cat} Templates
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Documentation & Help Hub */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Help Center</h4>
          </div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                onClick={() => navigate('/docs/installation')}
                className="hover:text-indigo-400 transition-colors text-left"
              >
                Installation Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/docs/activation')}
                className="hover:text-indigo-400 transition-colors text-left"
              >
                License Activation
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/docs/customization')}
                className="hover:text-indigo-400 transition-colors text-left"
              >
                Header & Mega Menu
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/docs/adsense')}
                className="hover:text-indigo-400 transition-colors text-left"
              >
                Ads Placement Guide
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/docs/troubleshooting')}
                className="hover:text-indigo-400 transition-colors text-left"
              >
                Troubleshooting & Errors
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/showcase/smartmag')}
                className="text-emerald-400 hover:text-emerald-300 transition-colors text-left font-medium"
              >
                Multi-Demo Concepts
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Get Support</h4>
          </div>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={() => navigate('/contact')} className="hover:text-indigo-400 transition-colors text-left">
                Contact & Notes
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contact')} className="hover:text-indigo-400 transition-colors text-left">
                Request Trial Extension
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/unlicensed')}
                className="text-amber-400 hover:text-amber-300 transition-colors text-left font-medium"
              >
                Trial / Unlicensed Notice
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('/contact')}
                className="text-slate-300 hover:text-indigo-400 transition-colors text-left"
              >
                {SITE_CONFIG.workingHours}
              </button>
            </li>
            <li className="text-slate-400">
              <span>Anti-Piracy Policy</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span>&copy; {COPYRIGHT_YEAR} {SITE_CONFIG.siteName}. All Rights Reserved.</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline-flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the Blogger Community
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span>Accepted Payments:</span>
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-300">
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">PayPal</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Stripe</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Visa / MC</span>
            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
