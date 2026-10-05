import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { siteId, name, data, adminPassword } = body;

    const serverPassword = process.env.ADMIN_PASSWORD || 'admin1234';

    // 1. 비밀번호 체크
    if (!adminPassword || adminPassword !== serverPassword) {
      return NextResponse.json(
        { error: '인증에 실패했습니다. 올바른 비밀번호를 입력해 주세요.' },
        { status: 401 }
      );
    }

    if (!siteId || !data) {
      return NextResponse.json(
        { error: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 2. 서비스 롤 권한으로 sites 테이블에 업서트
    const { error } = await supabaseAdmin.from('sites').upsert({
      id: siteId,
      name: name || '업체 사이트',
      data: data,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase DB 업서트 에러:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, siteId });
  } catch (err: any) {
    console.error('Publish API 서버 에러:', err);
    return NextResponse.json(
      { error: err.message || '서버 내부 처리 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}