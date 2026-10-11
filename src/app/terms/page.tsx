import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-slate-200 px-6 py-5">
        <div className="mx-auto max-w-4xl">
          <Link href="/" className="text-xl font-black tracking-[0.18em] text-slate-900">
            NEXIA
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-16 text-slate-900">
        <h1 className="text-4xl font-bold mb-2">서비스 이용약관</h1>
        <p className="text-sm text-slate-500 mb-8">최종 수정일: 2026년 10월 11일</p>

        <div className="prose prose-sm max-w-none space-y-8 text-slate-700">

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. 서비스 개요</h2>
            <p>
              Nexia는 웹사이트 제작 및 월간 관리 서비스를 제공하는 플랫폼입니다.
              고객은 선택한 요금제에 따라 웹사이트 구축, 도메인 제공, 호스팅, 기술 지원을 받습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. 서비스 제공 기간</h2>
            <p className="mb-3">
              본 서비스는 정기 구독형 솔루션으로, 결제 완료 시점으로부터 1개월(또는 선택한 구독 기간) 동안 서비스 이용 권한이 제공됩니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Basic:</strong> 원페이지, 월 3영업일 이내 수정</li>
              <li><strong>Pro:</strong> 멀티페이지 2장, 72시간 이내 수정 (연중무휴)</li>
              <li><strong>Premium:</strong> 멀티페이지 4장, 24시간 이내 수정 (연중무휴), 최적화 유지, 월간 리포트</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. 환불 정책</h2>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-3 mt-4">[전액 환불]</h3>
            <p>
              결제 후 7일 이내에 서비스를 이용(사이트 발행 및 도메인 연결 등)하지 않은 경우 전액 환불이 가능합니다.
            </p>

            <h3 className="text-lg font-semibold text-slate-900 mb-3 mt-4">[부분 환불]</h3>
            <p>
              서비스 이용 중 중도 해지를 원하실 경우, 이용 기간을 제외한 잔여 금액에 대해 환불 절차를 진행합니다.
              (단, 프로모션 할인 적용 상품은 제외될 수 있습니다.)
            </p>

            <h3 className="text-lg font-semibold text-slate-900 mb-3 mt-4">[환불 불가]</h3>
            <p>
              이미 발행된 사이트의 유지보수 비용이 포함된 경우나, 서비스 제공 기간이 경과한 경우에는 환불이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. 추가 비용</h2>
            <p className="mb-3">
              기본 서비스 외에 다음 항목에 대해 추가 비용이 발생합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>버튼 추가: 1만원</li>
              <li>섹션 추가: 3만원</li>
              <li>페이지 추가: 5만원</li>
              <li>외부 연동: 범위 확인 후 별도 견적</li>
              <li>구조 변경: 별도 협의</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. 포함 서비스</h2>
            <p className="mb-3">
              모든 요금제에는 다음이 포함됩니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>기본 SEO 최적화</li>
              <li>도메인 제공 (1년)</li>
              <li>웹 호스팅 및 서버 관리</li>
              <li>보안 인증서 (SSL)</li>
              <li>텍스트, 이미지, 외부 URL, 전화, 문자, 카카오톡 연결 변경 (무료)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. 서비스 이용 제한</h2>
            <p className="mb-3">
              다음의 행위가 발견될 경우 사전 통보 없이 서비스 이용이 제한될 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>불법적인 콘텐츠 게시</li>
              <li>타인의 권리 침해</li>
              <li>시스템 공격 또는 악용</li>
              <li>서비스 운영에 위해를 가하는 행위</li>
              <li>약관 위반 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. 구독 취소 및 해지</h2>
            <p className="mb-3">
              고객은 언제든지 구독을 취소할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>구독 취소는 당월 말일까지 유효합니다.</li>
              <li>취소 신청 후 해당 월까지 서비스가 제공됩니다.</li>
              <li>구독료 환불은 환불 정책에 따라 처리됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. 책임 제한</h2>
            <p>
              회사는 천재지변, 서비스 점검, 고객의 부주의로 인한 손실에 대해 책임을 지지 않습니다.
              서비스 이용 중 발생한 데이터 손실에 대해서도 책임을 제한합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. 약관 변경</h2>
            <p>
              회사는 법령 변경 또는 운영상 필요에 따라 약관을 변경할 수 있으며,
              변경 시 웹사이트를 통해 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. 문의</h2>
            <p>
              서비스 이용 관련 문의는 아래로 연락주시기 바랍니다.
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p><strong>티에이치소프트</strong></p>
              <p>대표자: 김태헌</p>
              <p>사업자등록번호: 599-18-02634</p>
              <p>연락처: 010-2948-2728</p>
              <p>주소: 경상북도 구미시 수출대로3길 130, (공단동 우림필유아파트) 108동 101호</p>
            </div>
          </section>

        </div>
      </article>

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8 mt-16">
        <div className="mx-auto max-w-4xl text-center text-sm text-slate-600">
          <p>© 2026 TH SOFT. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}