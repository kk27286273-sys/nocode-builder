import { NextRequest, NextResponse } from 'next/server';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
const TOSS_API_URL = 'https://api.tosspayments.com/v1/payments';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { message: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (!TOSS_SECRET_KEY) {
      console.error('TOSS_SECRET_KEY 환경변수 미설정');
      return NextResponse.json(
        { message: '결제 설정 오류' },
        { status: 500 }
      );
    }

    // 토스 결제 승인 API 호출
    const response = await fetch(`${TOSS_API_URL}/${paymentKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
      },
      body: JSON.stringify({
        orderId,
        amount: Number(amount),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('토스 승인 실패:', result);
      return NextResponse.json(
        { message: result.message || '결제 승인에 실패했습니다.' },
        { status: response.status }
      );
    }

    // 승인 성공 → 빌링결제 등록 (다음 달부터 자동 결제)
    // 여기서는 결제 정보를 DB에 저장하는 로직 추가 가능
    console.log('결제 승인 성공:', result);

    return NextResponse.json({
      message: '결제가 승인되었습니다.',
      data: result,
    });
  } catch (error) {
    console.error('결제 승인 중 오류:', error);
    return NextResponse.json(
      { message: '결제 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}