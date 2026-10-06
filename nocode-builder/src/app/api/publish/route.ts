import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 서버 전용 서비스 롤 키를 사용하여 RLS를 우회하고 강제로 저장합니다.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function POST(req: Request) {
  try {
    const { id, name, content } = await req.json();

    if (!id || !content) {
      return NextResponse.json({ error: '필수 데이터(id, content)가 누락되었습니다.' }, { status: 400 });
    }

    // 1. 기존 사이트 데이터가 있는지 확인 후 업데이트 또는 삽입 (Upsert)
    const { data, error } = await supabaseAdmin
      .from('sites')
      .upsert({ 
        id: id, 
        name: name || '이름 없는 사이트', 
        content: content, // 여기서 이미지 URL이 포함된 전체 JSON이 저장됩니다.
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true, message: '사이트가 성공적으로 발행되었습니다.' });
  } catch (error: any) {
    console.error('발행 에러 상세:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}