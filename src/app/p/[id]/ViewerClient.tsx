'use client';

import React, { useState, useEffect } from 'react';
import { B2BTemplateData, defaultB2BTemplate } from '@/data/templates';
import { supabase } from '@/lib/supabase/client';

export interface ViewerClientProps {
  data?: B2BTemplateData;
  siteId?: string;
  [key: string]: any;
}

export default function ViewerClient({
  data: initialData,
  siteId,
}: ViewerClientProps) {
  const [data, setData] = useState<B2BTemplateData>(
    initialData || defaultB2BTemplate
  );
  const [loading, setLoading] = useState<boolean>(!initialData && !!siteId);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 법적 약관 모달 상태 관리
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      setLoading(false);
      return;
    }

    if (siteId) {
      setLoading(true);
      supabase
        .from('sites')
        .select('data')
        .eq('id', siteId)
        .single()
        .then(({ data: siteRecord, error }) => {
          if (!error && siteRecord?.data) {
            setData(siteRecord.data);
          }
          setLoading(false);
        });
    }
  }, [initialData, siteId]);

  const fs = data?.fontSizes || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      alert(
        '상담 및 견적 문의가 정상적으로 접수되었습니다. 담당자가 신속히 연락드리겠습니다.'
      );
      setFormData({ name: '', phone: '', message: '' });
      setPrivacyAgreed(false);
      setIsSubmitting(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-slate-500 text-sm font-semibold">
          페이지를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* 상단 네비게이션 바 (GNB) */}
      <header className="h-20 border-b border-slate-100 px-6 md:px-12 flex items-center justify-between bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {data?.company?.logoUrl && (
            <img
              src={data.company.logoUrl}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          )}
          <span
            style={{ fontSize: `${fs.companyName || 20}px` }}
            className="font-extrabold tracking-tight text-slate-900"
          >
            {data?.company?.name || '기업명'}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {data?.navigation?.navLinks?.map((nav, idx) => (
            <a
              key={idx}
              href={`#${nav.targetId}`}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              {nav.label}
            </a>
          ))}
          <a
            href={`tel:${data?.supportPhone}`}
            style={{ backgroundColor: data?.themeColor || '#0284C7' }}
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full shadow hover:opacity-95 transition"
          >
            전화 상담 문의
          </a>
        </nav>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className="py-20 md:py-28 px-6 text-center bg-gradient-to-b from-slate-50 to-white flex flex-col items-center">
        {data?.hero?.badge && (
          <span
            style={{
              fontSize: `${fs.heroBadge || 14}px`,
              color: data.themeColor || '#0284C7',
              backgroundColor: `${data.themeColor || '#0284C7'}15`,
            }}
            className="font-bold px-4 py-1.5 rounded-full mb-6 inline-block"
          >
            {data.hero.badge}
          </span>
        )}
        <h1
          style={{ fontSize: `${fs.heroTitle || 36}px` }}
          className="font-extrabold text-slate-900 leading-tight mb-6 whitespace-pre-line tracking-tight max-w-4xl"
        >
          {data?.hero?.title}
        </h1>
        <p
          style={{ fontSize: `${fs.heroSubtitle || 18}px` }}
          className="text-slate-600 max-w-2xl leading-relaxed mb-10"
        >
          {data?.hero?.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#contact-form"
            style={{ backgroundColor: data?.themeColor || '#0284C7' }}
            className="w-full sm:w-auto text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:opacity-95 transition text-base"
          >
            무료 견적 신청하기
          </a>
          <a
            href={`tel:${data?.supportPhone}`}
            className="w-full sm:w-auto bg-white border border-slate-300 text-slate-700 font-bold px-8 py-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-base"
          >
            전화 바로걸기
          </a>
        </div>
      </section>

      {/* 파트너사 및 인증 보증 섹션 */}
      {data?.partnersSection?.enabled && (
        <section className="py-12 border-y border-slate-100 bg-slate-50/60 px-6 text-center">
          <h2
            style={{ fontSize: `${fs.partnersTitle || 16}px` }}
            className="font-semibold text-slate-500 mb-6"
          >
            {data.partnersSection.title}
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-5xl mx-auto">
            {data.partnersSection.partners.map((partner, idx) => (
              <span
                key={idx}
                className="px-5 py-2.5 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 주요 실적 지표 섹션 */}
      <section id="stats" className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {data?.stats?.map((stat, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div
                style={{
                  fontSize: `${fs.statsValue || 32}px`,
                  color: data.themeColor || '#0284C7',
                }}
                className="font-black mb-2"
              >
                {stat.value}
              </div>
              <div
                style={{ fontSize: `${fs.statsLabel || 14}px` }}
                className="font-medium text-slate-600"
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 핵심 솔루션 / 시공 분야 섹션 */}
      <section id="solutions" className="py-24 px-6 bg-slate-50/40">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2
            style={{ fontSize: `${fs.sectionTitle || 28}px` }}
            className="font-bold text-slate-900 mb-4"
          >
            {data?.solutionsSection?.title || '핵심 전문 분야'}
          </h2>
          <p
            style={{ fontSize: `${fs.sectionSubtitle || 16}px` }}
            className="text-slate-600"
          >
            {data?.solutionsSection?.subtitle}
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {data?.solutions?.map((sol, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition"
            >
              <div
                style={{
                  backgroundColor: `${data?.themeColor || '#0284C7'}20`,
                }}
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 font-bold text-lg"
              >
                0{idx + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {sol.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {sol.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 고객 후기 섹션 */}
      <section id="reviews" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2
            style={{ fontSize: `${fs.sectionTitle || 28}px` }}
            className="font-bold text-slate-900 mb-4"
          >
            {data?.reviewsSection?.title || '실제 고객 만족 후기'}
          </h2>
          <p
            style={{ fontSize: `${fs.sectionSubtitle || 16}px` }}
            className="text-slate-600"
          >
            {data?.reviewsSection?.subtitle}
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {data?.reviews?.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between"
            >
              <p className="text-slate-700 leading-relaxed mb-6 italic">
                "{rev.content}"
              </p>
              <div>
                <div className="font-bold text-slate-900">{rev.author}</div>
                <div className="text-xs text-slate-500">{rev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 자주 묻는 질문 (FAQ) 섹션 */}
      <section id="faqs" className="py-24 px-6 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2
            style={{ fontSize: `${fs.sectionTitle || 28}px` }}
            className="font-bold text-slate-900 text-center mb-12"
          >
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            {data?.faqs?.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
              >
                <h3
                  style={{ fontSize: `${fs.faqQuestion || 18}px` }}
                  className="font-bold text-slate-900 mb-2 flex items-center gap-2"
                >
                  <span style={{ color: data?.themeColor || '#0284C7' }}>Q.</span>
                  {faq.question}
                </h3>
                <p
                  style={{ fontSize: `${fs.faqAnswer || 15}px` }}
                  className="text-slate-600 leading-relaxed pl-6"
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 빠른 견적 상담 신청 폼 */}
      <section id="contact-form" className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <span
              style={{ color: data?.themeColor || '#0284C7' }}
              className="text-xs font-bold tracking-wider uppercase mb-2 block"
            >
              Online Inquiry
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              빠른 견적 및 현장 실측 신청
            </h2>
            <p className="text-sm text-slate-600">
              문의 내용을 남겨주시면 확인 후 담당자가 신속히 연락드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                성함 / 담당자명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="홍길동"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="010-1234-5678"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                시공 및 견적 문의 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="시공 장소(지역), 평수, 희망 일정 등 상세 내용을 적어주세요."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>

            {/* 필수 개인정보 수집 및 이용 동의 */}
            <div className="pt-2 pb-1">
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 leading-relaxed mb-2.5 max-h-24 overflow-y-auto">
                <strong>[개인정보 수집 및 이용 안내]</strong>
                <br />
                1. 수집 항목: 성함, 연락처, 문의 내용
                <br />
                2. 수집 목적: 견적 상담 응대 및 현장 방문 일정 안내
                <br />
                3. 보유 기간: 문의 처리 완료 후 1년간 보관 후 파기
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  required
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span>
                  <span className="text-red-500">[필수]</span> 개인정보 수집 및 이용에 동의합니다.{' '}
                  <button
                    type="button"
                    onClick={() => setActiveModal('privacy')}
                    className="text-sky-600 underline font-normal ml-1"
                  >
                    [전문보기]
                  </button>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: data?.themeColor || '#0284C7' }}
              className="w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-95 disabled:opacity-50 transition mt-2 cursor-pointer"
            >
              {isSubmitting ? '접수 중...' : '무료 견적 상담 신청하기'}
            </button>
          </form>
        </div>
      </section>

      {/* 법정 필수 정보 표기 푸터 영역 */}
      <footer
        id="contact"
        className="py-12 px-6 md:px-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-2">
            <div className="text-base font-bold text-white">
              {data?.footer?.companyName || data?.company?.name}
            </div>
            <p className="leading-relaxed text-slate-400">
              대표자: {data?.footer?.ownerName || '대표자명'} | 사업자등록번호: {data?.footer?.businessNumber || '000-00-00000'}
              <br />
              사업장 소재지: {data?.footer?.address || '사업장 주소지'}
              <br />
              대표 이메일: {data?.footer?.contactEmail || 'contact@example.com'} | 호스팅 제공자: Vercel Inc.
            </p>
            {/* 법적 필수 약관 링크 모음 */}
            <div className="flex items-center gap-3 pt-2 text-slate-500 font-medium">
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className="hover:text-slate-300 underline underline-offset-4"
              >
                이용약관 및 환불정책
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className="hover:text-slate-300 underline underline-offset-4"
              >
                개인정보처리방침
              </button>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0">
            <div className="text-sm font-semibold text-white mb-1">
              고객센터 및 상담
            </div>
            <div
              style={{ color: data?.themeColor || '#38BDF8' }}
              className="text-xl font-black mb-2"
            >
              {data?.supportPhone}
            </div>
            <p className="text-slate-500">
              © {data?.footer?.companyName || data?.company?.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 2 & 4. 이용약관 및 저작권·환불 규정 통합 모달 */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">서비스 이용약관 및 작업·환불 규정</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm">제1조 (목적 및 서비스 범위)</h4>
                <p>본 약관은 {data?.footer?.companyName || '당사'}가 제공하는 맞춤형 웹사이트 제작 및 서버·도메인 운영 관리 대행 서비스의 이용조건 및 권리·의무 관계를 규정함을 목적으로 합니다.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm">제2조 (지적재산권 귀속 및 저작권 책임)</h4>
                <p>
                  1. 당사가 제공한 빌더 코어 시스템, 기본 엔진 코드 및 전용 템플릿 아키텍처의 원천 지적재산권은 당사에 귀속되며, 고객사는 계약 기간 동안 웹사이트 운영 및 사용 권한을 가집니다.<br />
                  2. <strong>[고객 자료 라이선스 책임]</strong> 고객사가 직접 전달한 상표, 로고, 이미지, 폰트, 문구 등의 저작권 침해로 인한 일체의 법적 분쟁 및 손해배상 책임은 고객사에게 있습니다.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm">제3조 (제작비 및 용역 환불 규정)</h4>
                <p>
                  본 서비스는 고객사별 요구사항에 맞춰 인력이 즉시 투입되는 개별 주문 제작 용역입니다.<br />
                  1. <strong>작업 착수 전:</strong> 결제 금액 전액(100%) 환불<br />
                  2. <strong>1차 시안(초안 사이트 링크) 제공 전:</strong> 총 제작비의 50% 공제 후 환불<br />
                  3. <strong>1차 시안 납품 및 검토 단계 이후:</strong> 용역 결과물 제공 완료로 간주하여 <strong>제작비 환불 불가</strong>
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm">제4조 (정기 관리비 및 중도 해지)</h4>
                <p>
                  1. <strong>월 결제 이용 시:</strong> 당월 서비스 개시 이후 당월 이용료는 환불되지 않으며, 해지 신청 익월부터 청구가 중단됩니다.<br />
                  2. <strong>연 결제(1년 일시납 할인형) 중도 해지 시:</strong> 할인 전 정상 월 이용료(정가)를 기준으로 사용 개월 수를 계산하여 공제한 뒤 잔여금을 환불합니다.<br />
                  * 환불액 = 연 결제 총액 - (실제 이용 개월 수 × 정가 월 관리비) - 해지 위약금(잔여 금액의 10%)
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm">제5조 (실비성 비용 제외)</h4>
                <p>이미 등록기관에 결제 및 등록이 완료된 도메인 구입비(연 단위 실비)는 취소 및 환불이 불가능하며, 소유권은 고객사에게 유지됩니다.</p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 개인정보처리방침 모달 */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">개인정보처리방침</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
              <p>{data?.footer?.companyName || '당사'}는 고객의 개인정보를 소중하게 생각하며, '개인정보 보호법'을 준수하고 있습니다.</p>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">1. 수집하는 개인정보 항목</h4>
                <p>- 필수항목: 성함/담당자명, 연락처, 견적 및 문의 내용</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">2. 개인정보의 수집 및 이용 목적</h4>
                <p>- 웹사이트 제작 견적 산출, 시공 상담, 현장 실측 일정 조율 및 고객 문의 응대</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">3. 보유 및 이용 기간</h4>
                <p>- 상담 및 계약 이행 완료 후 분쟁 조정을 위하여 1년간 보관 후 지체 없이 영구 파기합니다.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">4. 개인정보 보호책임자</h4>
                <p>
                  - 성명: 김태헌 (대표자)<br />
                  - 문의: kk272862@naver.com
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}