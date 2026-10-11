import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getPlan } from '@/lib/plans';

export async function POST(req: NextRequest) {
  try {
    const { plan, name, email, phone } = await req.json();
    if (!name || !email || !phone) {
      return NextResponse.json({ message: '입력값 누락' }, { status: 400 });
    }

    const p = getPlan(plan);
    const customerKey = `CUS_${randomUUID().replace(/-/g, '')}`;
    const orderId = `ORD_${Date.now()}_${randomUUID().slice(0, 8)}`;

    const { error: ce } = await supabaseAdmin
      .from('customers')
      .insert({ customer_key: customerKey, name, email, phone });
    if (ce) throw ce;

    const { error: oe } = await supabaseAdmin.from('orders').insert({
      order_id: orderId,
      customer_key: customerKey,
      plan: plan ?? 'pro',
      setup_fee: p.setupFee,
      monthly_fee: p.monthlyFee,
      amount: p.setupFee + p.monthlyFee,
      status: 'pending',
    });
    if (oe) throw oe;

    return NextResponse.json({ orderId, customerKey });
  } catch (e: any) {
    console.error('주문 생성 실패:', e);
    return NextResponse.json({ message: '주문 생성 실패' }, { status: 500 });
  }
}