// src/components/viewer/templates/InteriorViewer.tsx

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { V2Page } from '@/types/builder-v2';

interface Props {
  page?: V2Page;
  data?: any;
  editable?: boolean;
}

export default function InteriorViewer({ page, data, editable = false }: Props) {
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    spaceType: '',
    area: '',
    timeline: '',
    content: '',
    privacy: false,
  });

  // 섹션별 요소 추출
const heroSection = page?.sections?.find((s) => s.type === 'hero');
const gallerySection = page?.sections?.find((s) => s.type === 'gallery');
const servicesSection = page?.sections?.find((s) => s.type === 'services');
const processSection = page?.sections?.find((s) => s.type === 'process');
const contactSection = page?.sections?.find((s) => s.type === 'contact');
const footerSection = page?.sections?.find((s) => s.type === 'footer');

  // 히어로 요소
  const heroBg = heroSection?.elements?.find((e) => e.id === 'hero-bg');
  const heroTitle = heroSection?.elements?.find((e) => e.id === 'hero-title');
  const heroSubtitle = heroSection?.elements?.find((e) => e.id === 'hero-subtitle');

  // 갤러리 요소들 (type: 'image')
  const galleryItems = gallerySection?.elements?.filter((e) => e.type === 'image') || [];

  // 서비스 요소들
  const serviceItems = servicesSection?.elements || [];

  // 시공 절차 요소들
  const processItems = processSection?.elements || [];

  // 푸터 요소들
  const footerCompany = footerSection?.elements?.find((e) => e.id === 'footer-company');
  const footerAddress = footerSection?.elements?.find((e) => e.id === 'footer-address');
  const footerBusiness = footerSection?.elements?.find((e) => e.id === 'footer-business');
  const footerPhone = footerSection?.elements?.find((e) => e.id === 'footer-phone');
  const footerEmail = footerSection?.elements?.find((e) => e.id === 'footer-email');

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) {
      alert('개인정보 수집 동의를 확인해주세요.');
      return;
    }
    console.log('견적 문의:', formData);
    alert('문의가 접수되었습니다. 곧 연락드리겠습니다.');
    setFormData({
      name: '',
      phone: '',
      spaceType: '',
      area: '',
      timeline: '',
      content: '',
      privacy: false,
    });
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* ===== HERO ===== */}
      <section
        className="relative flex h-screen w-full items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${heroBg?.content || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop'}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold md:text-6xl">
            {heroTitle?.content || '당신의 꿈의 공간을 만듭니다'}
          </h1>
          <p className="mt-6 text-lg md:text-xl">
            {heroSubtitle?.content || '전문적인 시공으로 가치 있는 인테리어'}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#gallery"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              시공 사례 보기
            </a>
            <a
              href="#contact"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              무료 견적 문의
            </a>
          </div>
        </div>
      </section>

      {/* ===== 갤러리 ===== */}
      <section id="gallery" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">시공 사례</h2>
          <p className="mt-4 text-center text-slate-600">
            저희의 시공 실력을 직접 확인해보세요
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.length > 0 ? (
              galleryItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedGalleryIdx(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  {/* 이미지 */}
                  <div className="relative h-64 w-full overflow-hidden bg-slate-200">
                    <motion.img
                      src={item.content}
                      alt={item.metadata?.title || '갤러리 이미지'}
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

                  {/* 정보 */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{item.metadata?.title || '프로젝트'}</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.metadata?.area} · {item.metadata?.duration}
                    </p>
                    {item.metadata?.tags && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.metadata.tags.map((tag: string, ti: number) => (
                          <span
                            key={ti}
                            className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                갤러리 이미지가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== 서비스 ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">서비스</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {serviceItems.length > 0 ? (
              serviceItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8 }}
                  className="text-center"
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.content}
                      alt={item.metadata?.title || '서비스'}
                      className="mx-auto h-20 w-20 object-contain"
                    />
                  ) : (
                    <div className="text-5xl">{item.metadata?.icon || '🏠'}</div>
                  )}
                  <h3 className="mt-4 text-xl font-bold">
                    {item.metadata?.title || item.content}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
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

      {/* ===== 시공 절차 ===== */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">시공 절차</h2>
          <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {processItems.length > 0 ? (
              processItems.map((item, idx) => (
                <div key={item.id} className="flex flex-1 flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white"
                  >
                    {item.metadata?.step || idx + 1}
                  </motion.div>
                  <h3 className="mt-4 font-bold">{item.metadata?.title || item.content}</h3>
                  <p className="mt-2 text-center text-sm text-slate-600">
                    {item.metadata?.description}
                  </p>
                  {idx < processItems.length - 1 && (
                    <div className="mt-4 hidden h-12 w-1 bg-blue-300 md:block" />
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500">
                시공 절차 정보가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== 견적 문의 ===== */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center text-4xl font-bold">무료 견적 문의</h2>
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-4 rounded-xl border border-slate-200 bg-white p-8"
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                이름 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                연락처 *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="010-0000-0000"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  공간 유형 *
                </label>
                <select
                  required
                  value={formData.spaceType}
                  onChange={(e) => handleFormChange('spaceType', e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">선택</option>
                  <option value="apartment">아파트</option>
                  <option value="store">상가</option>
                  <option value="office">사무실</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  평수 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => handleFormChange('area', e.target.value)}
                  placeholder="예: 84㎡"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                희망 시공 시기 *
              </label>
              <input
                type="text"
                required
                value={formData.timeline}
                onChange={(e) => handleFormChange('timeline', e.target.value)}
                placeholder="예: 3개월 이내"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                추가 요청사항
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleFormChange('content', e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                checked={formData.privacy}
                onChange={(e) => handleFormChange('privacy', e.target.checked)}
                className="mt-1"
              />
              <label className="text-xs text-slate-600">
                개인정보 수집 및 이용에 동의합니다. (필수) *
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              무료 견적 문의하기
            </button>
          </form>
        </div>
      </section>

      {/* ===== 푸터 ===== */}
      <footer className="border-t border-slate-200 bg-slate-900 py-12 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-bold">
            {footerCompany?.content || '인테리어 회사'}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {footerAddress?.content}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            사업자등록번호: {footerBusiness?.content}
          </p>
          <div className="mt-6 flex gap-4">
            {footerPhone?.content && (
              <a
                href={`tel:${footerPhone.content}`}
                className="text-sm hover:text-blue-400"
              >
                전화: {footerPhone.content}
              </a>
            )}
            {footerEmail?.content && (
              <a
                href={`mailto:${footerEmail.content}`}
                className="text-sm hover:text-blue-400"
              >
                이메일: {footerEmail.content}
              </a>
            )}
          </div>
          <p className="mt-6 text-xs text-slate-600">
            © {new Date().getFullYear()} {footerCompany?.content}. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* ===== 갤러리 상세 모달 ===== */}
      {selectedGalleryIdx !== null && galleryItems[selectedGalleryIdx] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedGalleryIdx(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGalleryIdx(null)}
              className="float-right text-2xl font-bold text-slate-400 hover:text-slate-900"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold">
              {galleryItems[selectedGalleryIdx].metadata?.title || '프로젝트'}
            </h3>
            <p className="mt-2 text-slate-600">
              {galleryItems[selectedGalleryIdx].metadata?.area} ·{' '}
              {galleryItems[selectedGalleryIdx].metadata?.duration}
            </p>
            <img
              src={galleryItems[selectedGalleryIdx].content}
              alt={galleryItems[selectedGalleryIdx].metadata?.title || '갤러리'}
              className="mt-4 rounded-lg w-full"
            />
            {galleryItems[selectedGalleryIdx].metadata?.description && (
              <p className="mt-4 text-slate-700">
                {galleryItems[selectedGalleryIdx].metadata.description}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}