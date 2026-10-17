import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { siteId, domain } = await req.json();

    if (!siteId || !domain) {
      return NextResponse.json(
        { error: 'siteId와 도메인은 필수 항목입니다.' },
        { status: 400 }
      );
    }

    const cleanDomain = String(domain)
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '');

    const db = supabaseAdmin as any;

    const { error: dbError } = await db
      .from('sites')
      .update({ custom_domain: cleanDomain })
      .eq('id', siteId);

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      cnameTarget: 'cname.vercel-dns.com',
      message:
        '도메인이 성공적으로 등록되었습니다. DNS CNAME을 연결해 주세요.',
    });
  } catch (error: any) {
    console.error('[DOMAIN_SAVE_ERROR]', error);

    return NextResponse.json(
      {
        error: error?.message || '도메인 저장 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}