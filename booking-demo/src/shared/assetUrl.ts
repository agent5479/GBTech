/** Prefix public asset paths with Vite BASE_URL (e.g. /demo/). */
export function assetUrl(path: string): string {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  const normalized = path.replace(/^\//, '');
  return `${base}${normalized}`.replace(/([^:]\/)\/+/g, '$1');
}
