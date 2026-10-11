import Link from 'next/link';

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-2">개인정보 처리방침</h1>
        <p className="text-sm text-slate-500 mb-8">최종 수정일: 2026년 10월 11일</p>

        <div className="prose prose-sm max-w-none space-y-8 text-slate-700">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. 개인정보 수집 및 이용 목적</h2>
            <p className="mb-3">
              티에이치소프트(이하 "회사")는 다음의 목적을 위하여 개인정보를 수집 및 이용합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>서비스 제공 및 계약 이행 (구축, 관리, 기술 지원)</li>
              <li>결제 처리 및 정산</li>
              <li>고객 상담 및 문의 대응</li>
              <li>서비스 개선 및 신규 서비스 개발</li>
              <li>법적 의무 이행</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. 수집하는 개인정보의 항목</h2>
            <p className="mb-3">회사는 다음과 같은 개인정보를 수집합니다.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>필수 항목: 이름, 이메일, 전화번호, 사업자등록번호</li>
              <li>결제 정보: 결제 수단, 거래 내역 (실제 결제 정보는 토스페이먼츠에서 관리)</li>
              <li>선택 항목: 회사명, 사업장 주소 등 추가 정보</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              개인정보는 서비스 제공 기간 동안 보유하며, 서비스 종료 후 3개월 이내에 파기합니다.
              단, 법령에 따라 보존이 필요한 경우는 해당 기간 동안 보유합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="mb-3">
              회사는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>결제 처리를 위해 토스페이먼츠에 제공</li>
              <li>도메인 등록을 위해 도메인 등록업체에 제공</li>
              <li>법령에 따른 의무 이행 시</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. 개인정보 보안</h2>
            <p>
              회사는 개인정보 보호를 위해 암호화, 접근 제한 등 필요한 기술적·관리적 조치를 취하고 있습니다.
              결제 정보는 토스페이먼츠의 보안 시스템을 통해 관리됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. 개인정보 주체의 권리</h2>
            <p className="mb-3">
              개인정보 주체는 언제든지 다음의 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>개인정보 열람 요청</li>
              <li>개인정보 수정·삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
            </ul>
            <p className="mt-3">
              위 권리 행사는 고객센터(010-2948-2728)로 문의하시면 됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. 쿠키 및 추적 기술</h2>
            <p>
              회사는 서비스 이용 통계, 사용자 경험 개선을 위해 쿠키를 사용할 수 있습니다.
              사용자는 브라우저 설정을 통해 쿠키 사용을 거부할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. 개인정보 처리 방침 변경</h2>
            <p>
              본 방침은 법령 변경 또는 회사 정책 변경에 따라 수정될 수 있으며,
              변경 시 웹사이트를 통해 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. 문의</h2>
            <p>
              개인정보 처리 관련 문의는 아래로 연락주시기 바랍니다.
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