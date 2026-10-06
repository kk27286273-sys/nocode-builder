import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json(
        { authenticated: false, message: '인증되지 않은 접근입니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      role: 'admin',
      user: { name: 'TH소프트 총괄 관리자' }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
