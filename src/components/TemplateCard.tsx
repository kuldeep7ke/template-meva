import type { FC } from 'react';
import { Star, Eye, ArrowRight, Clock } from 'lucide-react';
import type { Template } from '../types';

interface TemplateCardProps {
  template: Template;
  navigate: (to: string) => void;
}

export const TemplateCard: FC<TemplateCardProps> = ({ template, navigate }) => {
  const discount = template.originalPrice > template.price
    ? Math.round((1 - template.price / template.originalPrice) * 100)
    : 0;

  return (
    <article className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 hover:border-indigo-400/70 shadow-xs hover:shadow-xl transition-all duration-300 aspect-[3/4] flex flex-col">
      {/* Full-bleed preview */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => navigate(`/template/${template.slug}`)}
      >
        <img
          src={template.thumbnail}
          alt={template.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Top floating chips */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
        <div className="flex flex-wrap gap-1.5">
          {template.badge && (
            <span className={`px-2 py-1 text-[11px] font-black tracking-wide rounded-md text-white shadow-sm ${
              template.badge === 'BESTSELLER' ? 'bg-amber-500' :
              template.badge === 'HOT' ? 'bg-rose-500' :
              template.badge === 'NEW' ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}>
              {template.badge}
            </span>
          )}
          <span className="px-2 py-1 text-[11px] font-bold rounded-md bg-slate-950/80 text-white backdrop-blur-xs">
            {template.category}
          </span>
        </div>
        <div className="bg-white text-slate-950 rounded-xl shadow-lg px-3 py-1.5 text-right shrink-0">
          <div className="text-sm font-black leading-none">${template.price.toFixed(2)}</div>
          {template.originalPrice > template.price && (
            <div className="text-[10px] font-bold text-slate-400 leading-none mt-0.5">
              <span className="line-through">${template.originalPrice.toFixed(2)}</span>
              {discount > 0 && <span className="text-emerald-600 ml-1">-{discount}%</span>}
            </div>
          )}
        </div>
      </div>

      {template.hasTrial && (
        <div className="absolute top-16 right-3 z-10">
          {/* The trial badge and the trial download belong together. The card
              advertised a 7-day trial with no way to get it, which sent the buyer
              to the detail page for something the card had already promised.
              An `<a download>` is deliberate, not a navigate(): the trial archive
              is a file, and routing it through the SPA would render a template
              detail page for a .zip. */}
          <a
            href={template.trialDownloadUrl}
            download
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-400/95 hover:bg-amber-300 text-slate-950 text-[11px] font-bold shadow-sm cursor-pointer"
            title={`Download the ${template.trialDuration || '7-day free trial'}`}
          >
            <Clock className="w-3 h-3" />
            <span>Get Trial</span>
          </a>
        </div>
      )}

      {/* Bottom gradient info */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-16 p-5 mt-auto">
        {/* A product with no reviews has no rating, and "0.0 (0)" is a worse thing to
            show a buyer than "New". Only render the figures that exist. */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          {template.reviewCount > 0 ? (
            <>
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-amber-300">{template.rating.toFixed(1)} ({template.reviewCount})</span>
            </>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[10px] font-black tracking-wide">
              NEW
            </span>
          )}
          {template.salesCount > 0 && (
            <span className="text-slate-400">• {template.salesCount.toLocaleString()} sales</span>
          )}
          <span className="text-slate-400 ml-auto">v{template.version}</span>
        </div>

        <h3
          onClick={() => navigate(`/template/${template.slug}`)}
          className="text-white font-black text-lg leading-tight mt-1 line-clamp-2 cursor-pointer group-hover:text-indigo-200 transition-colors"
        >
          {template.title}
        </h3>
        <p className="text-slate-300/90 text-xs leading-relaxed line-clamp-2 mt-1">
          {template.tagline}
        </p>

        {/* The PageSpeed chip appears only when measured -- a product with no
            measurement must not inherit the "98" the fixtures invented. Dark Mode
            and AdSense are capabilities, not measurements, so they are unaffected. */}
        {(template.pageSpeedScore.mobile > 0 || template.darkModeSupported || template.adsenseOptimized) && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {template.pageSpeedScore.mobile > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10">
              ⚡ {template.pageSpeedScore.mobile} PageSpeed
            </span>
          )}
          {template.darkModeSupported && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/10">
              Dark Mode
            </span>
          )}
          {template.adsenseOptimized && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-400/15 text-emerald-300 border border-emerald-300/20">
              AdSense
            </span>
          )}
        </div>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/preview/${template.slug}`);
            }}
            className="flex-1 px-3 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => navigate(`/template/${template.slug}`)}
            className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};