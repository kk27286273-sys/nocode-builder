import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { issueBillingKey, chargeBilling } from '@/lib/toss';
import { getPlan } from '@/lib/plans';

export async function POST(req: NextRequest) {
  try {
    const { customerKey, authKey, orderId } = await req.json();

    if (!customerKey || !authKey || !orderId) {
      return NextResponse.json(
        { message: '필수 정보 누락' },
        { status: 400 }
      );
    }

    // 금액은 DB에서만 읽는다.
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { message: '주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (order.customer_key !== customerKey) {
      return NextResponse.json(
        { message: '주문 정보가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 구축비는 제외하고 월 구독료만 결제한다.
    const billingAmount = order.monthly_fee;

    if (!billingAmount || billingAmount <= 0) {
      return NextResponse.json(
        { message: '월 구독료 금액이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // 이미 결제된 주문
    if (order.status === 'paid') {
      return NextResponse.json({
        message: '이미 결제된 주문입니다.',
        amount: billingAmount,
      });
    }

    const review = () => NextResponse.json({
      code: 'BILLING_REVIEW_REQUIRED',
      message: '주문 상태 확인이 필요합니다. 다시 결제하지 말고 주문번호로 문의해 주세요.',
    }, { status: 503 });

    if (order.status !== 'pending') return review();

    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('email,name')
      .eq('customer_key', customerKey)
      .single();
    if (customerError || !customer) {
      return NextResponse.json({ message: '고객 정보를 확인할 수 없습니다.' }, { status: 503 });
    }

    const { data: claimed, error: claimError } = await supabaseAdmin.rpc('claim_first_billing', {
      p_order_id: orderId, p_customer_key: customerKey, p_amount: billingAmount,
    });
    if (claimError || claimed !== true) return review();

    try {
      const { billingKey } = await issueBillingKey(authKey, customerKey);
      const planInfo = getPlan(order.plan);
      const payment = await chargeBilling({
        billingKey,
        customerKey,
        amount: billingAmount,
        orderId,
        orderName: 'Nexia ' + planInfo.name + ' 첫 달 구독료',
        customerEmail: customer.email,
        customerName: customer.name,
      });

      const next = new Date();
      next.setMonth(next.getMonth() + 1);
      const { error: completionError } = await supabaseAdmin.rpc('complete_first_billing', {
        p_order_id: orderId,
        p_customer_key: customerKey,
        p_billing_key: billingKey,
        p_next_billing_at: next.toISOString().slice(0, 10),
        p_payment: payment,
      });
      if (completionError) {
        console.error('첫 결제 저장 실패', { orderId, code: completionError.code });
        return review();
      }
      return NextResponse.json({ amount: billingAmount });
    } catch {
      console.error('첫 결제 상태 확인 필요', { orderId });
      return review();
    }
  } catch (e: any) {
    console.error('빌링 승인 중 오류:', e);

    return NextResponse.json(
      { message: '결제 처리 실패' },
      { status: 500 }
    );
  }
}