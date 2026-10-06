import { useState, type FC } from 'react';
import {
  ShieldAlert, Lock, Clock, Key, ShoppingBag, HelpCircle,
  RefreshCcw, ExternalLink, CheckCircle2, AlertTriangle, Mail
} from 'lucide-react';

interface UnlicensedNoticeProps {
  navigate: (to: string) => void;
}

type NoticeReason = 'trial_expired' | 'attribution_removed' | 'invalid_key' | 'unknown';

const REASON_COPY: Record<Exclude<NoticeReason, 'unknown'>, { title: string; body: string }> = {
  trial_expired: {
    title: 'Trial Period Expired or License Not Active',
    body: "The 7-day free trial for this template has expired, or the license key has not been entered yet. Visitors can still read your blog's content — but this notice is displayed until the template is activated with a valid license key."
  },
  attribution_removed: {
    title: 'Template Attribution Code Removed',
    body: 'Our system detected that the "Powered by TemplateMeva" attribution code was removed from this blog before a license was purchased. Restoring the attribution — or activating a license — removes this notice immediately.'
  },
  invalid_key: {
    title: 'License Key Invalid or Domain Mismatch',
    body: 'A license key was entered for this template, but it is invalid, expired, or registered to a different domain. Each license key is tied to one domain. Enter the correct key or purchase a new license for this blog.'
  }
};

// Attribution tamper reasons reported by the in-template anti-piracy script
// (see docs/TEMPLATE_DEVELOPER_GUIDE.md §1) all map to the attribution_removed copy.
const TAMPER_REASONS = ['element_deleted', 'element_hidden', 'href_tampered'];

const getQueryParam = (name: string): string => {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get(name)?.trim() ?? '';
};

