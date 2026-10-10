'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

// 한글 슬러그와 실제 Supabase sites 테이블의 UUID 매핑
// TODO: 각 항목의 따옴표 안에 실제 사이트 UUID를 입력하세요.
const SLUG_TO_ID_MAP: Record<string, string> = {
  기업형: '기업형',
  법률: '법률형',
  피트니스: '피트니스형',
};

export default function PreviewPage() {
  const params = useParams();
  const rawSiteId = params?.siteId;

  const [siteData, setSiteData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!rawSiteId) return;

    // URL 디코딩 처리 (한글 인코딩 대응)
    const decodedSlug = decodeURIComponent(String(rawSiteId));
    // 매핑 테이블에 존재하면 해당 UUID를 사용하고, 없으면 전달받은 파라미터를 그대로 사용
    const targetSiteId = SLUG_TO_ID_MAP[decodedSlug] || decodedSlug;

    async function fetchSiteData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/builder-data?siteId=${encodeURIComponent(targetSiteId)}`);
        const result = await res.json();
        if (result.data) {
          setSiteData(result.data);
        } else {
          setSiteData(null);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setSiteData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSiteData();
  }, [rawSiteId]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-sans text-gray-500">
        사이트를 불러오는 중...
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center font-sans text-gray-500 gap-2">
        <p className="text-lg font-semibold text-gray-800">사이트를 찾을 수 없습니다.</p>
        <p className="text-sm">매핑된 ID 또는 사이트 데이터가 올바른지 확인해 주세요.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter text-blue-600">
            {siteData.name}
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600 transition">서비스 소개</a>
            <a href="#" className="hover:text-blue-600 transition">포트폴리오</a>
            <a href="#" className="hover:text-blue-600 transition">이용 요금</a>
            <a href="#" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              문의하기
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8 whitespace-pre-line">
            {siteData.data?.mainTitle || `당신의 비즈니스를 위한\n최고의 선택, ${siteData.name}`}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {siteData.data?.subTitle || '복잡한 과정 없이 단 몇 분 만에 전문가 수준의 홈페이지를 구축하고 운영하세요.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
              지금 시작하기
            </button>
            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
              서비스 더 알아보기
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">왜 {siteData.name} 인가요?</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6">
                  {i}
                </div>
                <h3 className="text-xl font-bold mb-3">핵심 가치 {i}</h3>
                <p className="text-gray-600 leading-relaxed">
                  사용자의 편의성을 최우선으로 생각하는 맞춤형 솔루션을 제공하여 비즈니스 성장을 돕습니다.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 text-center text-gray-500 text-sm">
        © 2026 {siteData.name}. All rights reserved.
      </footer>
    </div>
  );
}