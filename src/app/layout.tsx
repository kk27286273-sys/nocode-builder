'use client';

import React, { useState } from 'react';
import './globals.css';
import KakaoChatButton from '@/components/KakaoChatButton';
import LegalModal from '@/components/builder/LegalModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        
        {/* 🛡️ 법적 문서 모달 - 전역 배치 */}
        <LegalModal 
          isOpen={!!legalType} 
          type={legalType} 
          onClose={() => setLegalType(null)} 
        />

        {/* 🛡️ 전역 표준 푸터 - 'hidden' 제거하여 모든 페이지에서 노출 */}
        <footer className="bg-slate-50 border-t border-slate-200 py-6 px-4 text-center text-[11px] text-slate-400">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              © 2026 TH SOFT. All rights reserved.
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setLegalType('terms')} 
                className="hover:text-slate-600 transition underline cursor-pointer"
              >
                이용약관
              </button>
              <button 
                onClick={() => setLegalType('privacy')} 
                className="hover:text-slate-600 transition underline cursor-pointer"
              >
                개인정보 처리방침
              </button>
            </div>
          </div>
        </footer>

        <KakaoChatButton />
      </body>
    </html>
  );
}