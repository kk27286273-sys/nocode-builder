import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 토스페이먼츠 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from('test_sk_XXXXX:').toString('base64')}`, // 'test_sk_XXXXX'를 실제 시크릿키로 변경
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    if (!response.ok) {
      return NextResponse.json({ message: '결제 승인 실패' }, { status: response.status });
    }

    // 여기서 Supabase에 결제 완료 상태 저장 로직을 추가하면 됩니다.
    
    return NextResponse.json({ message: '결제 승인 성공' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
}