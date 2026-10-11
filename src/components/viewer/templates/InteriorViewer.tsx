'use client';

import React, { useState } from 'react';

interface Props {
  data: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  editable?: boolean;
}

export default function InteriorViewer({ data, setData, editable = false }: Props) {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [beforeAfterIndex, setBeforeAfterIndex] = useState<{ [key: number]: boolean }>({});
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    spaceType: '',
    area: '',
    timeline: '',
    content: '',
    privacy: false,
  });

  const projects = data?.projects || [];
  const services = data?.services || [];
  const process = data?.process || [];

  const toggleBeforeAfter = (idx: number) => {
    setBeforeAfterIndex((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

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
    setFormData({ name: '', phone: '', spaceType: '', area: '', timeline: '', content: '', privacy: false });
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900">
      {/* ===== HERO (Full Screen) ===== */}
      <section
        className="relative flex h-screen w-full items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${data?.hero?.mediaUrl || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=900&fit=crop'}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold md:text-6xl">
            {data?.hero?.title || '당신의 꿈의 공간을 만듭니다'}
          </h1>
          <p className="mt-6 text-lg md:text-xl">
            {data?.hero?.subtitle || '전문적인 시공으로 가치 있는 인테리어'}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#projects"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              시공 사례 보기
            </a>
            <a
              href="#estimate"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              무료 견적 문의
            </a>
          </div>
        </div>
      </section>

      {/* ===== 시공 사례 ===== */}
      <section id="projects" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">시공 사례</h2>
          <p className="mt-4 text-center text-slate-600">
            저희의 시공 실력을 직접 확인해보세요
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(projects.length > 0
              ? projects
              : [
                  {
                    name: '강남 아파트 풀리모델링',
                    area: '84㎡',
                    tags: ['풀리모델링', '거실'],
                    duration: '3개월',
                    beforeImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
                    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
                  },
                  {
                    name: '강서구 상가 인테리어',
                    area: '150㎡',
                    tags: ['상업공간', '카페'],
                    duration: '2개월',
                    beforeImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
                    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
                  },
                  {
                    name: '강동구 사무실 개선',
                    area: '120㎡',
                    tags: ['부분시공', '사무실'],
                    duration: '1개월',
                    beforeImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
                    afterImage: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
                  },
                ]
            ).map((p: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedProject(idx)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* Before/After 슬라이더 */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-200">
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      backgroundImage: `url('${beforeAfterIndex[idx] ? p.afterImage : p.beforeImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBeforeAfter(idx);
                    }}
                    className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-white"
                  >
                    {beforeAfterIndex[idx] ? 'After' : 'Before'}
                  </button>
                </div>

                {/* 정보 */}
                <div className="p-4">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="mt-2 text-sm text-slate-500">{p.area} · {p.duration}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((tag: string, ti: number) => (
                      <span
                        key={ti}
                        className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 서비스 ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">서비스</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(services.length > 0
              ? services
              : [
                  { icon: '🏠', title: '풀리모델링', description: '벽, 바닥, 천장까지 완전히 새롭게' },
                  { icon: '🎨', title: '부분시공', description: '필요한 부분만 선택적으로 개선' },
                  { icon: '🏢', title: '상업공간', description: '카페, 매장, 사무실 전문 시공' },
                  { icon: '💡', title: '컨설팅', description: '공간 분석 및 디자인 제안' },
                ]
            ).map((s: any, idx: number) => (
              <div key={idx} className="text-center">
                <div className="text-5xl">{s.icon}</div>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 시공 절차 ===== */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-bold">시공 절차</h2>
          <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {(process.length > 0
              ? process
              : [
                  { step: 1, title: '상담', description: '공간과 요구사항 파악' },
                  { step: 2, title: '실측', description: '정확한 치수 측정' },
                  { step: 3, title: '견적', description: '맞춤형 견적 제시' },
                  { step: 4, title: '시공', description: '전문가 시공 진행' },
                  { step: 5, title: 'A/S', description: '시공 후 관리' },
                ]
            ).map((p: any, idx: number) => (
              <div key={idx} className="flex flex-1 flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  {p.step}
                </div>
                <h3 className="mt-4 font-bold">{p.title}</h3>
                <p className="mt-2 text-center text-sm text-slate-600">{p.description}</p>
                {idx < (process.length || 5) - 1 && (
                  <div className="mt-4 hidden h-12 w-1 bg-blue-300 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 견적 문의 폼 ===== */}
      <section id="estimate" className="py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center text-4xl font-bold">무료 견적 문의</h2>
          <form onSubmit={handleSubmit} className="mt-10 space-y-4 rounded-xl border border-slate-200 bg-white p-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700">이름 *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">연락처 *</label>
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
                <label className="block text-sm font-semibold text-slate-700">공간 유형 *</label>
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
                <label className="block text-sm font-semibold text-slate-700">평수 *</label>
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
              <label className="block text-sm font-semibold text-slate-700">희망 시공 시기 *</label>
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
              <label className="block text-sm font-semibold text-slate-700">추가 요청사항</label>
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
          <p className="font-bold">{data?.footer?.companyName || '인테리어 회사'}</p>
          <p className="mt-2 text-sm text-slate-400">{data?.footer?.address}</p>
          <p className="mt-1 text-xs text-slate-500">
            사업자등록번호: {data?.footer?.businessNumber}
          </p>
          <div className="mt-6 flex gap-4">
            <a href={`tel:${data?.csCenter?.contactInfo?.phone}`} className="text-sm hover:text-blue-400">
              전화: {data?.csCenter?.contactInfo?.phone}
            </a>
            <a href={`mailto:${data?.csCenter?.contactInfo?.email}`} className="text-sm hover:text-blue-400">
              이메일: {data?.csCenter?.contactInfo?.email}
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-600">
            © {new Date().getFullYear()} {data?.footer?.companyName}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ===== 상세 모달 ===== */}
      {selectedProject !== null && projects[selectedProject] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="float-right text-2xl font-bold text-slate-400 hover:text-slate-900"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold">{projects[selectedProject].name}</h3>
            <p className="mt-2 text-slate-600">
              {projects[selectedProject].area} · {projects[selectedProject].duration}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(projects[selectedProject].images || [
                projects[selectedProject].beforeImage,
                projects[selectedProject].afterImage,
              ]).map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${projects[selectedProject].name} ${idx + 1}`}
                  className="rounded-lg"
                />
              ))}
            </div>
            {projects[selectedProject].description && (
              <p className="mt-4 text-slate-700">{projects[selectedProject].description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}