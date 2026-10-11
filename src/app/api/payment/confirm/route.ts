import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { message: '결제 설정이 완료되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 토스 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('토스 결제 승인 실패:', data);
      return NextResponse.json(
        { message: data.message || '결제 승인에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 결제 성공 - Supabase에 저장 (나중에 추가)
    console.log('결제 승인 성공:', data);

    return NextResponse.json(
      { message: '결제 승인 완료', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('결제 승인 중 오류:', error);
    return NextResponse.json(
      { message: '결제 승인 요청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
