import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface PortoneWebhookBody {
  imp_uid: string;
  merchant_uid: string;
  status: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PortoneWebhookBody = await req.json();
    const { imp_uid, merchant_uid, status } = body;

    if (!imp_uid || !merchant_uid) {
      return NextResponse.json(
        { error: 'imp_uid 및 merchant_uid는 필수입니다.' },
        { status: 400 }
      );
    }

    const siteIdMatch = merchant_uid.match(/^site_([a-zA-Z0-9-]+)_/);
    const siteId = siteIdMatch ? siteIdMatch[1] : null;

    const db = supabaseAdmin as any;

    const { error: paymentError } = await db
      .from('payments')
      .insert([
        {
          site_id: siteId,
          imp_uid,
          merchant_uid,
          status,
          amount: 99000,
        },
      ]);

    if (paymentError) {
      throw paymentError;
    }

    if (status === 'paid' && siteId) {
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);

      const { error: updateError } = await db
        .from('sites')
        .update({
          subscription_status: 'active',
          is_published: true,
          current_period_end: nextMonth.toISOString(),
        })
        .eq('id', siteId);

      if (updateError) {
        throw updateError;
      }
    }

    if (
      (status === 'failed' || status === 'cancelled') &&
      siteId
    ) {
      const { error: inactiveError } = await db
        .from('sites')
        .update({
          subscription_status: 'inactive',
        })
        .eq('id', siteId);

      if (inactiveError) {
        throw inactiveError;
      }
    }

    return NextResponse.json({
      success: true,
      received: true,
    });
  } catch (error: any) {
    console.error('[PORTONE_WEBHOOK_ERROR]', error);

    return NextResponse.json(
      {
        error: error?.message || '웹훅 처리 실패',
      },
      { status: 500 }
    );
  }
}