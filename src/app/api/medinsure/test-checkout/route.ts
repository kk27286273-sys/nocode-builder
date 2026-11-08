import { randomUUID } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/admin';
import { activePricing } from '@/lib/medinsure/pricing-server';
import { quoteMedinsure } from '@/lib/medinsure/plans';

function reply(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  const secret = process.env.MEDINSURE_TOSS_TEST_SECRET_KEY;
  const clientKey = process.env.MEDINSURE_TOSS_TEST_CLIENT_KEY;
  const origin = process.env.MEDINSURE_TOSS_TEST_ORIGIN;
  if (process.env.VERCEL_ENV === 'production' || !secret?.startsWith('test_sk_') ||
    !clientKey?.startsWith('test_ck_') || !origin || request.headers.get('origin') !== origin) {
    return reply('토스 테스트 결제가 설정되지 않았습니다.', 503);
  }

  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return reply('로그인이 필요합니다.', 401);
  const body = await request.json().catch(() => null);
  try {
    const db = createAdminClient();
    const { data: { user }, error } = await db.auth.getUser(token);
    if (error || !user?.email_confirmed_at) return reply('이메일 인증을 완료한 뒤 로그인해 주세요.', 401);

    if (body?.action === 'prepare') {
      const active = await activePricing();
      if (body.pricingVersion !== active.version) return reply('요금 정책이 변경되었습니다. 주문을 다시 확인해 주세요.', 409);
      const quote = quoteMedinsure(body.plan, body.seats, active.policy);
      const name = typeof body.organization === 'string' ? body.organization.trim() : '';
      if (!quote || quote.seats > 10000 || body.termsAccepted !== true || body.billingAccepted !== true ||
        (quote.plan.group === 'ga' && (!name || name.length > 100))) return reply('주문 내용과 필수 동의를 확인해 주세요.', 400);
      const orderId = randomUUID();
      const customerKey = randomUUID();
      const { error: insertError } = await db.from('medinsure_test_orders').insert({
        id: orderId, buyer_id: user.id, customer_key: customerKey, plan: quote.plan.id,
        months: quote.plan.months, pricing_version: active.version, seats: quote.seats, amount: quote.amount, organization_name: quote.plan.group === 'individual' ? 'MedinSure 개인 이용권' : name,
        consent_version: 'test-2026-11-08',
      });
      if (insertError) throw insertError;
      return Response.json({ clientKey, customerKey,
        successUrl: `${origin}/medinsure/checkout-result?orderId=${orderId}`,
        failUrl: `${origin}/medinsure/checkout-result?failed=1` });
    }

    if (body?.action !== 'confirm' || typeof body.orderId !== 'string' ||
      typeof body.customerKey !== 'string' || typeof body.authKey !== 'string' || !body.authKey || body.authKey.length > 300) {
      return reply('결제 인증 정보를 확인해 주세요.', 400);
    }
    const { data: order, error: claimError } = await db.from('medinsure_test_orders')
      .update({ status: 'confirming' }).eq('id', body.orderId).eq('buyer_id', user.id)
      .eq('customer_key', body.customerKey).eq('status', 'pending')
      .gt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .select('id, customer_key, amount, plan').maybeSingle();
    if (claimError) throw claimError;
    if (!order) {
      const { data: paid } = await db.from('medinsure_test_orders').select('id').eq('id', body.orderId)
        .eq('buyer_id', user.id).eq('customer_key', body.customerKey).eq('status', 'paid').maybeSingle();
      return paid ? Response.json({ paid: true }) : reply('이미 처리 중이거나 만료된 주문입니다.', 409);
    }

    const authorization = `Basic ${Buffer.from(`${secret}:`).toString('base64')}`;
    const toss = async (path: string, payload: Record<string, unknown>, idempotencyKey: string) => {
      const response = await fetch(`https://api.tosspayments.com/v1${path}`, {
        method: 'POST', headers: { Authorization: authorization, 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify(payload), signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error('test_payment_failed');
      return response.json();
    };
    const billing = await toss('/billing/authorizations/issue',
      { authKey: body.authKey, customerKey: order.customer_key }, `auth-${order.id}`);
    if (typeof billing.billingKey !== 'string' || billing.customerKey !== order.customer_key) throw new Error('invalid_test_billing');
    const payment = await toss(`/billing/${encodeURIComponent(billing.billingKey)}`, {
      customerKey: order.customer_key, amount: order.amount, orderId: order.id, orderName: `MedinSure ${order.plan} 테스트`,
    }, order.id);
    if (payment.status !== 'DONE' || payment.orderId !== order.id ||
      payment.totalAmount !== order.amount || typeof payment.paymentKey !== 'string') throw new Error('invalid_test_payment');
    const { error: activateError } = await db.rpc('medinsure_activate_test_order', {
      order_id: order.id, buyer: user.id, confirmed_payment: payment.paymentKey,
    });
    if (activateError) throw activateError;
    return Response.json({ paid: true });
  } catch {
    return reply('테스트 결제를 완료하지 못했습니다. 처리 중 주문은 중복 청구 방지를 위해 운영자 확인이 필요합니다.', 503);
  }
}
