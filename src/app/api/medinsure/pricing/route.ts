import { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { validPolicy } from '@/lib/medinsure/plans';
import { activePricing } from '@/lib/medinsure/pricing-server';

export async function GET() {
  try { return Response.json(await activePricing(), { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return Response.json({ error: '요금 정책을 읽을 수 없습니다.' }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  const token = process.env.ADMIN_ACCESS_TOKEN;
  if (!token || request.cookies.get('nexia_admin_session')?.value !== token ||
    request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 403 });
  if (process.env.VERCEL_ENV === 'preview') return Response.json({ error: 'Preview에서는 운영 정책을 변경할 수 없습니다.' }, { status: 403 });
  const body = await request.json().catch(() => null);
  const effective = body?.effectiveAt ? Date.parse(body.effectiveAt) : Date.now();
  if (!validPolicy(body?.policy) || !Number.isFinite(effective) || effective < Date.now() - 60000)
    return Response.json({ error: '중복 구간, 기본료, 할인율 및 적용일을 확인하세요. GA에는 2명 구간이 필요합니다.' }, { status: 400 });
  const { data, error } = await createAdminClient().from('medinsure_pricing_versions')
    .insert({ policy: body.policy, effective_at: new Date(effective).toISOString() }).select('version,effective_at').single();
  return error ? Response.json({ error: '요금 정책 저장에 실패했습니다.' }, { status: 503 }) : Response.json(data);
}
