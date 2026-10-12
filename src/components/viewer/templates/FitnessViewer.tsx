// src/components/viewers/FitnessViewer.tsx

'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type Class = {
  id: string;
  name: string;
  instructor: string;
  time: string;
  capacity: number;
  enrolled: number;
  level: 'beginner' | 'intermediate' | 'advanced';
};

type Membership = {
  id: string;
  name: string;
  price: number;
  duration: number;
  classes: number;
  features: string[];
  popular?: boolean;
};

type FitnessData = {
  hero?: {
    title: string;
    subtitle: string;
    backgroundImage?: string;
  };
  about?: {
    title: string;
    description: string;
    image?: string;
  };
  classes?: Class[];
  memberships?: Membership[];
  schedule?: {
    title: string;
    description: string;
    hours: Array<{
      day: string;
      open: string;
      close: string;
    }>;
  };
  location?: {
    address: string;
    phone: string;
    email: string;
    mapUrl?: string;
  };
  footer?: {
    companyName: string;
    address: string;
    phone: string;
  };
  kakaoLink?: string;
  themeColor?: string;
};

const DEFAULT_FITNESS_DATA: FitnessData = {
  hero: {
    title: '당신의 피트니스 목표를 달성하세요',
    subtitle: '전문 트레이너와 함께하는 맞춤형 운동 프로그램',
    backgroundImage: '',
  },
  about: {
    title: '우리는 누구인가',
    description:
      '최신 시설과 경험 많은 트레이너들이 당신의 건강한 삶을 응원합니다. 초보자부터 전문가까지 모두를 위한 프로그램을 제공합니다.',
    image: '',
  },
  classes: [
    {
      id: '1',
      name: 'HIIT 부트캠프',
      instructor: '김강사',
      time: '월·수·금 06:00',
      capacity: 20,
      enrolled: 18,
      level: 'intermediate',
    },
    {
      id: '2',
      name: '필라테스',
      instructor: '이강사',
      time: '화·목 10:00',
      capacity: 15,
      enrolled: 12,
      level: 'beginner',
    },
    {
      id: '3',
      name: '복싱 클래스',
      instructor: '박강사',
      time: '월·수·금 19:00',
      capacity: 12,
      enrolled: 10,
      level: 'intermediate',
    },
    {
      id: '4',
      name: '요가 플로우',
      instructor: '최강사',
      time: '월·수·금 07:30',
      capacity: 25,
      enrolled: 22,
      level: 'beginner',
    },
  ],
  memberships: [
    {
      id: '1',
      name: '월간 기본',
      price: 79000,
      duration: 1,
      classes: 12,
      features: ['무제한 시설 이용', '월 12회 클래스', '기본 운동 상담'],
    },
    {
      id: '2',
      name: '월간 프리미엄',
      price: 129000,
      duration: 1,
      classes: 999,
      features: ['무제한 시설 이용', '무제한 클래스', '1:1 트레이닝 월 2회', '영양 상담'],
      popular: true,
    },
    {
      id: '3',
      name: '3개월 플랜',
      price: 349000,
      duration: 3,
      classes: 999,
      features: ['무제한 시설 이용', '무제한 클래스', '1:1 트레이닝 월 4회', '영양 상담', '체성분 분석'],
    },
  ],
  schedule: {
    title: '운영시간',
    description: '저희는 다음과 같은 시간에 운영 중입니다',
    hours: [
      { day: '월~금', open: '06:00', close: '22:00' },
      { day: '토', open: '08:00', close: '20:00' },
      { day: '일', open: '09:00', close: '18:00' },
    ],
  },
  location: {
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    email: 'info@fitness.com',
  },
  footer: {
    companyName: '피트니스 스튜디오',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-1234-5678',
  },
  kakaoLink: 'https://pf.kakao.com/_xnxoxnxK',
  themeColor: '#EA580C',
};

