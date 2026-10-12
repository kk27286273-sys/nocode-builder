import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'nexia_admin_session';

export function proxy(request: NextRequest) {
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
  matcher: ['/builder/:path*'],
};