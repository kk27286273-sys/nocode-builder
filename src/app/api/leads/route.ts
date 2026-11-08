import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendLeadNotification } from '@/utils/sendNotification';
import { findDomain, getPublication } from '@/lib/public-sites';
import { isPlatformHost, requestHost, validSiteId } from '@/lib/site-policy';

export async function POST(req: NextRequest) {
  try {
    const { siteId: requestedSiteId, name, phone, message } = await req.json();
    const host = requestHost(req);
    const mapping = isPlatformHost(host) ? null : await findDomain(host);
    const siteId = isPlatformHost(host) ? requestedSiteId : mapping?.site_id;
    if (!validSiteId(siteId) || !(await getPublication(siteId))) {
      return NextResponse.json({ error: '공개된 사이트를 찾을 수 없습니다.' }, { status: 404 });
    }

    if (typeof name !== 'string' || !name.trim() || name.length > 100 || typeof phone !== 'string' || !phone.trim() || phone.length > 50 || (message !== undefined && (typeof message !== 'string' || message.length > 5000))) {
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
