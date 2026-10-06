import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendLeadNotification } from '@/utils/sendNotification';

export async function POST(req: NextRequest) {
  try {
    const { siteId, name, phone, message } = await req.json();

    if (!siteId || !name || !phone) {
      return NextResponse.json(
        { error: '성함과 연락처는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 1. Supabase leads 테이블에 저장
    const { error: dbError } = await supabaseAdmin.from('leads').insert([
      {
        site_id: siteId,
        name: name.trim(),
        phone: phone.trim(),
        message: message?.trim() || '',
      },
    ]);

    if (dbError) throw dbError;

    // 2. 사이트 정보 조회 (알림 텍스트용)
    const { data: site } = await supabaseAdmin
      .from('sites')
      .select('title')
      .eq('id', siteId)
      .maybeSingle();

    const siteTitle = site?.title || '미지정 사이트';

    // 3. 실시간 알림 발송 (백그라운드 비동기)
    sendLeadNotification({
      siteTitle,
      name,
      phone,
      message,
    }).catch(console.error);

    return NextResponse.json({ success: true, message: '문의가 정상 접수되었습니다.' });
  } catch (error: any) {
    console.error('[LEAD_SUBMIT_API_ERROR]', error);
    return NextResponse.json(
      { error: error.message || '상담 신청 접수 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}