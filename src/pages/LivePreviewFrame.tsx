import { useState, type FC } from 'react';
import { 
  Monitor, Tablet, Smartphone, X, ExternalLink, PackageX,
  ShoppingBag, ArrowLeft, RotateCw
} from 'lucide-react';
import { findListed } from '../data/templates';

interface LivePreviewFrameProps {
  slug: string;
  navigate: (to: string) => void;
}

export const LivePreviewFrame: FC<LivePreviewFrameProps> = ({ slug, navigate }) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  // Bumped on reload so the iframe actually re-fetches instead of being a no-op self-assign.
  const [reloadKey, setReloadKey] = useState(0);

  // Same rule as the other product pages: no fallback to an arbitrary template,
  // or a preview URL for one product would frame another product's demo.
  const template = findListed(slug);

  if (!template) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md text-center bg-slate-900 rounded-2xl border border-slate-800 p-10">
          <PackageX className="w-10 h-10 text-slate-600 mx-auto mb-4" />
          <h1 className="text-lg font-black text-white mb-2">No preview available</h1>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            <span className="font-mono">{slug}</span> is not published, or has no demo URL yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Back to the store
          </button>
        </div>
      </div>
    );
  }

  const getFrameWidth = () => {
    switch (deviceMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop':
      default: return '100%';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 overflow-hidden">
      
      {/* Top Bar Switcher Controls */}
      <div className="h-14 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
        
        {/* Left: Brand / Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/template/${template.slug}`)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Close Preview</span>
          </button>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-bold text-white">{template.title}</span>
            <span className="text-xs text-slate-400 font-normal">Live Blogger Demo</span>
          </div>
        </div>

        {/* Center: Responsive Device Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            title="Desktop View (100%)"
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            title="Tablet View (768px)"
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'tablet'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            title="Mobile View (375px)"
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <a
            href={template.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Remove frame and open directly in Blogger"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span>Remove Frame</span>
          </a>

          <a
            href={template.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy (${template.price.toFixed(2)})</span>
          </a>

          <button
            onClick={() => navigate(`/template/${template.slug}`)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Frame Body Area with dynamic width animation */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-auto">
        <div 
          className="h-full bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 relative border border-slate-800 flex flex-col"
          style={{ width: getFrameWidth(), maxWidth: '100%' }}
        >
          {/* Simulated Browser Address Bar for mobile/tablet */}
          {deviceMode !== 'desktop' && (
            <div className="h-8 bg-slate-100 border-b border-slate-200 px-3 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <span className="truncate max-w-[200px] text-slate-600 font-mono text-[10px]">
                {template.liveDemoUrl.replace('https://', '')}
              </span>
              <button 
                onClick={() => {
                  setIsIframeLoaded(false);
                  setReloadKey((k) => k + 1);
                }}
                title="Reload demo"
                className="hover:text-slate-900"
              >
                <RotateCw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Iframe embedding the Blogger template */}
          <iframe
            id="preview-iframe"
            // `key` forces a fresh mount, so reload genuinely re-requests the demo.
            key={`${template.slug}-${reloadKey}`}
            src={template.liveDemoUrl}
            title={`${template.title} Live Preview`}
            className="w-full flex-1 border-none"
            onLoad={() => setIsIframeLoaded(true)}
            onError={() => setIsIframeLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />

          {/* Fallback / Quick Open Info in case iframe loading is restricted by browser */}
          {!isIframeLoaded && (
            <div className="absolute inset-0 bg-slate-900/90 text-white flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
              <h3 className="font-bold text-base mb-1">Loading {template.title} Live Demo...</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                Fetching Blogger theme from Google servers. If the preview does not load due to iframe security, open it directly:
              </p>
              <a
                href={template.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Directly in New Tab</span>
              </a>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
