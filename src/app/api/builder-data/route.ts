import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  try {
    // 1. URL에서 siteId 추출 (예: ?siteId=default-site)
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json({ error: 'siteId가 필요합니다.' }, { status: 400 });
    }

    // 2. 마스터 권한 클라이언트 생성
    const supabaseAdmin = createAdminClient();

    // 3. DB에서 해당 siteId 데이터 조회
    const { data, error } = await supabaseAdmin
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .single();

    if (error) {
      console.error('DB 조회 에러:', error);
      return NextResponse.json({ 
        error: 'DB 조회 중 에러가 발생했습니다.', 
        details: error.message 
      }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: '해당 사이트 데이터를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 4. 성공적으로 데이터를 찾았으면 반환
    return NextResponse.json({ data }, { status: 200 });

  } catch (err: any) {
    console.error('서버 내부 에러:', err);
    return NextResponse.json({ 
      error: '서버 내부 오류가 발생했습니다.', 
      details: err.message 
    }, { status: 500 });
  }
}