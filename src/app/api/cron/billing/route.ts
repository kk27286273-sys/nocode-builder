import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { chargeBilling } from '@/lib/toss';
import { getPlan } from '@/lib/plans';

export async function GET(req: NextRequest) {
  // CRON_SECRET 검증
  const authHeader = req.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedAuth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);

    const { data: subs, error: subsError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lte('next_billing_at', today);

    if (subsError) {
      console.error('구독 조회 실패:', subsError);
      return NextResponse.json({ message: '구독 조회 실패' }, { status: 500 });
    }

    const results: any[] = [];

    for (const sub of subs ?? []) {
      const orderId = `SUB_${Date.now()}_${randomUUID().slice(0, 8)}`;
      const planInfo = getPlan(sub.plan);

      try {
        const r = await chargeBilling({
          billingKey: sub.billing_key,
          customerKey: sub.customer_key,
          amount: sub.monthly_fee,
          orderId,
          orderName: `Nexia ${planInfo.name} 월 구독료`,
        });

        const next = new Date(sub.next_billing_at);
        next.setMonth(next.getMonth() + 1);

        await supabaseAdmin
          .from('subscriptions')
          .update({ next_billing_at: next.toISOString().slice(0, 10) })
          .eq('id', sub.id);

        await supabaseAdmin.from('payments').insert({
          order_id: orderId,
          customer_key: sub.customer_key,
          payment_key: r.paymentKey,
          amount: sub.monthly_fee,
          kind: 'recurring',
          status: r.status,
          raw: r,
        });

        results.push({ customerKey: sub.customer_key, ok: true });
      } catch (e: any) {
        console.error(`청구 실패 (${sub.customer_key}):`, e);

        await supabaseAdmin.from('payments').insert({
          order_id: orderId,
          customer_key: sub.customer_key,
          amount: sub.monthly_fee,
          kind: 'recurring',
          status: 'FAILED',
          raw: { error: e.message },
        });

        results.push({ customerKey: sub.customer_key, ok: false, error: e.message });
      }
    }

    return NextResponse.json({ processed: results.length, results });
  } catch (e: any) {
    console.error('정기결제 크론 오류:', e);
    return NextResponse.json({ message: '크론 작업 실패' }, { status: 500 });
  }
}