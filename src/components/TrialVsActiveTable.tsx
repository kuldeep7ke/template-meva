import type { FC } from 'react';
import { Check, X, ShieldCheck, Download, ShoppingBag, Sparkles, Clock } from 'lucide-react';
import type { ComparisonItem } from '../types';

interface TrialVsActiveTableProps {
  comparisonItems: ComparisonItem[];
  templatePrice: number;
  templateTitle: string;
  trialDuration?: string;
  trialDownloadUrl?: string;
  buyUrl?: string;
  onDownloadTrial?: () => void;
  onBuyActive?: () => void;
}

export const TrialVsActiveTable: FC<TrialVsActiveTableProps> = ({
  comparisonItems,
  templatePrice,
  templateTitle,
  trialDuration = '7 Days Free Trial',
  onDownloadTrial,
  onBuyActive
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Licensing — Test Before You Buy</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">{trialDuration} vs. Active Full Version</h3>
          <p className="text-sm text-slate-400 mt-1">
            Start with the 7-day trial on your blog. Activate any time by pasting your serial.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">One-Time Lifetime Activation</span>
            <span className="text-2xl font-black text-amber-400">${templatePrice.toFixed(2)}</span>
          </div>
          <button
            onClick={onBuyActive}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy Activation License</span>
          </button>
        </div>
      </div>

      {/* Trial Callout Note */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3 text-xs text-amber-800">
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>How it works:</strong> The 7-Day Trial includes all template features fully functional. After 7 days, the template displays an activation prompt to your visitors until you paste your serial. Activating removes all limits permanently with no expiry.
        </span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75">
              <th className="py-4 px-6 text-sm font-bold text-slate-700 w-1/2">Features & Inclusions</th>
              <th className="py-4 px-6 text-center text-sm font-bold text-amber-700 w-1/4">
                <div className="flex flex-col items-center gap-0.5">
                  <span>7-Day Free Trial</span>
                  <span className="text-[10px] font-normal text-slate-400">Download &amp; Test Now</span>
                </div>
              </th>
              <th className="py-4 px-6 text-center text-sm font-bold text-indigo-600 w-1/4 bg-indigo-50/50">
                <div className="flex flex-col items-center gap-0.5">
                  <span>Active Full Version</span>
                  <span className="text-[10px] font-normal text-slate-400">${templatePrice.toFixed(2)} Lifetime</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {comparisonItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-6 font-medium text-slate-800">
                  <div className="flex flex-col">
                    <span>{item.feature}</span>
                    {item.note && (
                      <span className="text-xs text-amber-600 font-normal mt-0.5">{item.note}</span>
                    )}
                  </div>
                </td>

                {/* Trial Column */}
                <td className="py-3.5 px-6 text-center">
                  {typeof item.trial === 'boolean' ? (
                    item.trial ? (
                      <Check className="w-5 h-5 text-amber-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-300 mx-auto" />
                    )
                  ) : (
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      {item.trial}
                    </span>
                  )}
                </td>

                {/* Active Column */}
                <td className="py-3.5 px-6 text-center bg-indigo-50/20 font-semibold text-indigo-900">
                  {typeof item.active === 'boolean' ? (
                    item.active ? (
                      <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <X className="w-5 h-5 text-slate-300 mx-auto" />
                    )
                  ) : (
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                      {item.active}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200">
              <td className="py-4 px-6 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Important Note about {templateTitle}:</span> The 7-day trial is fully functional. After the trial period, an activation notice appears on your blog until you paste your serial into the Licence Activation gadget in Blogger &gt; Layout. Activation is instant and permanent.
              </td>
              <td className="py-4 px-6 text-center">
                <button
                  onClick={onDownloadTrial}
                  className="px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 7-Day Trial</span>
                </button>
              </td>
              <td className="py-4 px-6 text-center bg-indigo-50/30">
                <button
                  onClick={onBuyActive}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Activate (${templatePrice.toFixed(2)})</span>
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