export const UnlicensedNotice: FC<UnlicensedNoticeProps> = ({ navigate }) => {
  const [showActivateBox, setShowActivateBox] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'idle' | 'success' | 'error'>('idle');

  // Anti-piracy redirect params sent by trial templates:
  // /unlicensed?domain=<blog domain>&reason=<trial_expired|attribution_removed|invalid_key|element_deleted|element_hidden|href_tampered>&template=<slug>
  const flaggedDomain = getQueryParam('domain');
  const rawReason = getQueryParam('reason');
  const normalizedReason: NoticeReason = TAMPER_REASONS.includes(rawReason)
    ? 'attribution_removed'
    : (rawReason as NoticeReason);
  const reason: NoticeReason = REASON_COPY[normalizedReason as Exclude<NoticeReason, 'unknown'>]
    ? normalizedReason
    : 'unknown';
  const templateSlug = getQueryParam('template');
  const copy = REASON_COPY[reason as Exclude<NoticeReason, 'unknown'>] ?? REASON_COPY.trial_expired;

  const handleValidate = () => {
    if (!licenseKey.trim()) return;
    setValidating(true);
    setValidationResult('idle');

    // Simulate key validation (placeholder — real impl hooks into backend)
    setTimeout(() => {
      setValidating(false);
      // For demo: accept any MEVA-XXXX-XXXX-XXXX format key
      const keyPattern = /^MEVA-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
      setValidationResult(keyPattern.test(licenseKey.trim()) ? 'success' : 'error');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 sm:p-6">

      {/* Brand Header */}
      <div className="mb-10 text-center">
        <button onClick={() => navigate('/')} className="cursor-pointer inline-block">
          <span className="text-xl font-black text-white tracking-tight">
            Template<span className="text-indigo-400">Meva</span>
          </span>
        </button>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Top Alert Banner */}
        <div className="bg-amber-500 px-6 py-4 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-white shrink-0" />
          <p className="text-sm font-bold text-white">
            This template is currently running without an active license
          </p>
        </div>

        <div className="p-6 sm:p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              {copy.title}
            </h1>
            <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
              {copy.body}
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 mb-8">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm flex-1">
              <p className="font-bold text-amber-900">What caused this notice?</p>
              <ul className="mt-1 text-amber-800 space-y-1 list-inside list-disc text-xs">
                <li>The 7-day trial period has ended and no license key was entered</li>
                <li>The template attribution code was removed before purchasing a license</li>
                <li>The license key was entered but has expired or belongs to a different domain</li>
              </ul>
              {(flaggedDomain || templateSlug) && (
                <div className="mt-3 pt-3 border-t border-amber-200/70 space-y-1">
                  {flaggedDomain && (
                    <p className="text-xs text-amber-900">
                      <span className="font-bold">Flagged blog:</span>{' '}
                      <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">{flaggedDomain}</code>
                    </p>
                  )}
                  {templateSlug && (
                    <p className="text-xs text-amber-900">
                      <span className="font-bold">Template:</span>{' '}
                      <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">{templateSlug}</code>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Two Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

            {/* Path A: Buy & Activate */}
            <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-4 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">
                  Activate — Recommended
                </h3>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed flex-1">
                Purchase a lifetime activation license and activate this template in under 30 seconds by pasting your license key into the Blogger Layout. No re-upload required.
              </p>
              <ul className="text-xs text-emerald-700 space-y-1.5">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Notice disappears immediately</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />All features unlocked permanently</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Lifetime updates &amp; support</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />30-day money back guarantee</li>
              </ul>
              <div className="space-y-2 mt-auto pt-2">
                <a
                  href="https://templatemeva.gumroad.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-center block"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Activation License</span>
                </a>
                <button
                  onClick={() => setShowActivateBox(!showActivateBox)}
                  className="w-full py-2.5 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Already have a license key? Enter it here</span>
                </button>
              </div>
            </div>

            {/* Path B: Extend Trial or Restore */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center shrink-0">
                  <RefreshCcw className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">
                  Need More Time to Evaluate?
                </h3>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed flex-1">
                If you're still evaluating the template and your 7-day trial has expired, contact us to request a one-time trial extension. This is available once per domain for verified cases only.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                <p className="font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                  Important:
                </p>
                <p>
                  If you removed the template attribution code ("Powered by TemplateMeva") before purchasing a license, this is a violation of our trial usage terms. Please restore attribution or purchase a license to continue using the template.
                </p>
              </div>
              <div className="space-y-2 mt-auto pt-2">
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Request Trial Extension</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Browse Other Templates</span>
                </button>
              </div>
            </div>
          </div>

          {/* Inline Activation Box */}
          {showActivateBox && (
            <div className="mb-6 p-5 rounded-2xl bg-slate-900 border border-slate-700">
              <h4 className="font-black text-white text-sm mb-2 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-indigo-400" />
                Enter License Key
              </h4>
              <p className="text-slate-400 text-xs mb-4">
                Format: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono">MEVA-XXXX-XXXX-XXXX</code> — case-insensitive
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                  placeholder="MEVA-XXXX-XXXX-XXXX"
                  className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  onClick={handleValidate}
                  disabled={validating || !licenseKey.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {validating ? 'Verifying…' : 'Activate'}
                </button>
              </div>

              {validationResult === 'success' && (
                <div className="mt-3 p-3 bg-emerald-900/40 border border-emerald-600 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>License key accepted!</strong> Paste this key into your Blogger Layout's "License Key" gadget to remove the notice from your blog. The key is valid and your activation is confirmed.
                  </span>
                </div>
              )}

              {validationResult === 'error' && (
                <div className="mt-3 p-3 bg-rose-900/40 border border-rose-600 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>Invalid license key.</strong> Make sure you've entered the full key in MEVA-XXXX-XXXX-XXXX format from your purchase confirmation email. If the problem persists, contact support.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Help Links */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <button onClick={() => navigate('/docs/activation')} className="flex items-center gap-1 hover:text-indigo-600 font-medium cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Activation Guide</span>
            </button>
            <span>•</span>
            <button onClick={() => navigate('/docs/installation')} className="flex items-center gap-1 hover:text-indigo-600 font-medium cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Installation Guide</span>
            </button>
            <span>•</span>
            <button onClick={() => navigate('/contact')} className="flex items-center gap-1 hover:text-indigo-600 font-medium cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </button>
            <span>•</span>
            <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-indigo-600 font-medium cursor-pointer">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Template Store</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-center text-[11px] text-slate-600 max-w-sm">
        This notice is shown to all visitors of blogs running an expired or unactivated TemplateMeva template trial. After activation, it disappears immediately and permanently for all visitors.
      </p>
    </div>
  );
};
