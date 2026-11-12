import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { chargeBilling } from '@/lib/toss';
import { getPlan } from '@/lib/plans';
import { billingAnchor, koreanDate, nextBillingDate } from '@/lib/nexia-billing';

export async function GET(req: NextRequest) {
  // CRON_SECRET 검증
  const authHeader = req.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || !authHeader || authHeader !== expectedAuth) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = koreanDate(new Date());

    const { data: subs, error: subsError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lte('next_billing_at', today);

    if (subsError) {
      console.error('구독 조회 실패:', subsError);
      return NextResponse.json({ message: '구독 조회 실패' }, { status: 500 });
    }

    const results: Array<{ customerKey: string; ok: boolean; error?: string }> = [];

    for (const sub of subs ?? []) {
      // Repeated requests for the same due date must use the same Toss idempotency key.
      const orderId = `SUB_${createHash('sha256').update(`${sub.customer_key}:${sub.next_billing_at}`).digest('hex').slice(0, 40)}`;
      const planInfo = getPlan(sub.plan);

      try {
        // Never infer the original day from a February-clamped due date.
        // Missing/ambiguous first-payment evidence stops this subscription before charging.
        const { data: firstPayments, error: anchorError } = await supabaseAdmin
          .from('payments').select('raw').eq('customer_key', sub.customer_key)
          .eq('kind', 'first').eq('status', 'DONE').limit(2);
        if (anchorError || firstPayments?.length !== 1) throw new Error('최초 결제 기준일 확인 필요');
        const next = nextBillingDate(sub.next_billing_at, billingAnchor(firstPayments[0].raw?.approvedAt));
        const r = await chargeBilling({
          billingKey: sub.billing_key,
          customerKey: sub.customer_key,
          amount: sub.monthly_fee,
          orderId,
          orderName: `Nexia ${planInfo.name} 월 구독료`,
        });

        if (r.status !== 'DONE' || r.totalAmount !== sub.monthly_fee || r.orderId !== orderId) {
          throw new Error('결제 승인 내역 확인 필요');
        }

        const { error: scheduleError } = await supabaseAdmin
          .from('subscriptions')
          .update({ next_billing_at: next })
          .eq('customer_key', sub.customer_key);
        if (scheduleError) throw new Error('청구 후 결제일 저장 확인 필요');

        const { error: paymentError } = await supabaseAdmin.from('payments').insert({
          order_id: orderId,
          customer_key: sub.customer_key,
          payment_key: r.paymentKey,
          amount: sub.monthly_fee,
          kind: 'recurring',
          status: r.status,
          raw: r,
        });
        if (paymentError) throw new Error('청구 후 결제이력 저장 확인 필요');

        results.push({ customerKey: sub.customer_key, ok: true });
      } catch (e: unknown) {
        console.error(`청구 실패 (${sub.customer_key}):`, e);

        await supabaseAdmin.from('payments').insert({
          order_id: orderId,
          customer_key: sub.customer_key,
          amount: sub.monthly_fee,
          kind: 'recurring',
          status: 'FAILED',
          raw: { error: (e instanceof Error ? e.message : '처리 상태 확인 필요') },
        });

        results.push({ customerKey: sub.customer_key, ok: false, error: (e instanceof Error ? e.message : '처리 상태 확인 필요') });
      }
    }

    return NextResponse.json({ processed: results.length, results });
  } catch (e: unknown) {
    console.error('정기결제 크론 오류:', e);
    return NextResponse.json({ message: '크론 작업 실패' }, { status: 500 });
  }
}
