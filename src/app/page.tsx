'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { B2BTemplateData, defaultB2BTemplate, FeatureItem } from '@/data/templates';
import PaymentModal from '@/components/PaymentModal';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EditorPage() {
  const [data, setData] = useState<B2BTemplateData>(defaultB2BTemplate);
  const [zoomScale, setZoomScale] = useState<number>(0.75);
  const [isFit, setIsFit] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileName = `bg-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const { data: uploadData, error } = await supabase.storage.from('images').upload(fileName, file);

    if (!error && uploadData) {
      const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(uploadData.path);
      setData((prev) => ({ ...prev, bgImageUrl: publicUrlData.publicUrl }));
    }
    setIsUploading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, featureId: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentFeature = data.features.find((f) => f.id === featureId);
    if ((currentFeature?.imageUrls?.length || 0) + files.length > 5) {
      alert('이미지는 최대 5장까지 첨부 가능합니다.');
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const { data: uploadData, error } = await supabase.storage.from('images').upload(fileName, file);

      if (!error && uploadData) {
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(uploadData.path);
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    if (uploadedUrls.length > 0) {
      setData((prev) => ({
        ...prev,
        features: prev.features.map((f) =>
          f.id === featureId ? { ...f, imageUrls: [...f.imageUrls, ...uploadedUrls] } : f
        ),
      }));
    }
    setIsUploading(false);
    e.target.value = '';
  };

  const handleRemoveImage = (featureId: string, imgIndex: number) => {
    setData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === featureId ? { ...f, imageUrls: f.imageUrls.filter((_, idx) => idx !== imgIndex) } : f
      ),
    }));
  };

  const handleAddFeature = () => {
    const newFeature: FeatureItem = {
      id: `feat-${Date.now()}`,
      title: '신규 엔터프라이즈 솔루션',
      description: '고객 맞춤형 프로세스를 통해 안정적인 고성능 서비스를 제공합니다.',
      imageUrls: [],
    };
    setData((prev) => ({ ...prev, features: [...prev.features, newFeature] }));
  };

  const handleRemoveFeature = (id: string) => {
    if (data.features.length <= 1) {
      alert('최소 1개의 서비스 섹션은 유지해야 합니다.');
      return;
    }
    setData((prev) => ({ ...prev, features: prev.features.filter((f) => f.id !== id) }));
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      const { data: site, error } = await supabase
        .from('sites')
        .insert([{ title: data.company.name, content: data }])
        .select()
        .single();

      if (error) throw error;
      setPublishedUrl(`${window.location.origin}/p/${site.id}`);
    } catch (err: any) {
      alert('발행 중 오류: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* 좌측 에디터 입력창 */}
      <div className="w-1/3 min-w-[390px] bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-20">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white shrink-0">
          <h1 className="font-bold text-base tracking-tight">B2B 웹 빌더 에디터</h1>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-500 shadow-sm px-4 py-2 rounded-lg text-xs font-bold transition disabled:opacity-50"
          >
            {isSaving ? '발행 중...' : '사이트 무료 발행'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {publishedUrl && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-xs">
              <p className="text-xs font-bold text-blue-800">발행 완료 URL</p>
              <input
                type="text"
                readOnly
                value={publishedUrl}
                className="w-full mt-2 p-2 text-xs bg-white border rounded font-mono"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(publishedUrl)}
                  className="flex-1 bg-blue-600 text-white text-xs py-2 rounded font-semibold hover:bg-blue-700"
                >
                  링크 복사
                </button>
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="bg-emerald-600 text-white text-xs px-3 py-2 rounded font-semibold hover:bg-emerald-700"
                >
                  워터마크 제거
                </button>
              </div>
            </div>
          )}

          {/* 1. 기업 기본 정보 */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">1. 기업 기본 정보 (최상단)</h2>
            <div>
              <label className="text-xs text-slate-500">회사명</label>
              <input
                type="text"
                value={data.company.name}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    company: { ...prev.company, name: e.target.value },
                    footer: { ...prev.footer, companyName: e.target.value },
                  }))
                }
                className="w-full p-2 border rounded text-xs bg-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">고객센터 직통 번호 (플로팅 버튼)</label>
              <input
                type="text"
                value={data.supportPhone}
                onChange={(e) => setData((prev) => ({ ...prev, supportPhone: e.target.value }))}
                className="w-full p-2 border rounded text-xs bg-white mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500">대표자명</label>
                <input
                  type="text"
                  value={data.footer.ownerName}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, footer: { ...prev.footer, ownerName: e.target.value } }))
                  }
                  className="w-full p-2 border rounded text-xs bg-white mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">사업자등록번호</label>
                <input
                  type="text"
                  value={data.footer.businessNumber}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, footer: { ...prev.footer, businessNumber: e.target.value } }))
                  }
                  className="w-full p-2 border rounded text-xs bg-white mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500">사업장 주소</label>
              <input
                type="text"
                value={data.footer.address}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, footer: { ...prev.footer, address: e.target.value } }))
                }
                className="w-full p-2 border rounded text-xs bg-white mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">대표 이메일</label>
              <input
                type="text"
                value={data.footer.contactEmail}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, footer: { ...prev.footer, contactEmail: e.target.value } }))
                }
                className="w-full p-2 border rounded text-xs bg-white mt-1"
              />
            </div>
          </div>

          {/* 2. 네비게이션 메뉴 */}
          <div className="space-y-3 border-b pb-4">
            <h2 className="text-sm font-bold text-slate-800">2. 상단 네비게이션 메뉴 (GNB)</h2>
            <div className="space-y-2">
              {data.navItems.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        navItems: prev.navItems.map((n, i) => (i === idx ? { ...n, label: e.target.value } : n)),
                      }))
                    }
                    className="flex-1 p-2 border rounded text-xs"
                  />
                  <input
                    type="text"
                    value={item.targetId}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        navItems: prev.navItems.map((n, i) => (i === idx ? { ...n, targetId: e.target.value } : n)),
                      }))
                    }
                    className="w-24 p-2 border rounded text-xs font-mono text-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. 좌측 카테고리 */}
          <div className="space-y-2 border-b pb-4">
            <h2 className="text-sm font-bold text-slate-800">3. 좌측 카테고리 분류</h2>
            <input
              type="text"
              value={data.categories.join(', ')}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  categories: e.target.value.split(',').map((c) => c.trim()).filter(Boolean),
                }))
              }
              className="w-full p-2 border rounded text-xs"
            />
          </div>

          {/* 4. 히어로 문구 & 배경 */}
          <div className="space-y-3 border-b pb-4">
            <h2 className="text-sm font-bold text-slate-800">4. 메인 히어로 & 배경</h2>
            <div>
              <label className="text-xs text-slate-500">배지 텍스트</label>
              <input
                type="text"
                value={data.hero.badge}
                onChange={(e) => setData((prev) => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))}
                className="w-full p-2 border rounded text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">메인 헤드라인</label>
              <textarea
                rows={2}
                value={data.hero.headline}
                onChange={(e) => setData((prev) => ({ ...prev, hero: { ...prev.hero, headline: e.target.value } }))}
                className="w-full p-2 border rounded text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">서브 문구</label>
              <textarea
                rows={2}
                value={data.hero.subheadline}
                onChange={(e) => setData((prev) => ({ ...prev, hero: { ...prev.hero, subheadline: e.target.value } }))}
                className="w-full p-2 border rounded text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">배경 이미지 첨부</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBgImageUpload}
                disabled={isUploading}
                className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-200 file:text-xs block mt-1"
              />
              {data.bgImageUrl && (
                <button
                  type="button"
                  onClick={() => setData((prev) => ({ ...prev, bgImageUrl: '' }))}
                  className="text-xs text-red-500 underline mt-1 block"
                >
                  배경 제거
                </button>
              )}
            </div>
          </div>

          {/* 5. 실적 수치 */}
          <div className="space-y-3 border-b pb-4">
            <h2 className="text-sm font-bold text-slate-800">5. 핵심 수치 (Metrics)</h2>
            {data.metrics.map((metric, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      metrics: prev.metrics.map((m, i) => (i === idx ? { ...m, value: e.target.value } : m)),
                    }))
                  }
                  className="p-2 border rounded text-xs font-bold text-blue-600"
                />
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      metrics: prev.metrics.map((m, i) => (i === idx ? { ...m, label: e.target.value } : m)),
                    }))
                  }
                  className="p-2 border rounded text-xs"
                />
              </div>
            ))}
          </div>

          {/* 6. 서비스 등록 & 섹션 추가/삭제 */}
          <div className="space-y-3 border-b pb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800">6. 솔루션/서비스</h2>
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold px-2 py-1 rounded"
              >
                + 섹션 추가
              </button>
            </div>
            {data.features.map((feature, fIdx) => (
              <div key={feature.id} className="p-3 border rounded-xl bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500">#{fIdx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(feature.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      features: prev.features.map((f) => (f.id === feature.id ? { ...f, title: e.target.value } : f)),
                    }))
                  }
                  className="w-full p-2 border rounded text-xs bg-white font-bold"
                />
                <textarea
                  value={feature.description}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      features: prev.features.map((f) => (f.id === feature.id ? { ...f, description: e.target.value } : f)),
                    }))
                  }
                  rows={2}
                  className="w-full p-2 border rounded text-xs bg-white"
                />
                {feature.imageUrls?.length > 0 && (
                  <div className="flex gap-2 flex-wrap pt-1">
                    {feature.imageUrls.map((url, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded border overflow-hidden group">
                        <img src={url} alt="썸네일" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(feature.id, idx)}
                          className="absolute inset-0 bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, feature.id)}
                    disabled={isUploading || feature.imageUrls.length >= 5}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-slate-200 file:text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 7. 파트너사 */}
          <div className="space-y-3 border-b pb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800">7. 파트너사</h2>
              <input
                type="checkbox"
                checked={data.partnersSection.enabled}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    partnersSection: { ...prev.partnersSection, enabled: e.target.checked },
                  }))
                }
              />
            </div>
            {data.partnersSection.enabled && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={data.partnersSection.title}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      partnersSection: { ...prev.partnersSection, title: e.target.value },
                    }))
                  }
                  className="w-full p-2 border rounded text-xs"
                />
                <input
                  type="text"
                  value={data.partnersSection.partners.join(', ')}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      partnersSection: {
                        ...prev,
                        partners: e.target.value.split(',').map((p) => p.trim()).filter(Boolean),
                      },
                    }))
                  }
                  className="w-full p-2 border rounded text-xs"
                />
              </div>
            )}
          </div>

          {/* 8. 고객 후기 */}
          <div className="space-y-3 border-b pb-4">
            <h2 className="text-sm font-bold text-slate-800">8. 고객 후기</h2>
            {data.testimonials.map((t, idx) => (
              <div key={idx} className="p-3 border rounded-xl bg-slate-50 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={t.company}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        testimonials: prev.testimonials.map((item, i) => (i === idx ? { ...item, company: e.target.value } : item)),
                      }))
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                  <input
                    type="text"
                    value={t.author}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        testimonials: prev.testimonials.map((item, i) => (i === idx ? { ...item, author: e.target.value } : item)),
                      }))
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                  <input
                    type="text"
                    value={t.role}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        testimonials: prev.testimonials.map((item, i) => (i === idx ? { ...item, role: e.target.value } : item)),
                      }))
                    }
                    className="p-1.5 border rounded text-xs"
                  />
                </div>
                <textarea
                  rows={2}
                  value={t.comment}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      testimonials: prev.testimonials.map((item, i) => (i === idx ? { ...item, comment: e.target.value } : item)),
                    }))
                  }
                  className="w-full p-2 border rounded text-xs bg-white"
                />
              </div>
            ))}
          </div>

          {/* 9. FAQ */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-800">9. 자주 묻는 질문 (FAQ)</h2>
            {data.faqs.map((faq, idx) => (
              <div key={idx} className="p-3 border rounded-xl bg-slate-50 space-y-2">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      faqs: prev.faqs.map((item, i) => (i === idx ? { ...item, question: e.target.value } : item)),
                    }))
                  }
                  className="w-full p-2 border rounded text-xs font-bold bg-white"
                />
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      faqs: prev.faqs.map((item, i) => (i === idx ? { ...item, answer: e.target.value } : item)),
                    }))
                  }
                  className="w-full p-2 border rounded text-xs bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 우측 캔버스: 깊이감(Depth)과 리듬감이 보강된 엔터프라이즈 디자인 */}
      <div className="flex-1 h-full flex flex-col bg-slate-300 overflow-hidden">
        {/* 상단 줌 컨트롤 바 */}
        <div className="bg-white border-b border-slate-300 px-6 py-2.5 flex justify-between items-center z-10 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">배율:</span>
            <button
              onClick={() => { setIsFit(true); setZoomScale(0.7); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${isFit ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              화면 맞춤
            </button>
            <button
              onClick={() => { setIsFit(false); setZoomScale(0.5); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${!isFit && zoomScale === 0.5 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              50%
            </button>
            <button
              onClick={() => { setIsFit(false); setZoomScale(0.75); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${!isFit && zoomScale === 0.75 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              75%
            </button>
            <button
              onClick={() => { setIsFit(false); setZoomScale(1.0); }}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${!isFit && zoomScale === 1.0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              100%
            </button>
          </div>
          <span className="text-xs text-slate-400 font-medium">1200px 프리미엄 엔터프라이즈 캔버스</span>
        </div>

        {/* 캔버스 뷰포트 */}
        <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
          <div
            style={{
              width: '1200px',
              transform: `scale(${zoomScale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out',
              marginBottom: `${(1 - zoomScale) * -600}px`,
              backgroundImage: data.bgImageUrl ? `url(${data.bgImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
            className="relative bg-slate-50 shadow-2xl rounded-2xl border border-slate-300 overflow-hidden shrink-0 flex flex-col min-h-screen"
          >
            {/* GNB (글래스모피즘 보더) */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 flex justify-between items-center shadow-xs">
              <div className="flex items-center gap-8">
                <span className="font-black text-xl text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block animate-pulse"></span>
                  {data.company.name}
                </span>
                <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
                  {data.navItems.map((nav, idx) => (
                    <a key={idx} href={`#${nav.targetId}`} className="hover:text-blue-600 transition">
                      {nav.label}
                    </a>
                  ))}
                </nav>
              </div>
              <a
                href="#contact"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition transform hover:-translate-y-0.5"
              >
                {data.hero.ctaText}
              </a>
            </header>

            {/* 메인 레이아웃 */}
            <div className="flex flex-1 relative">
              {/* 좌측 사이드바 */}
              <aside className="w-60 bg-white/90 backdrop-blur-md border-r border-slate-200/80 p-6 flex flex-col gap-6 shrink-0 sticky top-[69px] h-[calc(100vh-69px)] overflow-y-auto">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">솔루션 분류</h3>
                  <ul className="space-y-1.5 text-sm font-medium text-slate-700">
                    {data.categories.map((cat, idx) => (
                      <li
                        key={idx}
                        className={`px-3 py-2 rounded-lg cursor-pointer transition flex items-center justify-between ${
                          idx === 0
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span>{cat}</span>
                        {idx === 0 && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">HOT</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto p-4 bg-slate-900 rounded-xl text-xs text-slate-300 shadow-sm border border-slate-800">
                  <p className="font-bold text-white mb-1">고객센터 직통</p>
                  <p className="font-mono text-blue-400 text-sm font-bold">{data.supportPhone}</p>
                  <p className="text-[10px] text-slate-400 mt-2">평일 09:00 - 18:00 (전담 대응)</p>
                </div>
              </aside>

              {/* 본문 콘텐츠 */}
              <main className={`flex-1 p-8 md:p-12 ${data.bgImageUrl ? 'bg-white/90 backdrop-blur-md' : 'bg-transparent'}`}>
                {/* 1. 히어로: 그라데이션 타이포와 배경 블러 */}
                <section id="hero" className="py-20 text-center relative overflow-hidden">
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {data.hero.badge}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight whitespace-pre-line tracking-tight">
                    {data.hero.headline}
                  </h1>
                  <p className="mt-6 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    {data.hero.subheadline}
                  </p>
                  <div className="mt-8 flex justify-center gap-4">
                    <a
                      href="#contact"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 text-sm"
                    >
                      {data.hero.ctaText}
                    </a>
                    <a
                      href="#services"
                      className="inline-block bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-7 py-3.5 rounded-xl shadow-xs transition text-sm"
                    >
                      솔루션 둘러보기
                    </a>
                  </div>
                </section>

                {/* 2. 파트너사 목록 (미세 카드 플로팅) */}
                {data.partnersSection?.enabled && (
                  <section className="py-8 border-y border-slate-200/80 bg-white/70 backdrop-blur rounded-2xl my-6 px-6">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                      {data.partnersSection.title}
                    </p>
                    <div className="flex flex-wrap justify-around items-center opacity-80 grayscale hover:grayscale-0 transition duration-300 gap-4">
                      {data.partnersSection.partners.map((partnerName, idx) => (
                        <span key={idx} className="font-extrabold text-sm text-slate-700 tracking-tight bg-slate-50 px-4 py-2 rounded-lg border border-slate-200/60 shadow-2xs">
                          {partnerName}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* 3. 3단 핵심 강점 카드 (비주얼 깊이감 부여) */}
                <section className="py-12 grid grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-200">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center mb-4">01</div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">엔터프라이즈 맞춤 설계</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">고객사의 복잡한 비즈니스 로직을 분석하여 가장 효율적인 인프라를 구축합니다.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-200">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center mb-4">02</div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">24/7 실시간 보안 관제</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">이상 징후 발생 즉시 자동으로 복구하며 무중단 시스템 운영을 보장합니다.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-200">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center mb-4">03</div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">운영 비용 40% 절감</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">불필요한 클라우드 및 서버 리소스를 최적화하여 고정비를 획기적으로 낮춥니다.</p>
                  </div>
                </section>

                {/* 4. 실적 수치 섹션 (묵직한 Slate-900 배경으로 반전) */}
                <section id="metrics" className="my-10 p-10 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative z-10 grid grid-cols-3 gap-8 text-center divide-x divide-slate-800">
                    {data.metrics.map((metric, i) => (
                      <div key={i} className={i !== 0 ? 'pl-8' : ''}>
                        <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                          {metric.value}
                        </div>
                        <div className="text-xs md:text-sm font-semibold text-slate-400 mt-2 tracking-wide">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. 서비스 솔루션 섹션 */}
                <section id="services" className="py-12">
                  <div className="text-center mb-10">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Solutions</span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">핵심 비즈니스 솔루션</h2>
                  </div>
                  <div className="space-y-8">
                    {data.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition duration-300"
                      >
                        <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                        <p className="text-slate-600 mt-2 text-sm leading-relaxed">{feature.description}</p>
                        {feature.imageUrls?.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            {feature.imageUrls.map((url, idx) => (
                              <img
                                key={`${feature.id}-${idx}-${url}`}
                                src={url}
                                alt="솔루션 상세"
                                className="w-full h-56 object-cover rounded-2xl border border-slate-200/80 shadow-xs hover:opacity-95 transition"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* 6. 고객 후기 (입체 카드 디자인) */}
                <section id="testimonials" className="py-12">
                  <div className="text-center mb-10">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Success Story</span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">고객사 성공 후기</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {data.testimonials.map((t, idx) => (
                      <div
                        key={idx}
                        className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                      >
                        <p className="text-slate-700 text-sm leading-relaxed italic">"{t.comment}"</p>
                        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                          <img src={t.avatarUrl} alt={t.author} className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 shadow-xs" />
                          <div>
                            <p className="font-bold text-sm text-slate-900">{t.author} <span className="text-xs text-slate-500 font-normal">{t.role}</span></p>
                            <p className="text-xs text-blue-600 font-bold">{t.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 7. FAQ (아코디언 카드) */}
                <section id="faqs" className="py-12">
                  <div className="text-center mb-10">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">FAQ</span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">자주 묻는 질문</h2>
                  </div>
                  <div className="space-y-3 max-w-2xl mx-auto">
                    {data.faqs.map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs transition duration-200"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full p-5 text-left font-bold text-sm text-slate-800 flex justify-between items-center hover:bg-slate-50"
                          >
                            <span>{faq.question}</span>
                            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black">
                              {isOpen ? '−' : '+'}
                            </span>
                          </button>
                          {isOpen && (
                            <div className="p-5 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* 8. 도입 문의 폼 */}
                <section id="contact" className="py-12 bg-white border border-slate-200/90 rounded-3xl p-10 my-8 shadow-lg max-w-2xl mx-auto">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-slate-900">도입 및 제휴 상담 신청</h3>
                    <p className="text-xs text-slate-500 mt-1">문의를 남겨주시면 영업일 기준 24시간 이내 연락드립니다.</p>
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="기업명" className="w-full p-3.5 border rounded-xl text-xs bg-slate-50/50 outline-none focus:border-blue-600 transition" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="담당자명" className="w-full p-3.5 border rounded-xl text-xs bg-slate-50/50 outline-none focus:border-blue-600 transition" />
                      <input type="tel" placeholder="연락처" className="w-full p-3.5 border rounded-xl text-xs bg-slate-50/50 outline-none focus:border-blue-600 transition" />
                    </div>
                    <textarea rows={3} placeholder="요청 사항을 자유롭게 적어주세요" className="w-full p-3.5 border rounded-xl text-xs bg-slate-50/50 outline-none focus:border-blue-600 transition" />
                    <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-md hover:shadow-lg transition">
                      상담 신청하기
                    </button>
                  </div>
                </section>
              </main>
            </div>

            {/* 플로팅 고객센터 버튼 (발광 그림자) */}
            <div className="fixed bottom-6 right-6 z-50">
              <a
                href={`tel:${data.supportPhone}`}
                className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-2xl shadow-blue-500/30 transition transform hover:scale-105"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-sm font-bold">고객센터</span>
                <span className="bg-white text-blue-600 text-xs font-black px-2 py-0.5 rounded-full shadow-2xs">
                  {data.supportPhone}
                </span>
              </a>
            </div>

            {/* 푸터 */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-10 text-xs leading-relaxed border-t border-slate-800 z-10">
              <div className="max-w-4xl">
                <p className="font-black text-slate-100 text-sm mb-2">{data.footer.companyName}</p>
                <p>대표자: {data.footer.ownerName} | 사업자등록번호: {data.footer.businessNumber}</p>
                <p>주소: {data.footer.address} | 문의: {data.footer.contactEmail}</p>
                <p className="mt-4 text-slate-600 font-medium">© {data.footer.companyName}. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <PaymentModal isOpen={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} />
    </div>
  );
}