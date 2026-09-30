'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { B2BTemplateData, defaultB2BTemplate } from '@/data/templates';
import PaymentModal from '@/components/PaymentModal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EditorPage() {
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplate);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // 1. 텍스트 수정 핸들러
  const handleHeroChange = (field: keyof typeof data.hero, value: string) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const handleFooterChange = (field: keyof typeof data.footer, value: string) => {
    setData((prev) => ({ ...prev, footer: { ...prev.footer, [field]: value } }));
  };

  // 2. 사진 업로드 핸들러 (최대 5장 지원 유지)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, featureId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentFeature = data.features.find((f) => f.id === featureId);
    if ((currentFeature?.imageUrls.length || 0) + files.length > 5) {
      alert('이미지는 섹션당 최대 5장까지 업로드할 수 있습니다.');
      return;
    }

    setIsUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (!error && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('images')
          .getPublicUrl(uploadData.path);
        newUrls.push(publicUrlData.publicUrl);
      }
    }

    setData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === featureId ? { ...f, imageUrls: [...f.imageUrls, ...newUrls] } : f
      ),
    }));
    setIsUploading(false);
  };

  // 3. 사이트 발행 (Supabase sites 테이블 저장)
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const { data: site, error } = await supabase
        .from('sites')
        .insert([
          {
            title: data.company.name,
            content: data,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      const url = `${window.location.origin}/p/${site.id}`;
      setPublishedUrl(url);
    } catch (err: any) {
      alert('발행 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* 좌측: 에디터 패널 */}
      <div className="w-1/3 min-w-[360px] bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-10">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white">
          <h1 className="font-bold text-lg">B2B 웹 빌더 에디터</h1>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
          >
            {isSaving ? '발행 중...' : '사이트 무료 발행'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 발행 완료 링크 배너 */}
          {publishedUrl && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-xs font-bold text-blue-800 uppercase">발행 완료 URL</p>
              <input
                type="text"
                readOnly
                value={publishedUrl}
                className="w-full mt-2 p-2 text-xs bg-white border rounded font-mono select-all"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(publishedUrl)}
                  className="flex-1 bg-blue-600 text-white text-xs py-2 rounded font-medium hover:bg-blue-700"
                >
                  링크 복사
                </button>
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="bg-emerald-600 text-white text-xs px-3 py-2 rounded font-medium hover:bg-emerald-700"
                >
                  워터마크 제거
                </button>
              </div>
            </div>
          )}

          {/* 기업 기본 정보 */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800">1. 기업 정보 & 메인 문구</h2>
            <div>
              <label className="text-xs text-slate-500">회사명</label>
              <input
                type="text"
                value={data.company.name}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    company: { ...prev.company, name: e.target.value },
                  }))
                }
                className="w-full p-2 border rounded-lg text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">메인 헤드라인</label>
              <textarea
                rows={2}
                value={data.hero.headline}
                onChange={(e) => handleHeroChange('headline', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">서브 설명문구</label>
              <textarea
                rows={3}
                value={data.hero.subheadline}
                onChange={(e) => handleHeroChange('subheadline', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm mt-1"
              />
            </div>
          </div>

          {/* 솔루션/서비스 섹션 (사진 업로드) */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-sm font-bold text-slate-800">2. 서비스 소개 및 이미지</h2>
            {data.features.map((feature) => (
              <div key={feature.id} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      features: prev.features.map((f) =>
                        f.id === feature.id ? { ...f, title: e.target.value } : f
                      ),
                    }))
                  }
                  className="w-full p-2 border rounded text-sm bg-white"
                  placeholder="섹션 제목"
                />
                <textarea
                  value={feature.description}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      features: prev.features.map((f) =>
                        f.id === feature.id ? { ...f, description: e.target.value } : f
                      ),
                    }))
                  }
                  rows={2}
                  className="w-full p-2 border rounded text-sm bg-white"
                  placeholder="섹션 상세 설명"
                />
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    소개 사진 첨부 ({feature.imageUrls.length}/5)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, feature.id)}
                    disabled={isUploading || feature.imageUrls.length >= 5}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-slate-200 file:text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 푸터 정보 */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-sm font-bold text-slate-800">3. 하단 법인 정보 (푸터)</h2>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="대표자명"
                value={data.footer.ownerName}
                onChange={(e) => handleFooterChange('ownerName', e.target.value)}
                className="p-2 border rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="사업자등록번호"
                value={data.footer.businessNumber}
                onChange={(e) => handleFooterChange('businessNumber', e.target.value)}
                className="p-2 border rounded-lg text-xs"
              />
            </div>
            <input
              type="text"
              placeholder="사업장 소재지 주소"
              value={data.footer.address}
              onChange={(e) => handleFooterChange('address', e.target.value)}
              className="w-full p-2 border rounded-lg text-xs"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="대표 이메일"
                value={data.footer.contactEmail}
                onChange={(e) => handleFooterChange('contactEmail', e.target.value)}
                className="p-2 border rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="대표 번호"
                value={data.footer.contactPhone}
                onChange={(e) => handleFooterChange('contactPhone', e.target.value)}
                className="p-2 border rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 우측: 기업 사이트 실시간 캔버스 (프리뷰) */}
      <div className="flex-1 h-full overflow-y-auto bg-slate-200 p-8 flex justify-center">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col min-h-full">
          {/* GNB */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b px-8 py-4 flex justify-between items-center">
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              {data.company.name}
            </span>
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              {data.hero.ctaText}
            </a>
          </header>

          {/* 히어로 섹션 */}
          <section className="py-24 px-8 text-center bg-slate-50 border-b">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
              {data.hero.badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight whitespace-pre-line">
              {data.hero.headline}
            </h1>
            <p className="mt-6 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {data.hero.subheadline}
            </p>
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition"
              >
                {data.hero.ctaText}
              </a>
            </div>
          </section>

          {/* 핵심 지표 (Metrics) */}
          <section className="py-12 bg-white border-b">
            <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
              {data.metrics.map((metric, i) => (
                <div key={i} className="p-4">
                  <div className="text-3xl md:text-4xl font-extrabold text-blue-600">
                    {metric.value}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-slate-500 mt-1">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 솔루션 섹션 & 업로드 이미지 그리드 */}
          <section className="py-16 px-8 max-w-3xl mx-auto w-full flex-1">
            {data.features.map((feature) => (
              <div key={feature.id} className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900">{feature.title}</h2>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">{feature.description}</p>
                {feature.imageUrls.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {feature.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt="솔루션 프리뷰"
                        className="w-full h-56 object-cover rounded-xl border border-slate-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* 인바운드 문의 폼 (Lead Form) */}
            <div id="contact" className="mt-16 p-8 bg-slate-50 border border-slate-200 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 text-center">도입 및 제휴 문의</h3>
              <p className="text-xs text-slate-500 text-center mt-1">
                담당자 정보를 남겨주시면 영업일 기준 24시간 이내 연락드립니다.
              </p>
              <div className="mt-6 space-y-3">
                <input
                  type="text"
                  placeholder="기업명"
                  className="w-full p-3 border rounded-lg text-sm bg-white"
                />
                <input
                  type="text"
                  placeholder="담당자명 / 직함"
                  className="w-full p-3 border rounded-lg text-sm bg-white"
                />
                <input
                  type="tel"
                  placeholder="연락처 (예: 010-1234-5678)"
                  className="w-full p-3 border rounded-lg text-sm bg-white"
                />
                <textarea
                  rows={3}
                  placeholder="문의 내용이나 요청 사항을 기재해 주세요"
                  className="w-full p-3 border rounded-lg text-sm bg-white"
                />
                <button
                  type="button"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-sm transition"
                >
                  문의 제출하기
                </button>
              </div>
            </div>
          </section>

          {/* 푸터 */}
          <footer className="bg-slate-900 text-slate-400 py-10 px-8 text-xs leading-relaxed border-t border-slate-800">
            <div className="max-w-3xl mx-auto">
              <p className="font-bold text-slate-200 text-sm mb-2">{data.footer.companyName}</p>
              <p>대표자: {data.footer.ownerName} | 사업자등록번호: {data.footer.businessNumber}</p>
              <p>주소: {data.footer.address}</p>
              <p>문의: {data.footer.contactEmail} | 전화: {data.footer.contactPhone}</p>
              <p className="mt-4 text-slate-500">
                © {data.footer.companyName}. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>

      {/* 포트원 결제 모달 유지 */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={() => {
          setIsPaymentOpen(false);
          alert('결제가 완료되었습니다. 워터마크가 제거됩니다.');
        }}
      />
    </div>
  );
}