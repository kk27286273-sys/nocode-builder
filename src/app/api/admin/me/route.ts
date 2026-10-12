import { NextResponse } from 'next/server';

const COOKIE_NAME = 'nexia_admin_session';

export async function GET(request: Request) {
  const accessToken = process.env.ADMIN_ACCESS_TOKEN;
  const cookieHeader = request.headers.get('cookie') || '';

  const sessionCookie = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));

  const sessionValue = sessionCookie?.split('=').slice(1).join('=');

  if (!accessToken || sessionValue !== accessToken) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 },
    );
  }

  return NextResponse.json({
    authenticated: true,
    role: 'admin',
    user: { name: 'TH소프트 총괄 관리자' },
  });
}