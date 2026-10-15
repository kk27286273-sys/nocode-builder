'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CSPageProps {
  guide?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
    mapUrl?: string;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-white"
    >
      <section className="bg-slate-900 px-4 py-24 text-center text-white">
        <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-blue-400">
          Customer Support
        </span>

        <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-6xl">
          고객센터
        </h1>

        <p className="mx-auto max-w-2xl whitespace-pre-line font-light leading-relaxed text-slate-400">
          {guide ||
            '궁금하신 점이나 프로젝트 문의를 남겨주시면 담당자가 신속히 답변해 드립니다.'}
        </p>
      </section>

      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                  문의 안내
                </h2>

                <p className="mb-8 text-sm leading-relaxed text-slate-600">
                  온라인 문의 양식을 작성해 주시면 검토 후 기재해 주신
                  연락처로 회신드립니다.
                </p>
              </div>

              <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    전화번호
                  </span>

                  <p className="text-lg font-bold text-slate-900">
                    {contactInfo?.phone || '등록된 번호가 없습니다.'}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    이메일
                  </span>

                  {contactInfo?.email ? (
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="break-all text-lg font-bold text-slate-900 transition hover:text-blue-600"
                    >
                      {contactInfo.email}
                    </a>
                  ) : (
                    <p className="text-lg font-bold text-slate-900">
                      등록된 이메일이 없습니다.
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                    사업장 주소
                  </span>

                  <p className="text-sm leading-6 text-slate-700">
                    {contactInfo?.address || '등록된 주소가 없습니다.'}
                  </p>

                  {contactInfo?.mapUrl && (
                    <a
                      href={contactInfo.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                      네이버 지도에서 위치 보기
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
                <h3 className="mb-8 text-xl font-bold text-slate-900">
                  온라인 상담 문의
                </h3>

                {submitted ? (
                  <div className="space-y-4 py-16 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl font-black text-blue-600">
                      ✓
                    </div>

                    <h4 className="text-xl font-bold text-slate-900">
                      문의가 정상 접수되었습니다.
                    </h4>

                    <p className="text-sm text-slate-500">
                      확인 후 빠른 시일 내에 연락드리겠습니다.
                    </p>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-4 rounded-lg bg-slate-900 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                    >
                      추가 문의 작성
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">
                          성함 / 담당자명 *
                        </label>

                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              name: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-600 focus:outline-none"
                          placeholder="홍길동"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">
                          회신받을 이메일 *
                        </label>

                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              email: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-600 focus:outline-none"
                          placeholder="example@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">
                          연락처
                        </label>

                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              phone: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-600 focus:outline-none"
                          placeholder="010-0000-0000"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-bold text-slate-600">
                          문의 제목 *
                        </label>

                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              subject: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-600 focus:outline-none"
                          placeholder="문의하실 제목을 입력하세요"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        문의 내용 *
                      </label>

                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            message: event.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-blue-600 focus:outline-none"
                        placeholder="상세 문의 내용을 작성해 주세요"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-blue-600 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      문의 접수하기
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}