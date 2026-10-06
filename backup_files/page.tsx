'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { defaultB2BTemplate, B2BTemplateData } from '@/data/templates';
import LivePreview from '@/components/builder/LivePreview';
import EditorSidebar from '@/components/builder/EditorSidebar';

export default function BuilderPage() {
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplate);
  const [zoom, setZoom] = useState<number>(100);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // [발행하기] 클릭 시 로컬 저장 후 새 탭으로 오픈
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('thsoft_published_site', JSON.stringify(data));
      }

      const newWindow = window.open('/preview', '_blank');
      if (!newWindow) {
        alert('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해 주세요.');
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
      {/* 상단 통합 헤더 바 */}
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

      {/* 중앙 작업 공간: 좌측(전체 편집 사이드바) + 우측(캔버스) */}
      <div className="flex-1 flex overflow-hidden">
        {/* 기존 세부 편집 사이드바 컴포넌트 복구 */}
        <EditorSidebar data={data} setData={setData} onPublish={handlePublish} />

        {/* 우측 실시간 프리뷰 캔버스 */}
        <div className="flex-1 flex overflow-hidden">
          <LivePreview data={data} zoom={zoom} setZoom={setZoom} />
        </div>
      </div>
    </div>
  );
}