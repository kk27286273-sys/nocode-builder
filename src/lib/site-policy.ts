/** Pure boundary rules shared by routing, APIs and tests. Never trust forwarded host. */
export function normalizeDomain(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const domain = value.trim().toLowerCase().replace(/\.$/, '');
  if (domain.length > 253 || !domain.includes('.') || !/^[a-z0-9.-]+$/.test(domain)) return null;
  if (domain.split('.').some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) return null;
  if (/^[\d.]+$/.test(domain) || domain.endsWith('.localhost') || domain.endsWith('.local')) return null;
  return domain;
}

export function requestHost(request: { headers: Headers }): string {
  return (request.headers.get('host') || '').toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '');
}

export function isPlatformHost(host: string): boolean {
  const configured = (process.env.PLATFORM_HOSTS || 'thsoft.co.kr,www.thsoft.co.kr').split(',').map(s => s.trim().toLowerCase());
  return configured.includes(host) || (process.env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(host));
}

export function validSiteId(value: unknown): value is string {
  return typeof value === 'string' && value.length >= 1 && value.length <= 100 && !/[^a-zA-Z0-9가-힣_-]/.test(value);
}

export function validSiteData(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value) && JSON.stringify(value).length <= 2_000_000;
}

export function publicPathAllowed(path: string): boolean {
  return path === '/' || path === '/robots.txt' || path === '/sitemap.xml' || path === '/api/leads';
}
