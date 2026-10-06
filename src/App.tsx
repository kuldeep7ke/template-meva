import { useEffect, useState } from 'react';
import { useRouter, parseRoute, getQueryParam } from './utils/router';
import { SITE_CONFIG } from './data/siteConfig';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeGallery } from './pages/HomeGallery';
import { TemplateDetail } from './pages/TemplateDetail';
import { DemoShowcaseHub } from './pages/DemoShowcaseHub';
import { LivePreviewFrame } from './pages/LivePreviewFrame';
import { HelpDocs } from './pages/HelpDocs';
import { UnlicensedNotice } from './pages/UnlicensedNotice';
import { ContactPage } from './pages/ContactPage';

const DEFAULT_SEARCH = 'spotlight';

export function App() {
  const { location, currentPath, navigate } = useRouter();
  // Owned here so the hero search survives re-renders, but there is only ever
  // one search input in the UI.
  const [searchQuery, setSearchQuery] = useState('');

  const route = parseRoute(location);
  const categoryParam = getQueryParam(location, 'category');

  // Keep the document title aligned with the active route for SEO and tabs.
  useEffect(() => {
    const titles: Record<string, string> = {
      home: SITE_CONFIG.siteTitle,
      'template-detail': `${route.params.slug || 'Template'} — ${SITE_CONFIG.siteName}`,
      'demo-showcase': `Demos — ${SITE_CONFIG.siteName}`,
      'live-preview': `Live Preview — ${SITE_CONFIG.siteName}`,
      docs: `Help Docs — ${SITE_CONFIG.siteName}`,
      unlicensed: `License Notice — ${SITE_CONFIG.siteName}`,
      contact: `Contact — ${SITE_CONFIG.siteName}`,
    };
    document.title = titles[route.name] ?? SITE_CONFIG.siteTitle;
  }, [route.name, route.params.slug]);

  // If in full-screen responsive preview, omit standard Navbar and Footer
  if (route.name === 'live-preview') {
    return (
      <LivePreviewFrame
        slug={route.params.slug || DEFAULT_SEARCH}
        navigate={navigate}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header — navigation only; search lives in the hero */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {route.name === 'home' && (
          <HomeGallery
            navigate={navigate}
            selectedCategoryFromUrl={categoryParam}
            initialSearchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        )}

        {route.name === 'template-detail' && (
          <TemplateDetail
            slug={route.params.slug || DEFAULT_SEARCH}
            navigate={navigate}
          />
        )}

        {route.name === 'demo-showcase' && (
          <DemoShowcaseHub
            slug={route.params.slug || 'smartmag'}
            navigate={navigate}
          />
        )}

        {route.name === 'docs' && (
          <HelpDocs
            initialSlug={route.params.docSlug || 'installation'}
            navigate={navigate}
          />
        )}

        {route.name === 'unlicensed' && (
          <UnlicensedNotice
            navigate={navigate}
          />
        )}

        {route.name === 'contact' && (
          <ContactPage
            navigate={navigate}
          />
        )}
      </main>

      {/* Global Informative Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default App;