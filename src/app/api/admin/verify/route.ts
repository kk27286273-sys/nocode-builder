import { NextResponse } from 'next/server';

const COOKIE_NAME = 'nexia_admin_session';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const accessToken = process.env.ADMIN_ACCESS_TOKEN;

    if (!adminPassword || !accessToken) {
      return NextResponse.json(
        { error: '관리자 인증 환경변수가 설정되지 않았습니다.' },
        { status: 500 },
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: '잘못된 요청입니다.' },
      { status: 400 },
    );
  }
}