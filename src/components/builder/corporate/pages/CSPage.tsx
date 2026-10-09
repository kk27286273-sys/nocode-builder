'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CSPageProps {
  guide?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export default function CSPage({ guide, contactInfo }: CSPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      <section className="py-24 px-4 bg-slate-900 text-white text-center">
        <span className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 block">Customer Support</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">고객센터</h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          {guide || '궁금하신 점이나 프로젝트 문의를 남겨주시면 담당자가 신속히 답변해 드립니다.'}
        </p>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">문의 안내</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                온라인 문의 양식을 작성해 주시면 검토 후 기재해 주신 연락처로 회신드립니다.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">전화번호</span>
                <p className="text-lg font-bold text-slate-900">{contactInfo?.phone || '등록된 번호가 없습니다.'}</p>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">이메일 문의</span>
                <p className="text-lg font-bold text-slate-900">{contactInfo?.email || '등록된 이메일이 없습니다.'}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="p-8 md:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-8">온라인 상담 문의</h3>

              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">문의가 정상 접수되었습니다.</h4>
                  <p className="text-slate-500 text-sm">확인 후 빠른 시일 내에 연락드리겠습니다.</p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
                  >
                    추가 문의 작성
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">성함 / 담당자명 *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                        placeholder="홍길동"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">회신받을 이메일 *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                        placeholder="example@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">연락처</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                        placeholder="010-0000-0000"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-2 block">문의 제목 *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                        placeholder="문의하실 제목을 입력하세요"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 block">문의 내용 *</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-600"
                      placeholder="상세 문의 내용을 작성해 주세요"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition shadow-sm"
                  >
                    문의 접수하기
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}