import { useState, type FC } from 'react';
import { 
  Mail, Send, CheckCircle2, AlertCircle, 
  MessageSquare, Clock, Globe
} from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';
import { TEMPLATES } from '../data/templates';

interface ContactPageProps {
  navigate: (to: string) => void;
}

export const ContactPage: FC<ContactPageProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    templateName: 'Spotlight Blogger Template',
    orderId: '',
    inquiryType: 'Technical Support',
    subject: '',
    message: '',
    blogUrl: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        templateName: 'Spotlight Blogger Template',
        orderId: '',
        inquiryType: 'Technical Support',
        subject: '',
        message: '',
        blogUrl: ''
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>Dedicated Customer Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            Contact Us & Support Notes
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
            Have questions before purchasing, need help activating your serial, or found a bug? We are here to help.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
            
            <h2 className="text-xl font-black text-slate-900 mb-2">Send a Message</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the details below. If asking about an existing template, please provide your blog address for faster diagnosis.
            </p>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Our support engineering team will review your inquiry and reply to your email within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Department *</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    >
                      <option value="Pre-Sale Questions">Pre-Sale Questions & Pricing</option>
                      <option value="Technical Support">Technical Installation & Setup</option>
                      <option value="Activation Issue">Serial / Activation Issue</option>
                      <option value="Bug Report">Bug Report & Suggestion</option>
                      <option value="Customization Service">Custom Design Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Relevant Template</label>
                    <select
                      value={formData.templateName}
                      onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    >
                      {TEMPLATES.map((t) => (
                        <option key={t.id} value={t.title}>{t.title}</option>
                      ))}
                      <option value="Other / General">Other / General Question</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Blogspot / Domain URL</label>
                    <input
                      type="url"
                      placeholder="https://myblog.blogspot.com"
                      value={formData.blogUrl}
                      onChange={(e) => setFormData({ ...formData, blogUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Order ID (if purchased)</label>
                    <input
                      type="text"
                      placeholder="e.g. GUM-984218"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief description of your question or issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your question or issue in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Support Request</span>
                </button>

              </form>
            )}

          </div>

          {/* Right Column: Support Notes & Rules (Inspired by ProBloggerTemplates) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Guidelines Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Important Support Notes</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Please Read Before Contacting Us
              </h3>
              
              <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 mt-0.5">•</span>
                  <span><strong>Check the Help Docs first:</strong> Over 90% of issues are resolved by checking our <button onClick={() => navigate('/docs/installation')} className="text-indigo-600 underline font-semibold">Installation Guide</button> and <button onClick={() => navigate('/docs/activation')} className="text-indigo-600 underline font-semibold">Activation Guide</button>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 mt-0.5">•</span>
                  <span><strong>Include your Blog URL:</strong> We cannot diagnose CSS or widget issues without inspecting the live blog. Always provide your URL.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 mt-0.5">•</span>
                  <span><strong>Scope of Support:</strong> Support covers template bugs, installation assistance, and default features. It does not cover deep third-party script integrations, custom CSS redesigns, or hosting issues outside Blogger.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600 mt-0.5">•</span>
                  <span><strong>Trial Version Support:</strong> 7-day trial versions receive community docs support only. Priority 1-on-1 ticket assistance is exclusive to verified Premium license owners.</span>
                </li>
              </ul>
            </div>

            {/* Support Info & SLA */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Response Times & Hours</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block">Working Hours:</span>
                    <span className="font-bold text-white">{SITE_CONFIG.workingHours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block">Typical Response SLA:</span>
                    <span className="font-bold text-white">Within 12 to 24 Hours</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 block">Direct Email:</span>
                    <span className="font-bold text-white">{SITE_CONFIG.supportEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Unlicensed reminder */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <span className="font-bold block mb-1">Redirected from a template?</span>
              Visit our <button onClick={() => navigate('/unlicensed')} className="font-bold underline text-amber-800">Unlicensed Notice Page</button> to understand how to resolve footer credit verification.
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
