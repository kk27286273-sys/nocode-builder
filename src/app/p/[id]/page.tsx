'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function PublicPage() {
  const params = useParams();
  const id = params?.id as string;

  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [agree, setAgree] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    const firstInput = formRef.current?.querySelector('input');
    firstInput?.focus();
  };

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id.toLowerCase())
        .single();

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSite(data);
      }
      setLoading(false);
    }

    fetchData();
  }, [id]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('이름과 연락처를 모두 입력해 주세요.');
      return;
    }

    if (!agree) {
      alert('개인정보 수집 및 이용에 동의하셔야 신청이 가능합니다.');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('leads').insert({
      site_id: id.toLowerCase(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
    });
    setSubmitting(false);

    if (error) {
      alert('접수 중 오류가 발생했습니다: ' + error.message);
    } else {
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-slate-500">
        페이지를 불러오는 중입니다...
      </div>
    );
  }

  if (errorMsg || !site) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">데이터를 찾을 수 없습니다</h2>
        <p className="text-sm text-slate-500 mb-4">찾으려는 ID: <b>{id}</b></p>
        <div className="bg-slate-100 p-4 rounded text-xs text-slate-700 max-w-md text-left overflow-auto">
          {errorMsg || 'DB에 일치하는 데이터가 없습니다.'}
        </div>
      </div>
    );
  }

  const getFontFamilyClass = (font: string) => {
    if (font === 'serif') return 'font-serif';
    if (font === 'mono') return 'font-mono';
    return 'font-sans';
  };

  const alignClass = 
    site.feature_align === 'center' ? 'text-center' : 
    site.feature_align === 'right' ? 'text-right' : 'text-left';

  const stories: Array<{ id: string; title: string; content: string; images?: string[] }> = 
    Array.isArray(site.stories) ? site.stories : [];

  return (
    <main
      className="min-h-screen flex items-center justify-center p-3 sm:p-6 md:p-8 relative"
      style={{ backgroundColor: site.background_color }}
    >
      <div className="w-full max-w-md bg-white/40 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-white/50 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* 대표 이미지 */}
        {site.image_url && (
          <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
            <img
              src={site.image_url}
              alt={site.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          </div>
        )}

        {/* 메인 텍스트 */}
        <div className="space-y-2 text-center">
          <h1 
            className={`font-extrabold leading-tight break-keep ${getFontFamilyClass(site.title_font || 'sans')}`}
            style={{ 
              color: site.title_color || '#0f172a',
              fontSize: `${site.title_size_px || 24}px`
            }}
          >
            {site.title}
          </h1>
          {site.subtitle && (
            <p 
              className={`leading-relaxed break-keep ${getFontFamilyClass(site.subtitle_font || 'sans')}`}
              style={{ 
                color: site.subtitle_color || '#475569',
                fontSize: `${site.subtitle_size_px || 14}px`
              }}
            >
              {site.subtitle}
            </p>
          )}
        </div>

        {/* 특징 카드 3종 */}
        <div className="space-y-2.5">
          {[
            { title: site.feature1_title, desc: site.feature1_desc },
            { title: site.feature2_title, desc: site.feature2_desc },
            { title: site.feature3_title, desc: site.feature3_desc },
          ].map((f, i) => f.title && (
            <div 
              key={i} 
              className={`p-3.5 bg-white rounded-xl shadow-xs border border-slate-100 ${alignClass} ${getFontFamilyClass(site.feature_font || 'sans')}`}
            >
              <div 
                className="font-bold text-slate-800"
                style={{ fontSize: `${site.feature_title_size_px || 14}px` }}
              >
                {f.title}
              </div>
              {f.desc && (
                <div 
                  className="text-slate-500 mt-1"
                  style={{ fontSize: `${site.feature_desc_size_px || 12}px` }}
                >
                  {f.desc}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 다중 스토리 블록 (수직 세로 사진 리스트) */}
        {stories.length > 0 && (
          <div className="space-y-3">
            {stories.map((story) => (
              <div key={story.id} className="p-4 bg-white/70 backdrop-blur rounded-2xl border border-slate-100 text-left space-y-2.5 shadow-xs">
                {story.title && (
                  <h3 className="text-sm font-bold text-slate-900">{story.title}</h3>
                )}

                {/* 첨부된 사진 수직 한 줄 나열 */}
                {story.images && story.images.length > 0 && (
                  <div className="flex flex-col space-y-2 pt-1">
                    {story.images.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs">
                        <img
                          src={imgUrl}
                          alt={`${story.title} image ${imgIdx + 1}`}
                          className="w-full h-auto object-cover max-h-64"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {story.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* FAQ 아코디언 블록 */}
        {(site.faq1_q || site.faq2_q || site.faq3_q) && (
          <div className="space-y-2 text-left">
            <h3 className="text-xs font-bold text-slate-700 px-1">자주 묻는 질문</h3>
            {[
              { q: site.faq1_q, a: site.faq1_a },
              { q: site.faq2_q, a: site.faq2_a },
              { q: site.faq3_q, a: site.faq3_a },
            ].map((faq, idx) => faq.q && (
              <div key={idx} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-3.5 text-left flex justify-between items-center text-xs font-semibold text-slate-800"
                >
                  <span>{faq.q}</span>
                  <span className="text-[10px] text-slate-400">{openFaqIndex === idx ? '▲' : '▼'}</span>
                </button>
                {openFaqIndex === idx && faq.a && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-500 border-t border-slate-50 pt-2 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 고객 연락처 수집 폼 */}
        <div ref={formRef} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-left space-y-3 scroll-mt-6">
          <div className="text-center">
            <h3 className="text-sm font-bold text-slate-900">상담 및 사전예약 신청</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">정보를 남겨주시면 빠르게 연락드리겠습니다.</p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
              <span className="text-base">🎉</span>
              <p className="text-xs font-bold text-emerald-800">신청이 정상 접수되었습니다!</p>
              <p className="text-[10px] text-emerald-600">확인 후 빠르게 연락드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-2.5">
              <input
                type="text"
                placeholder="성함"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="연락처 (010-0000-0000)"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />
              <textarea
                rows={2}
                placeholder="문의 사항 (선택)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-lg outline-none bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500"
              />

              {/* 개인정보 수집 동의 체크박스 */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 px-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded cursor-pointer"
                  />
                  <span>[필수] 개인정보 수집 및 이용 동의</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-slate-400 hover:text-slate-600 underline"
                >
                  약관보기
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: site.primary_color }}
                className="w-full py-3 text-white font-bold rounded-lg text-xs shadow-md transition transform active:scale-95"
              >
                {submitting ? '접수 중...' : '신청 완료하기'}
              </button>
            </form>
          )}
        </div>

        {/* CTA 버튼 */}
        <div className="pt-2">
          <button
            type="button"
            onClick={scrollToForm}
            style={{ 
              backgroundColor: site.primary_color,
              fontSize: `${site.button_size_px || 14}px`
            }}
            className={`w-full py-3.5 px-6 text-white font-bold rounded-xl shadow-lg transition transform hover:opacity-95 active:scale-95 text-center ${getFontFamilyClass(site.button_font || 'sans')}`}
          >
            {site.button_text || '상담 신청하러 가기'}
          </button>
        </div>

      </div>

      {/* 개인정보 약관 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-left font-sans">
            <h4 className="text-sm font-bold text-slate-900 border-b pb-2">개인정보 수집 및 이용 안내</h4>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed max-h-56 overflow-y-auto">
              <p><b>1. 수집 목적:</b> 문의 응대 및 상담 진행, 서비스 안내</p>
              <p><b>2. 수집 항목:</b> 성함, 연락처, 문의 내용</p>
              <p><b>3. 보유 및 이용 기간:</b> 문의 접수 및 상담 완료 시점으로부터 3개월 보관 후 지체 없이 파기</p>
              <p className="text-[11px] text-slate-400">※ 귀하는 동의를 거부할 권리가 있으며, 동의 거부 시 상담 신청이 제한될 수 있습니다.</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              확인
            </button>
          </div>
        </div>
      )}

    </main>
  );
}