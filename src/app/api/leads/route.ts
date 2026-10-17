import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
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

    const db = supabaseAdmin as any;

    const lead = {
      site_id: siteId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      message: message ? String(message).trim() : '',
    };

    const { error: dbError } = await db
      .from('leads')
      .insert([lead]);

    if (dbError) {
      throw dbError;
    }

    const { data: site } = await db
      .from('sites')
      .select('title')
      .eq('id', siteId)
      .maybeSingle();

    const siteTitle = site?.title || '미지정 사이트';

    void sendLeadNotification({
      siteTitle,
      name: lead.name,
      phone: lead.phone,
      message: lead.message,
    }).catch((error) => {
      console.error('[LEAD_NOTIFICATION_ERROR]', error);
    });

    return NextResponse.json({
      success: true,
      message: '문의가 정상 접수되었습니다.',
    });
  } catch (error: any) {
    console.error('[LEAD_SUBMIT_API_ERROR]', error);

    return NextResponse.json(
      {
        error:
          error?.message || '상담 신청 접수 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}