'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { B2BTemplateData } from '@/data/templates';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PublishedB2BPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<B2BTemplateData | null>(null);
  const [loading, setLoading] = useState(true);

  // 리드 폼 상태
  const [leadForm, setLeadForm] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    message: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchSite = async () => {
      const { data: site, error } = await supabase
        .from('sites')
        .select('content')
        .eq('id', id)
        .single();

      if (!error && site) {
        setData(site.content);
      }
      setLoading(false);
    };
    fetchSite();
  }, [id]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }
    setSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert([
        {
          site_id: id,
          name: `${leadForm.companyName} / ${leadForm.contactName}`,
          phone: leadForm.phone,
          memo: leadForm.message,
          status: '대기중',
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      alert('문의 접수 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-sans">
        페이지를 불러오는 중입니다...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-sans">
        존재하지 않거나 삭제된 페이지입니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* 1. 상단 GNB */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 px-6 md:px-12 py-4 flex justify-between items-center max-w-6xl mx-auto w-full">
        <span className="font-extrabold text-xl text-slate-900 tracking-tight">
          {data.company.name}
        </span>
        <a
          href="#contact"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
        >
          {data.hero.ctaText}
        </a>
      </header>

      {/* 2. 메인 히어로 */}
      <section className="py-24 px-6 text-center bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
            {data.hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight whitespace-pre-line">
            {data.hero.headline}
          </h1>
          <p className="mt-6 text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
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
        </div>
      </section>

      {/* 3. 핵심 수치 (Social Proof) */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {data.metrics?.map((metric, i) => (
            <div key={i} className="p-2">
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

      {/* 4. 서비스 소개 & 이미지 그리드 */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full flex-1">
        {data.features?.map((feature) => (
          <div key={feature.id} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{feature.title}</h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">{feature.description}</p>
            {feature.imageUrls?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {feature.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="서비스 상세 이미지"
                    className="w-full h-64 object-cover rounded-xl border border-slate-200"
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 5. 인바운드 문의 접수 폼 */}
        <div id="contact" className="mt-20 p-8 md:p-10 bg-slate-50 border border-slate-200 rounded-2xl">
          <h3 className="text-2xl font-bold text-slate-900 text-center">도입 및 제휴 문의</h3>
          <p className="text-sm text-slate-500 text-center mt-2">
            정보를 남겨주시면 영업일 기준 24시간 이내 연락드립니다.
          </p>

          {submitted ? (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 text-center rounded-xl">
              <p className="font-bold text-blue-900 text-base">문의가 정상 접수되었습니다.</p>
              <p className="text-xs text-blue-700 mt-1">담당자가 신속히 검토 후 기재해 주신 연락처로 안내해 드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="mt-8 space-y-4 max-w-xl mx-auto">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">회사명</label>
                <input
                  type="text"
                  required
                  placeholder="(주)회사명"
                  value={leadForm.companyName}
                  onChange={(e) => setLeadForm({ ...leadForm, companyName: e.target.value })}
                  className="w-full p-3 border rounded-lg text-sm bg-white outline-none focus:border-blue-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">담당자명 / 직함</label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동 팀장"
                    value={leadForm.contactName}
                    onChange={(e) => setLeadForm({ ...leadForm, contactName: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm bg-white outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">연락처</label>
                  <input
                    type="tel"
                    required
                    placeholder="010-1234-5678"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full p-3 border rounded-lg text-sm bg-white outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">문의 내용</label>
                <textarea
                  rows={4}
                  required
                  placeholder="도입 규모, 요구사항, 일정 등을 자유롭게 적어주세요."
                  value={leadForm.message}
                  onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                  className="w-full p-3 border rounded-lg text-sm bg-white outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="privacy" className="text-xs text-slate-500 cursor-pointer">
                  [필수] 상담 문의 처리를 위한 개인정보(이름, 연락처) 수집 및 이용에 동의합니다.
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-sm transition disabled:opacity-50"
              >
                {submitting ? '접수 중...' : '상담 신청하기'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 6. 푸터 */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-xs leading-relaxed border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
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
  );
}