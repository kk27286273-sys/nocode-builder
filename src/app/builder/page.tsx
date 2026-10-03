'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';
import LivePreview from '@/components/builder/LivePreview';

export default function BuilderPage() {
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplate);
  const [zoom, setZoom] = useState<number>(100);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // [발행하기] 클릭 시 실제 판매 데모 창(새 탭)을 즉시 띄움
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('thsoft_published_site', JSON.stringify(data));
      }

      const newWindow = window.open('/preview', '_blank');
      if (!newWindow) {
        alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('발행 처리 중 오류가 발생했습니다.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
      {/* 상단 통합 내비게이션 바 */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>TH소프트</span>
            <span className="text-xs font-medium text-slate-400">| 웹 빌더 에디터</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/preview"
            target="_blank"
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
          >
            새 탭에서 미리보기
          </Link>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {isPublishing ? '발행 처리 중...' : '웹사이트 발행하기'}
          </button>
        </div>
      </header>

      {/* 중앙 작업 공간: 좌측(설정 사이드바) + 우측(캔버스) */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 편집 사이드바 */}
        <aside className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto shrink-0 hidden lg:block">
          <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            기본 정보 실시간 편집
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">업체명 (상호)</label>
              <input
                type="text"
                value={data.company.name}
                onChange={(e) => setData({ ...data, company: { ...data.company, name: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">메인 헤드카피 (히어로 타이틀)</label>
              <textarea
                rows={2}
                value={data.hero.title}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">대표 전화번호</label>
              <input
                type="text"
                value={data.supportPhone}
                onChange={(e) => setData({ ...data, supportPhone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">브랜드 테마 색상</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.themeColor || '#0284C7'}
                  onChange={(e) => setData({ ...data, themeColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                />
                <span className="text-slate-600 font-mono">{data.themeColor || '#0284C7'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handlePublish}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition active:scale-95 cursor-pointer text-xs"
              >
                현재 내용으로 즉시 발행 및 새 창 보기
              </button>
            </div>
          </div>
        </aside>

        {/* 우측 실시간 프리뷰 캔버스 */}
        <div className="flex-1 flex overflow-hidden">
          <LivePreview data={data} zoom={zoom} setZoom={setZoom} />
        </div>
      </div>
    </div>
  );
}