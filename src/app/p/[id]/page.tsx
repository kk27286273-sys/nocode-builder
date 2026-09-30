'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PublishedSitePage() {
  const params = useParams();
  const siteId = params?.id as string;

  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!siteId) return;

    async function fetchSite() {
      try {
        const { data, error } = await supabase
          .from('sites')
          .select('*')
          .eq('id', siteId)
          .single();

        if (error) {
          console.error('Error fetching site:', error);
        } else if (data) {
          setSiteData(data.content || data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSite();
  }, [siteId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('성함과 연락처를 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([
        {
          site_id: siteId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        message: '',
      });
      alert('상담 신청이 정상적으로 접수되었습니다.');
    } catch (err: any) {
      console.error('Lead submit error:', err);
      alert('신청 접수 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 text-sm">
        페이지를 불러오는 중입니다...
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        존재하지 않거나 삭제된 페이지입니다.
      </div>
    );
  }

  const {
    companyName = '주식회사 비즈니스',
    heroTitle = '스마트한 기업 운영을 위한 최적의 엔터프라이즈 솔루션',
    heroSubtitle = '검증된 기술력과 맞춤형 전략으로 비즈니스의 성공적인 디지털 전환을 이끕니다.',
    themeColor = '#2563EB',
    partners = [],
    stats = [],
    solutions = [],
    reviews = [],
    faqs = [],
    footer = {},
  } = siteData;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased overflow-x-hidden">
      {/* GNB */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <a href="#" className="text-lg md:text-xl font-bold tracking-tight text-gray-900">
            {companyName}
          </a>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#solutions" className="hover:text-gray-900 transition-colors">솔루션</a>
            <a href="#stats" className="hover:text-gray-900 transition-colors">실적 지표</a>
            <a href="#reviews" className="hover:text-gray-900 transition-colors">고객 후기</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">자주 묻는 질문</a>
          </nav>

          <div className="hidden md:block">
            <a
              href="#contact"
              style={{ backgroundColor: themeColor }}
              className="text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90 inline-block"
            >
              상담 신청
            </a>
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3">
            <a
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              솔루션
            </a>
            <a
              href="#stats"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              실적 지표
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              고객 후기
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              자주 묻는 질문
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{ backgroundColor: themeColor }}
              className="block w-full text-center text-white text-base font-medium py-3 rounded-lg mt-4"
            >
              무료 상담 신청하기
            </a>
          </div>
        )}
      </header>

      {/* Hero 섹션 */}
      <section className="py-14 md:py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <span
            style={{ color: themeColor }}
            className="inline-block text-xs md:text-sm font-semibold tracking-wider uppercase mb-3"
          >
            Enterprise Professional Partner
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight md:leading-tight mb-4 md:mb-6 break-keep">
            {heroTitle}
          </h1>
          <p className="text-base md:text-xl text-gray-600 leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto break-keep">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#contact"
              style={{ backgroundColor: themeColor }}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white rounded-lg transition-opacity hover:opacity-90 text-center"
            >
              무료 컨설팅 신청
            </a>
            <a
              href="#solutions"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
            >
              솔루션 살펴보기
            </a>
          </div>
        </div>
      </section>

      {/* 파트너사 섹션 */}
      {partners && partners.length > 0 && (
        <section className="py-8 md:py-12 border-b border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <p className="text-center text-xs md:text-sm text-gray-400 font-medium mb-6">
              주요 협력 및 프로젝트 수행 레퍼런스
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 items-center justify-center opacity-70">
              {partners.map((partner: any, idx: number) => (
                <div key={idx} className="flex items-center justify-center p-2 text-center text-sm md:text-base font-bold text-gray-500">
                  {partner.name || partner}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 실적 지표 섹션 */}
      {stats && stats.length > 0 && (
        <section id="stats" className="py-14 md:py-20 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat: any, idx: number) => (
                <div key={idx} className="text-center p-4">
                  <div
                    style={{ color: themeColor }}
                    className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1"
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium break-keep">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 솔루션 섹션 */}
      {solutions && solutions.length > 0 && (
        <section id="solutions" className="py-14 md:py-24 bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 break-keep">
                신뢰할 수 있는 전용 솔루션 라인업
              </h2>
              <p className="text-sm md:text-base text-gray-600 break-keep">
                기업의 비즈니스 구조와 성장 단계에 맞춘 전문 맞춤형 서비스 모듈입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {solutions.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col"
                >
                  {item.image && (
                    <div className="w-full h-44 md:h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 break-keep">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed break-keep">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 고객 후기 섹션 */}
      {reviews && reviews.length > 0 && (
        <section id="reviews" className="py-14 md:py-24 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 break-keep">
                함께한 파트너 고객들의 평가
              </h2>
              <p className="text-sm md:text-base text-gray-600 break-keep">
                실제 서비스 적용을 통해 성과를 창출한 기업 담당자들의 이야기입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {reviews.map((rev: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-100 flex flex-col justify-between">
                  <p className="text-sm md:text-base text-gray-700 italic mb-6 break-keep leading-relaxed">
                    "{rev.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">{rev.author}</p>
                    <p className="text-xs md:text-sm text-gray-500">{rev.role || rev.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ 섹션 */}
      {faqs && faqs.length > 0 && (
        <section id="faq" className="py-14 md:py-24 bg-gray-50 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                자주 묻는 질문
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                도입 전 고객들이 가장 많이 문의하시는 사항입니다.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq: any, idx: number) => (
                <div key={idx} className="bg-white p-5 md:p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 break-keep">
                    {faq.question}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed break-keep">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 상담 신청 섹션 (Leads 폼) */}
      <section id="contact" className="py-14 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 break-keep">
              프로젝트 및 도입 상담 신청
            </h2>
            <p className="text-sm md:text-base text-gray-600 break-keep">
              기본 정보를 남겨주시면 담당 컨설턴트가 24시간 이내 연락드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                성함 / 직함 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="예: 홍길동 팀장"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="예: 010-1234-5678"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                회사명
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="예: 주식회사 샘플"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                이메일
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@company.com"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5">
                문의 내용
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="문의하실 프로젝트 범위나 요구사항을 간단히 적어주세요."
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{ backgroundColor: themeColor }}
              className="w-full py-4 text-white text-base font-bold rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50 mt-2"
            >
              {submitting ? '접수 처리 중...' : '상담 신청 완료하기'}
            </button>
          </form>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-400 py-10 md:py-16 text-xs md:text-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-6 md:mb-8">
            <span className="text-white font-bold text-base md:text-lg block mb-2">
              {companyName}
            </span>
            <p className="text-gray-400 max-w-md leading-relaxed break-keep">
              {footer.description || '기업 맞춤형 전문 웹 솔루션 및 비즈니스 전환 파트너'}
            </p>
          </div>

          <div className="border-t border-gray-800 pt-6 space-y-1.5 text-gray-400">
            {footer.representative && <p>대표자: {footer.representative}</p>}
            {footer.businessNumber && <p>사업자등록번호: {footer.businessNumber}</p>}
            {footer.address && <p>주소: {footer.address}</p>}
            {footer.contactEmail && <p>이메일: {footer.contactEmail}</p>}
            <p className="pt-4 text-gray-400">
              © {new Date().getFullYear()} {companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}