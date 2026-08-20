import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  bodyClass?: string;
}

function applySeo(title: string, description: string, path: string, bodyClass?: string) {
  if (typeof document === 'undefined') return;

  document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', description);
  document.body.className = bodyClass || '';

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const origin = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || window.location.origin;
  canonical.href = `${origin}${base}${path}`;
}

export default function Seo({ title, description, path, bodyClass }: SeoProps) {
  // Sync during render so post-build prerender captures title/meta in static HTML
  applySeo(title, description, path, bodyClass);

  useEffect(() => {
    applySeo(title, description, path, bodyClass);
  }, [title, description, path, bodyClass]);

  return null;
}
