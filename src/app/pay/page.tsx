'use client';

export default function PayPage() {
  const startPayment = () => {
    const params = {
      clientKey: 'test_ck_Z61JOxRQVENyaaewWlDRrW0X9bAq',
      amount: 39000,
      orderId: 'ORDER_' + Date.now(),
      orderName: 'TH소프트 이용권',
      successUrl: window.location.origin + '/checkout/success',
      failUrl: window.location.origin + '/checkout/fail',
    };

    const queryString = new URLSearchParams(params).toString();
    window.location.href = `https://checkout.tosspayments.com/payment/v1/checkout?${queryString}`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '20px', backgroundColor: '#f8fafc' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>결제 테스트 페이지</h1>
      <p>이 버튼을 누르면 토스 결제창으로 즉시 이동합니다.</p>
      <button 
        onClick={startPayment}
        style={{ padding: '15px 30px', backgroundColor: '#000', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        결제하기 (강제 이동)
      </button>
    </div>
  );
}