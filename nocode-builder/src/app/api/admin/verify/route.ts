import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: '서버에 비밀번호가 설정되지 않았습니다.' }, { status: 500 });
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }
}