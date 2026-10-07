'use client';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 font-sans text-slate-800 leading-relaxed">
      <h1 className="text-3xl font-extrabold mb-8 text-slate-900">서비스 이용약관 및 환불정책</h1>
      
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2 text-slate-900">1. 서비스 제공 기간</h2>
          <p>본 서비스는 정기 구독형 솔루션으로, 결제 완료 시점으로부터 1개월(또는 선택한 구독 기간) 동안 서비스 이용 권한이 제공됩니다.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-slate-900">2. 환불 정책</h2>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <p><strong>[전액 환불]</strong> 결제 후 7일 이내에 서비스를 이용(사이트 발행 및 도메인 연결 등)하지 않은 경우 전액 환불이 가능합니다.</p>
            <p><strong>[부분 환불]</strong> 서비스 이용 중 중도 해지를 원하실 경우, 이용 기간을 제외한 잔여 금액에 대해 환불 절차를 진행합니다. (단, 프로모션 할인 적용 상품은 제외될 수 있습니다.)</p>
            <p><strong>[환불 불가]</strong> 이미 발행된 사이트의 유지보수 비용이 포함된 경우나, 서비스 제공 기간이 경과한 경우에는 환불이 제한될 수 있습니다.</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2 text-slate-900">3. 서비스 이용 제한</h2>
          <p>불법적인 콘텐츠 게시, 타인의 권리 침해, 시스템 공격 등 서비스 운영에 위해를 가하는 행위가 발견될 경우 사전 통보 없이 서비스 이용이 제한될 수 있습니다.</p>
        </div>
      </section>
      
      <div className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        티에이치소프트 | 문의: 010-2948-2728
      </div>
    </div>
  );
}