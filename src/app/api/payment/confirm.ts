import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { message: '필수 결제 정보가 누락되었습니다.' },
        { status: 400 },
      );
    }

    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { message: '서버에 결제 키가 설정되지 않았습니다.' },
        { status: 500 },
      );
    }

    const encoded = Buffer.from(`${secretKey}:`).toString('base64');

    const response = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${encoded}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount),
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: result.message || '결제 승인에 실패했습니다.' },
        { status: response.status },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('결제 승인 오류:', error);
    return NextResponse.json(
      { message: '결제 승인 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
