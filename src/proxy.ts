import { NextRequest, NextResponse } from 'next/server';
import { isPlatformHost, requestHost, publicPathAllowed } from './lib/site-policy';
import { isAdmin } from './lib/admin-auth';

export function proxy(request: NextRequest) {
  const host = requestHost(request), path = request.nextUrl.pathname;
  if (isPlatformHost(host)) {
    if (path.startsWith('/domain-site')) return new NextResponse(null, { status: 404 });
    if ((path === '/builder' || path.startsWith('/builder/')) && !isAdmin(request)) {
      const url = request.nextUrl.clone(); url.pathname = '/builder-login'; url.search = '';
      url.searchParams.set('next', path + request.nextUrl.search);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  if (process.env.CUSTOM_DOMAINS_ENABLED !== 'true' || !publicPathAllowed(path)) return new NextResponse(null, { status: 404 });
  if (path === '/api/leads') return NextResponse.next(); // Handler binds the site to this host.
  const url = request.nextUrl.clone();
  url.pathname = path === '/' ? '/domain-site' : path === '/robots.txt' ? '/domain-site/robots' : '/domain-site/sitemap';
  url.search = '';
  const response = NextResponse.rewrite(url);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|woff|woff2|mp4)$).*)'],
};
