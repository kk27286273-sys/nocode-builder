'use client';

import React from 'react';

interface PricingPlan {
  name: string;
  price: number;
  setupFee: number;
  description: string;
  features: string[];
  buttonText: string;
  buttonUrl: string;
  isPopular?: boolean;
}

interface PricingSectionProps {
  plans?: PricingPlan[];
  themeColor?: string;
}

export default function PricingSection({
  plans,
  themeColor = '#2563eb',
}: PricingSectionProps) {
  const defaultPlans: PricingPlan[] = [
    {
      name: 'Basic',
      price: 59000,
      setupFee: 700000,
      description: '개인사업자 및 소규모 비즈니스',
      features: [
        '기본 SEO 최적화',
        '도메인 & 서버 관리',
        '보안 포함',
        '텍스트·이미지 무료 수정',
        '수정 요청 72시간 이내 반영',
      ],
      buttonText: '시작하기',
      buttonUrl: 'https://thsoft.co.kr/pay?plan=basic',
    },
    {
      name: 'Pro',
      price: 79000,
      setupFee: 1000000,
      description: '성장하는 중소기업을 위한 최고의 선택',
      features: [
        '모든 Basic 기능 포함',
        '멀티페이지 2장',
        '외부 URL·전화·카카오톡 연결 무료 변경',
        '우선 고객지원',
        '수정 요청 72시간 이내 반영',
      ],
      buttonText: '지금 시작',
      buttonUrl: 'https://thsoft.co.kr/pay?plan=pro',
      isPopular: true,
    },
    {
      name: 'Premium',
      price: 99000,
      setupFee: 1200000,
      description: '규모 있는 기업을 위한 완전한 솔루션',
      features: [
        '모든 Pro 기능 포함',
        '멀티페이지 4장',
        '전담 매니저 배정',
        '수정 요청 24시간 이내 반영',
        '외부 시스템 연동 상담 (범위별 별도 견적)',
      ],
      buttonText: '프리미엄 선택',
      buttonUrl: 'https://thsoft.co.kr/pay?plan=premium',
    },
  ];

  const displayPlans = plans || defaultPlans;

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            투명한 요금제
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            비즈니스 규모에 맞는 플랜을 선택하세요
          </p>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 md:items-start">
          {displayPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-slate-900 text-white shadow-2xl md:scale-105'
                  : 'border border-slate-200 bg-white text-slate-900'
              }`}
              style={
                plan.isPopular
                  ? { boxShadow: `0 0 0 2px #ffffff, 0 0 0 4px ${themeColor}` }
                  : undefined
              }
            >
              {/* Most Popular 배지 */}
              {plan.isPopular && (
                <div
                  className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  Most Popular
                </div>
              )}

              <div className="space-y-6 p-6 sm:p-8">
                {/* 플랜명 */}
                <div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p
                    className={`mt-2 text-sm ${
                      plan.isPopular ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* 가격 */}
                <div
                  className="border-b border-t py-4"
                  style={{
                    borderColor: plan.isPopular
                      ? 'rgba(255,255,255,0.12)'
                      : '#e2e8f0',
                  }}
                >
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      {plan.price.toLocaleString()}원
                    </span>
                    <span
                      className={`text-sm ${
                        plan.isPopular ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      / 월
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-xs leading-relaxed ${
                      plan.isPopular ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    구축비 {plan.setupFee.toLocaleString()}원 별도
                    <br />
                    첫 결제는 구축비 + 첫 달 이용료{' '}
                    {(plan.setupFee + plan.price).toLocaleString()}원
                  </p>
                </div>

                {/* 기능 목록 */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0"
                        style={{ color: plan.isPopular ? '#ffffff' : themeColor }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA 버튼 */}
                <a
                  href={plan.buttonUrl}
                  className={`block w-full rounded-lg px-4 py-3 text-center font-bold transition-all duration-200 ${
                    plan.isPopular
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={
                    plan.isPopular ? undefined : { backgroundColor: themeColor }
                  }
                >
                  {plan.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="mt-12 rounded-lg bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">
            모든 플랜에 기본 SEO, 도메인, 서버 관리, 보안이 포함됩니다.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            텍스트·이미지·외부 URL·전화·문자·카카오톡 연결 변경은 무료입니다.
            <br />
            추가 작업은 버튼 1개 10,000원 · 섹션 1개 30,000원 · 페이지 1개
            50,000원이며, 구조 변경과 외부 시스템 연동은 별도 협의합니다.
          </p>
        </div>
      </div>
    </section>
  );
}