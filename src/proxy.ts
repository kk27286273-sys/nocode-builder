import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'nexia_admin_session';

export function proxy(request: NextRequest) {
  const path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';
  if (path === '/api/medinsure/organization') {
    return NextResponse.json({ error: 'organization_unavailable' }, { status: 403 });
  }
  if (path === '/organization') {
    return new NextResponse('MedinSure organization access is unavailable.', { status: 403 });
  }
  if (path === '/login') {
    if (!['medinsure.co.kr', 'www.medinsure.co.kr'].includes(request.headers.get('host') ?? request.nextUrl.hostname)) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = '/medinsure/login';
    return NextResponse.redirect(url);
  }
  if (path !== '/builder' && !path.startsWith('/builder/')) return NextResponse.next();
  if (process.env.NEXT_PUBLIC_PRICING_REVIEW === 'true' && path === '/builder') {
    return NextResponse.next();
  }
  const accessToken = process.env.ADMIN_ACCESS_TOKEN;
  const sessionValue = request.cookies.get(COOKIE_NAME)?.value;

  if (!accessToken || sessionValue !== accessToken) {
    const loginUrl = new URL('/builder-login', request.url);

    loginUrl.searchParams.set(
      'next',
      request.nextUrl.pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/builder/:path*', '/login', '/organization', '/api/medinsure/organization'],
};