export default function FitnessViewer({ data = {} }: { data?: FitnessData }) {
  const merged = { ...DEFAULT_FITNESS_DATA, ...data };
  const [selectedMembership, setSelectedMembership] = useState<string | null>(null);

  const levelBadge = (level: string) => {
    const styles = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-amber-100 text-amber-700',
      advanced: 'bg-red-100 text-red-700',
    };
    const labels = {
      beginner: '초급',
      intermediate: '중급',
      advanced: '고급',
    };
    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <section
        className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-20 text-center text-white"
        style={{ backgroundColor: merged.themeColor || '#EA580C' }}
      >
        {merged.hero?.backgroundImage && (
          <Image
            src={merged.hero.backgroundImage}
            alt="hero"
            fill
            className="absolute inset-0 object-cover opacity-30"
          />
        )}
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-black leading-tight md:text-6xl">{merged.hero?.title}</h1>
          <p className="mt-6 text-lg leading-relaxed opacity-90">{merged.hero?.subtitle}</p>
          <button className="mt-8 rounded-xl bg-white px-8 py-4 font-bold text-orange-600 transition hover:bg-gray-100">
            지금 시작하기
          </button>
        </div>
      </section>

      {/* About */}
      {merged.about && (
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-black text-slate-900">{merged.about.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">{merged.about.description}</p>
            {merged.about.image && (
              <div className="relative mt-12 h-96 w-full overflow-hidden rounded-2xl">
                <Image src={merged.about.image} alt="about" fill className="object-cover" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Classes */}
      {merged.classes && merged.classes.length > 0 && (
        <section className="bg-slate-50 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-4xl font-black text-slate-900">클래스</h2>
            <p className="mt-2 text-lg text-slate-600">다양한 프로그램 중 당신에게 맞는 클래스를 선택하세요</p>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {merged.classes.map((cls) => (
                <div key={cls.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{cls.name}</h3>
                      <p className="mt-1 text-sm text-slate-600">강사: {cls.instructor}</p>
                    </div>
                    {levelBadge(cls.level)}
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-slate-600">⏰ {cls.time}</p>
                    <p className="text-sm text-slate-600">
                      👥 {cls.enrolled}/{cls.capacity}명 (자리 {cls.capacity - cls.enrolled}개)
                    </p>
                  </div>

                  <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(cls.enrolled / cls.capacity) * 100}%`,
                        backgroundColor: merged.themeColor || '#EA580C',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Memberships */}
      {merged.memberships && merged.memberships.length > 0 && (
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-4xl font-black text-slate-900">이용권</h2>
            <p className="mt-2 text-lg text-slate-600">당신의 목표에 맞는 이용권을 선택하세요</p>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {merged.memberships.map((mem) => (
                <div
                  key={mem.id}
                  className={`relative rounded-2xl border-2 p-8 transition ${
                    mem.popular
                      ? 'border-orange-500 bg-gradient-to-b from-orange-50 to-white shadow-xl'
                      : 'border-slate-200 bg-white'
                  }`}
                  onClick={() => setSelectedMembership(mem.id)}
                >
                  {mem.popular && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-sm font-bold text-white"
                      style={{ backgroundColor: merged.themeColor || '#EA580C' }}
                    >
                      인기
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-slate-900">{mem.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-black text-slate-900">
                      ₩{mem.price.toLocaleString()}
                    </span>
                    <span className="ml-2 text-slate-600">/{mem.duration}개월</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {mem.features.map((feature, idx) => (
                      <p key={idx} className="flex items-start gap-3 text-slate-700">
                        <span
                          className="mt-1 inline-block h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: merged.themeColor || '#EA580C' }}
                        />
                        {feature}
                      </p>
                    ))}
                  </div>

                  <button
                    className={`mt-8 w-full rounded-xl py-3 font-bold transition ${
                      mem.popular
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'border-2 border-slate-300 text-slate-900 hover:border-slate-900'
                    }`}
                    style={
                      mem.popular ? { backgroundColor: merged.themeColor || '#EA580C' } : {}
                    }
                  >
                    선택하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Schedule */}
      {merged.schedule && (
        <section className="bg-slate-50 px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-black text-slate-900">{merged.schedule.title}</h2>
            <p className="mt-2 text-lg text-slate-600">{merged.schedule.description}</p>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {merged.schedule.hours.map((hour, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 text-center">
                  <p className="font-bold text-slate-900">{hour.day}</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {hour.open} ~ {hour.close}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      {merged.location && (
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-black text-slate-900">위치 & 연락처</h2>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-600">주소</p>
                <p className="mt-2 text-lg text-slate-900">{merged.location.address}</p>

                <p className="mt-6 text-sm font-bold uppercase tracking-widest text-slate-600">전화</p>
                <a href={`tel:${merged.location.phone}`} className="mt-2 text-lg text-orange-600 hover:underline">
                  {merged.location.phone}
                </a>

                <p className="mt-6 text-sm font-bold uppercase tracking-widest text-slate-600">이메일</p>
                <a href={`mailto:${merged.location.email}`} className="mt-2 text-lg text-orange-600 hover:underline">
                  {merged.location.email}
                </a>
              </div>

              {merged.location.mapUrl && (
                <div className="h-80 w-full overflow-hidden rounded-2xl border border-slate-200">
                  <iframe
                    src={merged.location.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="px-6 py-20 text-center text-white md:py-28"
        style={{ backgroundColor: merged.themeColor || '#EA580C' }}
      >
        <h2 className="text-4xl font-black">지금 시작하세요</h2>
        <p className="mt-4 text-lg opacity-90">당신의 건강한 삶을 위해 저희가 함께하겠습니다</p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button className="rounded-xl bg-white px-8 py-4 font-bold text-orange-600 transition hover:bg-gray-100">
            상담 신청
          </button>
          {merged.kakaoLink && (
            <a
              href={merged.kakaoLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border-2 border-white px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              카톡 상담
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-bold">{merged.footer?.companyName}</p>
              <p className="mt-2 text-sm text-slate-400">{merged.footer?.address}</p>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">연락처</p>
              <a href={`tel:${merged.footer?.phone}`} className="mt-2 text-sm hover:text-white">
                {merged.footer?.phone}
              </a>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">정보</p>
              <p className="mt-2 text-sm text-slate-400">© 2026 All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}