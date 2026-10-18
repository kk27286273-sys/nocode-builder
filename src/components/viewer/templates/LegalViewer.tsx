// src/components/viewer/templates/LegalViewer.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { V2Page } from '@/types/builder-v2';

interface Props {
  page?: V2Page;
  data?: any;
  editable?: boolean;
}

export default function LegalViewer({ page, data, editable = false }: Props) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    content: '',
  });

  // 섹션별 요소 추출
  const heroSection = page?.sections?.find((s) => s.id === 'hero');
  const casesSection = page?.sections?.find((s) => s.id === 'cases');
  const servicesSection = page?.sections?.find((s) => s.id === 'services');
  const contactSection = page?.sections?.find((s) => s.id === 'contact');
  const footerSection = page?.sections?.find((s) => s.id === 'footer');

  // 히어로 요소
  const heroBadge = heroSection?.elements?.find((e) => e.id === 'hero-badge');
  const heroTitle = heroSection?.elements?.find((e) => e.id === 'hero-title');
  const heroSubtitle = heroSection?.elements?.find((e) => e.id === 'hero-subtitle');
  const heroButton = heroSection?.elements?.find((e) => e.id === 'hero-button');

  // 성공 사례 요소들 (type: 'image')
  const caseItems = casesSection?.elements?.filter((e) => e.type === 'image') || [];

  // 서비스 요소들
  const serviceItems = servicesSection?.elements || [];

  // 푸터 요소들
  const footerCompany = footerSection?.elements?.find((e) => e.id === 'footer-company');
  const footerTagline = footerSection?.elements?.find((e) => e.id === 'footer-tagline');
  const footerLinks = footerSection?.elements?.filter((e) => e.id?.startsWith('footer-link-')) || [];

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('상담 신청:', formData);
    alert('상담 신청이 접수되었습니다. 곧 연락드리겠습니다.');
    setFormData({ name: '', phone: '', content: '' });
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white">
      {/* ===== HERO ===== */}
      <section className="border-b border-slate-800 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
              {heroBadge?.content || 'LAW & TAX'}
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              {heroTitle?.content || '신뢰할 수 있는 법률 파트너'}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              {heroSubtitle?.content || '의뢰인의 권리를 지키는 전문적인 법률 서비스'}
            </p>
            <button className="mt-8 rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition hover:bg-blue-700">
              {heroButton?.content || '상담 신청하기 →'}
            </button>
          </div>
        </div>
      </section>

      {/* ===== 성공 사례 갤러리 ===== */}
      <section className="border-b border-slate-800 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">최근 성공 사례</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {caseItems.length > 0 ? (
              caseItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ borderColor: '#2563eb', boxShadow: '0 0 20px rgba(37, 99, 235, 0.2)' }}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className="group cursor-pointer rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 transition"
                >
                  {/* 이미지 (선택사항) */}
                  {item.content && (
                    <div className="relative h-40 w-full overflow-hidden rounded-lg mb-4">
                      <motion.img
                        src={item.content}
                        alt={item.metadata?.title || '사례'}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      {/* 호버 오버레이 */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                      >
                        <p className="text-center text-white font-semibold">상세 보기</p>
                      </motion.div>
                    </div>
                  )}

                  {/* 정보 */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        {item.metadata?.category || '법무'}
                      </p>
                      <h3 className="mt-2 text-lg font-bold">
                        {item.metadata?.title || item.content}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.metadata?.year || '2024'}
                    </p>
                  </div>
                  <p className="mt-4 rounded-lg bg-blue-600/10 px-3 py-2 text-sm font-semibold text-blue-300">
                    ✓ {item.metadata?.result || '성공'}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                성공 사례가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== 서비스 ===== */}
      <section className="border-b border-slate-800 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold">전문성으로 신뢰를 쌓습니다</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {serviceItems.length > 0 ? (
              serviceItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -4 }}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.content}
                      alt={item.metadata?.title || '서비스'}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <div className="text-4xl">
                      {item.metadata?.icon || '⚖️'}
                    </div>
                  )}
                  <h3 className="mt-4 font-bold">
                    {item.metadata?.title || item.content}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {item.metadata?.description}
                  </p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                서비스 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== 상담 폼 ===== */}
      <section className="border-b border-slate-800 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold">비밀 보장 1:1 상담</h2>
          <p className="mt-4 text-slate-400">
            변호사 비밀유지 특권으로 완벽하게 보호됩니다.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold">이름</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">연락처</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">상담 내용</label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-blue-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-bold transition hover:bg-blue-700"
            >
              상담 신청하기
            </button>
          </form>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-6 py-12">
        <div className="mx-auto max-w-6xl border-t border-slate-800 pt-8">
          <p className="font-bold">
            {footerCompany?.content || 'Law & Tax'}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {footerTagline?.content || '신뢰를 기반으로 한 법률·세무·노무 자문'}
          </p>
          <div className="mt-6 flex gap-6 text-sm text-slate-400">
            {footerLinks.length > 0 ? (
              footerLinks.map((link) => (
                <a key={link.id} href="#" className="hover:text-white">
                  {link.content}
                </a>
              ))
            ) : (
              <>
                <a href="#" className="hover:text-white">이용약관</a>
                <a href="#" className="hover:text-white">개인정보 처리방침</a>
                <a href="#" className="hover:text-white">카톡 실시간 상담</a>
              </>
            )}
          </div>
          <p className="mt-8 text-xs text-slate-600">
            © 2026 {footerCompany?.content || 'Law & Tax'}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ===== 사례 상세 모달 ===== */}
      {selectedCaseIdx !== null && caseItems[selectedCaseIdx] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedCaseIdx(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="max-w-md rounded-xl bg-slate-900 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCaseIdx(null)}
              className="float-right text-2xl text-slate-400 hover:text-white"
            >
              ×
            </button>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {caseItems[selectedCaseIdx].metadata?.category || '법무'}
            </p>
            <h3 className="mt-3 text-2xl font-bold">
              {caseItems[selectedCaseIdx].metadata?.title}
            </h3>
            <p className="mt-4 rounded-lg bg-blue-600/10 px-3 py-2 text-sm font-semibold text-blue-300">
              ✓ {caseItems[selectedCaseIdx].metadata?.result}
            </p>
            <p className="mt-4 text-slate-400">
              {caseItems[selectedCaseIdx].metadata?.description}
            </p>
            <p className="mt-6 text-xs text-slate-500">
              {caseItems[selectedCaseIdx].metadata?.year}
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}