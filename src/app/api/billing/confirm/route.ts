import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { issueBillingKey, chargeBilling } from '@/lib/toss';
import { getPlan } from '@/lib/plans';

export async function POST(req: NextRequest) {
  try {
    const { customerKey, authKey, orderId } = await req.json();

    if (!customerKey || !authKey || !orderId) {
      return NextResponse.json({ message: '필수 정보 누락' }, { status: 400 });
    }

    // 금액은 DB에서만 읽는다 (클라이언트 값 신뢰 금지)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ message: '주문을 찾을 수 없습니다.' }, { status: 404 });
    }

    if (order.customer_key !== customerKey) {
      return NextResponse.json({ message: '주문 정보가 일치하지 않습니다.' }, { status: 400 });
    }

    if (order.status === 'paid') {
      return NextResponse.json({ message: '이미 결제된 주문입니다.', amount: order.amount });
    }

    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('customer_key', customerKey)
      .single();

    try {
      // 1) 빌링키 발급
      const { billingKey } = await issueBillingKey(authKey, customerKey);

      // 2) 첫 결제 (구축비 + 첫 달)
      const planInfo = getPlan(order.plan);
      const result = await chargeBilling({
        billingKey,
        customerKey,
        amount: order.amount,
        orderId: order.order_id,
        orderName: `Nexia ${planInfo.name} 구축비 + 첫 달 구독`,
        customerEmail: customer?.email,
        customerName: customer?.name,
      });

      // 3) 구독 등록 (다음 결제일 = 한 달 뒤)
      const next = new Date();
      next.setMonth(next.getMonth() + 1);

      await supabaseAdmin.from('subscriptions').upsert(
        {
          customer_key: customerKey,
          billing_key: billingKey,
          plan: order.plan,
          monthly_fee: order.monthly_fee,
          status: 'active',
          next_billing_at: next.toISOString().slice(0, 10),
        },
        { onConflict: 'customer_key' }
      );

      // 4) 주문 상태 업데이트
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid' })
        .eq('order_id', orderId);

      // 5) 결제 이력 저장
      await supabaseAdmin.from('payments').insert({
        order_id: orderId,
        customer_key: customerKey,
        payment_key: result.paymentKey,
        amount: order.amount,
        kind: 'first',
        status: result.status,
        raw: result,
      });

      return NextResponse.json({ amount: order.amount });
    } catch (tosError: any) {
      console.error('토스 API 오류:', tosError);
      return NextResponse.json(
        { message: tosError.message || '결제 처리 실패' },
        { status: 500 }
      );
    }
  } catch (e: any) {
    console.error('빌링 승인 중 오류:', e);
    return NextResponse.json({ message: '결제 처리 실패' }, { status: 500 });
  }
}