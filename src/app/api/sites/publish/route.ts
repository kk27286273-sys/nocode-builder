import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { B2BTemplateData } from '@/types/Template';

interface PublishPayload {
  siteId?: string | null;
  templateData: B2BTemplateData;
  subdomain?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PublishPayload = await req.json();
    const { siteId, templateData, subdomain } = body;

    const title =
      templateData.hero?.title?.trim() ||
      templateData.company?.name?.trim();

    if (!title) {
      return NextResponse.json(
        { error: '사이트 제목 또는 기업명을 입력해야 합니다.' },
        { status: 400 }
      );
    }

    const record = {
      title,
      content: templateData,
      subdomain: subdomain?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const db = supabaseAdmin as any;
    let result: any;

    if (siteId) {
      const { data, error } = await db
        .from('sites')
        .update(record)
        .eq('id', siteId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      result = data;
    } else {
      const { data, error } = await db
        .from('sites')
        .insert([
          {
            ...record,
            is_published: true,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      result = data;
    }

    return NextResponse.json({
      success: true,
      siteId: result?.id,
      data: result,
    });
  } catch (error: any) {
    console.error('[PUBLISH_API_ERROR]', error);

    return NextResponse.json(
      {
        error:
          error?.message || '발행 처리 중 서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}