'use client';

import { useState } from 'react';
import LegalModal from '@/components/builder/LegalModal';

export default function GlobalFooter() {
  const [legalType, setLegalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <>
      <LegalModal
        isOpen={!!legalType}
        type={legalType}
        onClose={() => setLegalType(null)}
      />

      <footer className="bg-slate-50 border-t border-slate-200 py-6 px-4 text-center text-[11px] text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div>© 2026 TH SOFT. All rights reserved.</div>

            <div className="mt-2">
              THsoft가 운영하는 사업자용 웹사이트 제작·관리 서비스 NEXIA
            </div>
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
    </>
  );
}