import { useCallback, useEffect, useState } from 'react';

export type RouteName =
  | 'home'
  | 'template-detail'
  | 'demo-showcase'
  | 'live-preview'
  | 'docs'
  | 'unlicensed'
  | 'contact';

export interface Route {
  name: RouteName;
  params: Record<string, string>;
}

/** Reads the current URL as `pathname + search` so query-driven state survives routing. */
function readLocation(): string {
  return `${window.location.pathname}${window.location.search}` || '/';
}

function normalize(path: string): string {
  const [pathname] = path.split('?');
  return pathname.replace(/\/+$/, '') || '/';
}

/**
 * Splits a location string into a pathname and a search string.
 * `navigate('/?category=Magazine')` keeps the query in router state, which is
 * what lets the gallery read `?category=` after a client-side transition.
 */
function splitLocation(location: string): { pathname: string; search: string } {
  const queryIndex = location.indexOf('?');
  if (queryIndex === -1) {
    return { pathname: location, search: '' };
  }
  return {
    pathname: location.slice(0, queryIndex),
    search: location.slice(queryIndex),
  };
}

export function useRouter() {
  const [location, setLocation] = useState<string>(readLocation);

  useEffect(() => {
    const handlePopState = () => setLocation(readLocation());

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to || '/';
    if (target === readLocation()) return;

    window.history.pushState({}, '', target);
    setLocation(target);

    // Query-only transitions still need a scroll reset; `smooth` is skipped so
    // the jump is instant on routes that swap the whole page body.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentPath = useCallback(() => normalize(location), [location]);

  return {
    location,
    currentPath: currentPath(),
    search: splitLocation(location).search,
    navigate,
  };
}

export function parseRoute(path: string): Route {
  const cleanPath = normalize(path);

  if (cleanPath === '/') {
    return { name: 'home', params: {} };
  }

  if (cleanPath.startsWith('/template/') || cleanPath.startsWith('/templates/')) {
    return { name: 'template-detail', params: { slug: cleanPath.split('/')[2] ?? '' } };
  }

  if (cleanPath.startsWith('/showcase/') || cleanPath.startsWith('/preview-hub/')) {
    return { name: 'demo-showcase', params: { slug: cleanPath.split('/')[2] ?? '' } };
  }

  if (cleanPath.startsWith('/preview/')) {
    return { name: 'live-preview', params: { slug: cleanPath.split('/')[2] ?? '' } };
  }

  if (cleanPath === '/docs' || cleanPath.startsWith('/docs/')) {
    return { name: 'docs', params: { docSlug: cleanPath.split('/')[2] || 'installation' } };
  }

  if (cleanPath === '/unlicensed' || cleanPath === '/trial-expired') {
    return { name: 'unlicensed', params: {} };
  }

  if (cleanPath === '/contact') {
    return { name: 'contact', params: {} };
  }

  // Unknown paths fall back to the store so a stale link never dead-ends.
  return { name: 'home', params: {} };
}

/** Reads a single query parameter from a location string such as `/?category=Tech`. */
export function getQueryParam(location: string, name: string): string {
  const { search } = splitLocation(location);
  if (!search) return '';
  return new URLSearchParams(search).get(name)?.trim() ?? '';
}