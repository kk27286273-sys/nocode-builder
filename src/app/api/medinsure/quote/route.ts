import { activePricing } from '@/lib/medinsure/pricing-server';
import { quoteMedinsure } from '@/lib/medinsure/plans';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const active = await activePricing().catch(() => null);
  if (!active) return Response.json({ error: '요금 정책을 읽을 수 없습니다.' }, { status: 503 });
  const quote = quoteMedinsure(body?.plan, body?.seats, active.policy);
  return quote
    ? Response.json({ ...quote, pricingVersion: active.version, checkoutEnabled: process.env.VERCEL_ENV !== 'production' &&
      Boolean(process.env.MEDINSURE_TOSS_TEST_SECRET_KEY?.startsWith('test_sk_') &&
        process.env.MEDINSURE_TOSS_TEST_CLIENT_KEY?.startsWith('test_ck_') &&
        process.env.MEDINSURE_TOSS_TEST_ORIGIN === request.headers.get('origin')) })
    : Response.json({ error: '요금제와 계약 인원을 확인해 주세요.' }, { status: 400 });
}
