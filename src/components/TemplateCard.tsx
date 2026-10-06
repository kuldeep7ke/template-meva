import type { FC } from 'react';
import { Star, Eye, Layers, Check, ArrowRight, Clock } from 'lucide-react';
import type { Template } from '../types';

interface TemplateCardProps {
  template: Template;
  navigate: (to: string) => void;
}

export const TemplateCard: FC<TemplateCardProps> = ({ template, navigate }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">

      {/* Thumbnail Container */}
      <div
        className="relative aspect-16/10 bg-slate-900 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/template/${template.slug}`)}
      >
        <img
          src={template.thumbnail}
          alt={template.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {template.badge && (
            <span className={`px-2.5 py-0.5 text-[11px] font-black tracking-wide rounded-md text-white shadow-sm ${
              template.badge === 'BESTSELLER' ? 'bg-amber-500' :
              template.badge === 'HOT' ? 'bg-rose-500' :
              template.badge === 'NEW' ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}>
              {template.badge}
            </span>
          )}
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-slate-950/80 text-white backdrop-blur-xs">
            {template.category}
          </span>
        </div>

        {/* 7-Day Trial Badge */}
        {template.hasTrial && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[11px] font-bold backdrop-blur-xs shadow-sm">
              <Clock className="w-3 h-3" />
              <span>7-Day Trial</span>
            </div>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/preview/${template.slug}`);
            }}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Live Preview</span>
          </button>

          {template.demos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/showcase/${template.slug}`);
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{template.demos.length} Demos</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Version */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
              <span className="text-xs font-bold text-slate-800">{template.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">({template.reviewCount})</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              v{template.version}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => navigate(`/template/${template.slug}`)}
            className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer mb-1.5"
          >
            {template.title}
          </h3>

          {/* Tagline */}
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
            {template.tagline}
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {template.darkModeSupported && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Dark Mode
              </span>
            )}
            {template.rtlSupported && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                RTL Ready
              </span>
            )}
            {template.adsenseOptimized && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                AdSense Auto
              </span>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {template.columns}
            </span>
          </div>
        </div>

        {/* Pricing Footer */}
        <div className="pt-4 border-t border-slate-100">
          {/* 7-Day Trial CTA Row */}
          {template.hasTrial && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-xl bg-amber-50 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] font-bold text-amber-800 flex-1">
                7-Day Free Trial — Test on your blog before buying
              </span>
              <a
                href={template.trialDownloadUrl}
                download
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] font-black text-amber-700 hover:text-amber-900 underline cursor-pointer shrink-0"
              >
                Download
              </a>
            </div>
          )}

          {/* Price + Details button */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-slate-900">
                  ${template.price.toFixed(2)}
                </span>
                {template.originalPrice > template.price && (
                  <span className="text-xs text-slate-400 line-through">
                    ${template.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-indigo-600 flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Lifetime Activation License
              </span>
            </div>

            <button
              onClick={() => navigate(`/template/${template.slug}`)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};