'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface StoryItem {
  id: string;
  title: string;
  content: string;
}

interface PageData {
  siteId: string;
  imageUrl: string;
  backgroundColor: string;
  title: string;
  titleColor: string;
  titleFont: 'sans' | 'serif' | 'mono';
  titleSizePx: number;
  subtitle: string;
  subtitleColor: string;
  subtitleFont: 'sans' | 'serif' | 'mono';
  subtitleSizePx: number;
  featureAlign: 'left' | 'center' | 'right';
  featureFont: 'sans' | 'serif' | 'mono';
  featureTitleSizePx: number;
  featureDescSizePx: number;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  stories: StoryItem[];
  faq1Q: string;
  faq1A: string;
  faq2Q: string;
  faq2A: string;
  faq3Q: string;
  faq3A: string;
  buttonText: string;
  buttonLink: string;
  primaryColor: string;
  buttonFont: 'sans' | 'serif' | 'mono';
  buttonSizePx: number;
}

const TEMPLATES: Record<string, Partial<PageData>> = {
  market: {
    title: '봄 시즌 한정 홈카페 오로라 글라스',
    titleColor: '#4a3b32',
    titleFont: 'serif',
    titleSizePx: 22,
    subtitle: '빛에 따라 영롱하게 빛나는 감성 테이블웨어. 단 3일간 30% 할인 공구 오픈!',
    subtitleColor: '#8c7b70',
    subtitleFont: 'serif',
    subtitleSizePx: 13,
    backgroundColor: '#faf7f2',
    primaryColor: '#c2785c',
    buttonText: '공구 특별가로 주문하기',
    buttonFont: 'serif',
    buttonSizePx: 14,
    featureAlign: 'center',
    featureFont: 'serif',
    featureTitleSizePx: 13,
    featureDescSizePx: 11,
    feature1Title: '영롱한 오로라 코팅',
    feature1Desc: '음료를 담는 순간 감성적인 분위기를 연출합니다.',
    feature2Title: '내열 강화 유리',
    feature2Desc: '뜨거운 커피부터 차가운 에이드까지 안전합니다.',
    feature3Title: '무료 배송 & 선물 포장',
    feature3Desc: '2세트 이상 구매 시 기프트 박스에 포장됩니다.',
    stories: [
      {
        id: '1',
        title: '일상에 작은 빛을 더하는 글라스웨어',
        content: '매일 마시는 커피 한 잔도 특별해질 수 있도록 제작했습니다. 수작업 이온 코팅 공법으로 빛의 각도마다 영롱한 빛을 냅니다.',
      }
    ],
    faq1Q: '식기세척기나 전자레인지 사용이 가능한가요?',
    faq1A: '특수 코팅 보호를 위해 전자레인지 및 식기세척기 사용은 피해주시고 부드러운 스펀지 손세척을 권장합니다.',
    faq2Q: '배송은 언제 시작되나요?',
    faq2A: '공구 마감 익일부터 순차 출고되며 영업일 기준 2~3일 내 수령 가능합니다.',
    faq3Q: '',
    faq3A: '',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60',
  },
  consulting: {
    title: '복잡한 세무·보험, 전문가가 1:1 맞춤 진단합니다',
    titleColor: '#0f172a',
    titleFont: 'sans',
    titleSizePx: 21,
    subtitle: '놓치고 있는 환급금과 과다 지출 보험료를 꼼꼼하게 찾아드립니다.',
    subtitleColor: '#475569',
    subtitleFont: 'sans',
    subtitleSizePx: 13,
    backgroundColor: '#ffffff',
    primaryColor: '#2563eb',
    buttonText: '무료 1:1 진단 신청하기',
    buttonFont: 'sans',
    buttonSizePx: 14,
    featureAlign: 'left',
    featureFont: 'sans',
    featureTitleSizePx: 13,
    featureDescSizePx: 11,
    feature1Title: '빅데이터 기반 정밀 진단',
    feature1Desc: '수만 건의 약관 데이터를 기반으로 분석합니다.',
    feature2Title: '100% 무료 비대면 상담',
    feature2Desc: '전화 또는 카카오톡으로 부담 없이 상담받으세요.',
    feature3Title: '철저한 개인정보 보호',
    feature3Desc: '상담 목적 외에는 정보를 일절 보관하지 않습니다.',
    stories: [
      {
        id: '1',
        title: '왜 지금 진단받아야 할까요?',
        content: '대부분의 사람들은 본인이 가입한 약관의 80%를 알지 못한 채 매달 불필요한 비용을 지출합니다. 전문 플래너가 중복 보장을 덜어내 드립니다.',
      }
    ],
    faq1Q: '정말 상담 비용이 전혀 없나요?',
    faq1A: '네, 1차 종합 진단 리포트 발행 및 분석 상담은 100% 무료로 진행됩니다.',
    faq2Q: '상담 신청 후 언제 연락이 오나요?',
    faq2A: '신청서 접수 후 담당 전문 플래너가 영업시간 기준 2시간 내로 연락드립니다.',
    faq3Q: '',
    faq3A: '',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60',
  },
  waitlist: {
    title: '차세대 AI 생산성 툴, Horizon',
    titleColor: '#f8fafc',
    titleFont: 'mono',
    titleSizePx: 23,
    subtitle: '반복 업무는 이제 그만. 당신의 일상에 AI 비서를 도입하세요.',
    subtitleColor: '#94a3b8',
    subtitleFont: 'mono',
    subtitleSizePx: 12,
    backgroundColor: '#0f172a',
    primaryColor: '#10b981',
    buttonText: '얼리버드 사전예약 참여',
    buttonFont: 'mono',
    buttonSizePx: 13,
    featureAlign: 'left',
    featureFont: 'mono',
    featureTitleSizePx: 13,
    featureDescSizePx: 11,
    feature1Title: 'LIGHTNING FAST',
    feature1Desc: '단축키 하나로 워크플로우를 자동 실행합니다.',
    feature2Title: 'SEAMLESS SYNC',
    feature2Desc: '기기 간 실시간 무제한 동기화를 지원합니다.',
    feature3Title: 'EARLY ACCESS ONLY',
    feature3Desc: '사전예약자 한정 평생 50% 할인 혜택을 드립니다.',
    stories: [
      {
        id: '1',
        title: 'ABOUT HORIZON',
        content: 'Horizon은 문서 작성, 데이터 정제, 스케줄링을 단 몇 초 만에 자율 에이전트에게 위임할 수 있도록 설계된 차세대 생산성 도구입니다.',
      }
    ],
    faq1Q: '정식 출시는 언제인가요?',
    faq1A: '2026년 4분기 중 클로즈드 베타를 시작으로 공식 런칭됩니다.',
    faq2Q: '사전예약 혜택은 어떻게 받나요?',
    faq2A: '사전예약 시 등록한 연락처로 베타 초대권 및 50% 할인 프로모션 코드가 전송됩니다.',
    faq3Q: '',
    faq3A: '',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
  },
};

export default function BuilderPage() {
  const [pageData, setPageData] = useState<PageData>({
    siteId: 'my-shop',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
    backgroundColor: '#ffffff',
    title: '당신의 비즈니스를 한눈에 보여주세요',
    titleColor: '#0f172a',
    titleFont: 'sans',
    titleSizePx: 22,
    subtitle: '코딩 없이 3분 만에 완성하는 나만의 전문 랜딩페이지입니다.',
    subtitleColor: '#475569',
    subtitleFont: 'sans',
    subtitleSizePx: 13,
    featureAlign: 'left',
    featureFont: 'sans',
    featureTitleSizePx: 13,
    featureDescSizePx: 11,
    feature1Title: '빠른 속도',
    feature1Desc: '단 몇 분 만에 사이트가 완성됩니다.',
    feature2Title: '모바일 최적화',
    feature2Desc: '어떤 기기에서도 완벽하게 보입니다.',
    feature3Title: '데이터 실시간 관리',
    feature3Desc: '간편하게 수정하고 배포하세요.',
    stories: [
      {
        id: '1',
        title: '우리 브랜드 이야기',
        content: '고객에게 전달하고 싶은 브랜드 철학과 제품/서비스에 대한 상세한 이야기를 적어보세요.',
      }
    ],
    faq1Q: '주문 후 배송까지 얼마나 걸리나요?',
    faq1A: '결제 완료 후 평일 기준 2~3일 이내에 안전하게 발송됩니다.',
    faq2Q: '교환 및 환불 정책은 어떻게 되나요?',
    faq2A: '수령 후 7일 이내에 문의해 주시면 신속히 처리해 드립니다.',
    faq3Q: '',
    faq3A: '',
    buttonText: '지금 바로 문의하기',
    buttonLink: 'https://google.com',
    primaryColor: '#2563eb',
    buttonFont: 'sans',
    buttonSizePx: 14,
  });

  // 모바일 전용 탭 전환 상태: 'editor' | 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleChange = (key: keyof PageData, value: any) => {
    setPageData((prev) => ({ ...prev, [key]: value }));
  };

  const addStory = () => {
    const newStory: StoryItem = {
      id: Date.now().toString(),
      title: '새로운 소개 섹션',
      content: '내용을 입력하세요.',
    };
    setPageData((prev) => ({ ...prev, stories: [...prev.stories, newStory] }));
  };

  const removeStory = (id: string) => {
    setPageData((prev) => ({
      ...prev,
      stories: prev.stories.filter((item) => item.id !== id),
    }));
  };

  const updateStory = (id: string, field: 'title' | 'content', value: string) => {
    setPageData((prev) => ({
      ...prev,
      stories: prev.stories.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const applyTemplate = (key: string) => {
    const template = TEMPLATES[key];
    if (template) {
      setPageData((prev) => ({ ...prev, ...template }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      handleChange('imageUrl', data.publicUrl);
    } catch (err: any) {
      alert('이미지 업로드 실패: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePublish = async () => {
    if (!pageData.siteId.trim()) {
      alert('사이트 고유 주소(ID)를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from('sites').upsert({
      id: pageData.siteId.trim().toLowerCase(),
      image_url: pageData.imageUrl,
      background_color: pageData.backgroundColor,
      title: pageData.title,
      title_color: pageData.titleColor,
      title_font: pageData.titleFont,
      title_size_px: pageData.titleSizePx,
      subtitle: pageData.subtitle,
      subtitle_color: pageData.subtitleColor,
      subtitle_font: pageData.subtitleFont,
      subtitle_size_px: pageData.subtitleSizePx,
      feature_align: pageData.featureAlign,
      feature_font: pageData.featureFont,
      feature_title_size_px: pageData.featureTitleSizePx,
      feature_desc_size_px: pageData.featureDescSizePx,
      feature1_title: pageData.feature1Title,
      feature1_desc: pageData.feature1Desc,
      feature2_title: pageData.feature2Title,
      feature2_desc: pageData.feature2Desc,
      feature3_title: pageData.feature3Title,
      feature3_desc: pageData.feature3Desc,
      stories: pageData.stories,
      faq1_q: pageData.faq1Q,
      faq1_a: pageData.faq1A,
      faq2_q: pageData.faq2Q,
      faq2_a: pageData.faq2A,
      faq3_q: pageData.faq3Q,
      faq3_a: pageData.faq3A,
      button_text: pageData.buttonText,
      button_link: pageData.buttonLink,
      primary_color: pageData.primaryColor,
      button_font: pageData.buttonFont,
      button_size_px: pageData.buttonSizePx,
    });

    setIsLoading(false);

    if (error) {
      alert('발행 실패: ' + error.message);
    } else {
      const publicUrl = `${window.location.origin}/p/${pageData.siteId.trim().toLowerCase()}`;
      if (confirm(`발행 성공!\n링크: ${publicUrl}\n\n새 창에서 열어보시겠습니까?`)) {
        window.open(publicUrl, '_blank');
      }
    }
  };

  const getFontFamilyClass = (font: string) => {
    if (font === 'serif') return 'font-serif';
    if (font === 'mono') return 'font-mono';
    return 'font-sans';
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-100 overflow-hidden relative font-sans">
      
      {/* 모바일 전용 상단 탭 (화면 전환 바) */}
      <header className="md:hidden flex items-center justify-between p-3 bg-white border-b border-slate-200 z-30 shrink-0">
        <h1 className="text-sm font-extrabold text-slate-800">페이지 빌더</h1>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setMobileTab('editor')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              mobileTab === 'editor' ? 'bg-white shadow text-blue-600' : 'text-slate-500'
            }`}
          >
            편집하기
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition ${
              mobileTab === 'preview' ? 'bg-white shadow text-blue-600' : 'text-slate-500'
            }`}
          >
            미리보기
          </button>
        </div>
      </header>

      {/* 좌측 패널 (모바일에서는 editor 탭일 때만 표시) */}
      <aside className={`w-full md:w-96 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-10 ${
        mobileTab === 'editor' ? 'flex' : 'hidden md:flex'
      }`}>
        <div className="hidden md:block p-4 border-b border-slate-100">
          <h1 className="text-lg font-bold text-slate-800">페이지 에디터</h1>
          <p className="text-xs text-slate-400">내용 수정 후 아래 발행 버튼을 누르세요.</p>
        </div>

        <div className="p-4 md:p-5 overflow-y-auto space-y-6 flex-1 pb-24 md:pb-6">
          {/* 원클릭 템플릿 */}
          <div>
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">원클릭 템플릿 프리셋</h3>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => applyTemplate('market')}
                className="p-2 border border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 rounded-lg text-left transition"
              >
                <div className="text-xs font-bold text-amber-900">공구/마켓</div>
                <div className="text-[10px] text-amber-700 mt-0.5">따뜻한 감성</div>
              </button>
              <button
                onClick={() => applyTemplate('consulting')}
                className="p-2 border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 rounded-lg text-left transition"
              >
                <div className="text-xs font-bold text-blue-900">전문가/상담</div>
                <div className="text-[10px] text-blue-700 mt-0.5">신뢰감 고딕</div>
              </button>
              <button
                onClick={() => applyTemplate('waitlist')}
                className="p-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 rounded-lg text-left transition"
              >
                <div className="text-xs font-bold text-white">사전예약</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">다크 모노</div>
              </button>
            </div>
          </div>

          {/* 기본 설정 */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">기본 설정</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">사이트 고유 주소 (ID)</label>
              <div className="flex items-center text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2">
                <span>/p/</span>
                <input
                  type="text"
                  value={pageData.siteId}
                  onChange={(e) => handleChange('siteId', e.target.value)}
                  className="w-full bg-transparent p-2 text-slate-800 font-medium outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">대표 이미지 첨부</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="block w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mb-2"
              />
              <input
                type="text"
                value={pageData.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="또는 이미지 URL 직접 입력"
                className="w-full text-xs border border-slate-300 rounded-lg p-2 outline-none text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">배경 색상</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={pageData.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-9 h-9 rounded border cursor-pointer"
                />
                <span className="text-xs text-slate-500">{pageData.backgroundColor}</span>
              </div>
            </div>
          </div>

          {/* 메인 제목 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">메인 제목</h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <input
                type="text"
                value={pageData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full text-sm border border-slate-300 rounded p-2 outline-none bg-white font-medium"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">글꼴</label>
                  <select
                    value={pageData.titleFont}
                    onChange={(e) => handleChange('titleFont', e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white outline-none"
                  >
                    <option value="sans">고딕 (Sans)</option>
                    <option value="serif">명조 (Serif)</option>
                    <option value="mono">고정폭 (Mono)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">색상</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="color"
                      value={pageData.titleColor}
                      onChange={(e) => handleChange('titleColor', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500">{pageData.titleColor}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>크기 (px)</span>
                  <input
                    type="number"
                    value={pageData.titleSizePx}
                    onChange={(e) => handleChange('titleSizePx', Number(e.target.value))}
                    className="w-12 text-right border border-slate-300 rounded px-1 text-xs"
                  />
                </div>
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={pageData.titleSizePx}
                  onChange={(e) => handleChange('titleSizePx', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 부제목 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">부제목</h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <textarea
                rows={2}
                value={pageData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full text-xs border border-slate-300 rounded p-2 outline-none bg-white"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">글꼴</label>
                  <select
                    value={pageData.subtitleFont}
                    onChange={(e) => handleChange('subtitleFont', e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white outline-none"
                  >
                    <option value="sans">고딕 (Sans)</option>
                    <option value="serif">명조 (Serif)</option>
                    <option value="mono">고정폭 (Mono)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">색상</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="color"
                      value={pageData.subtitleColor}
                      onChange={(e) => handleChange('subtitleColor', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500">{pageData.subtitleColor}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>크기 (px)</span>
                  <input
                    type="number"
                    value={pageData.subtitleSizePx}
                    onChange={(e) => handleChange('subtitleSizePx', Number(e.target.value))}
                    className="w-12 text-right border border-slate-300 rounded px-1 text-xs"
                  />
                </div>
                <input
                  type="range"
                  min="10"
                  max="24"
                  value={pageData.subtitleSizePx}
                  onChange={(e) => handleChange('subtitleSizePx', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 특징 블록 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">특징 블록</h3>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => handleChange('featureAlign', align)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded ${
                      pageData.featureAlign === align ? 'bg-white shadow text-slate-800' : 'text-slate-400'
                    }`}
                  >
                    {align === 'left' ? '좌' : align === 'center' ? '중' : '우'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex gap-2 text-xs">
                <div className="flex-1">
                  <label className="block text-[11px] text-slate-500 mb-1">글꼴</label>
                  <select
                    value={pageData.featureFont}
                    onChange={(e) => handleChange('featureFont', e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white outline-none"
                  >
                    <option value="sans">고딕 (Sans)</option>
                    <option value="serif">명조 (Serif)</option>
                    <option value="mono">고정폭 (Mono)</option>
                  </select>
                </div>
                <div className="w-20">
                  <label className="block text-[11px] text-slate-500 mb-1">제목(px)</label>
                  <input
                    type="number"
                    value={pageData.featureTitleSizePx}
                    onChange={(e) => handleChange('featureTitleSizePx', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs text-center bg-white"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-[11px] text-slate-500 mb-1">설명(px)</label>
                  <input
                    type="number"
                    value={pageData.featureDescSizePx}
                    onChange={(e) => handleChange('featureDescSizePx', Number(e.target.value))}
                    className="w-full border border-slate-300 rounded p-1.5 text-xs text-center bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="space-y-1 border-t border-slate-200 pt-2">
                    <span className="text-[10px] font-bold text-slate-400">항목 {num}</span>
                    <input
                      type="text"
                      value={(pageData as any)[`feature${num}Title`]}
                      onChange={(e) => handleChange(`feature${num}Title` as any, e.target.value)}
                      placeholder="제목"
                      className="w-full text-xs border border-slate-300 rounded p-2 outline-none bg-white"
                    />
                    <input
                      type="text"
                      value={(pageData as any)[`feature${num}Desc`]}
                      onChange={(e) => handleChange(`feature${num}Desc` as any, e.target.value)}
                      placeholder="설명"
                      className="w-full text-xs border border-slate-300 rounded p-2 outline-none bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 상세 소개 (동적 추가/삭제) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                상세 소개 ({pageData.stories.length}개)
              </h3>
              <button
                type="button"
                onClick={addStory}
                className="text-xs px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-md transition"
              >
                + 섹션 추가
              </button>
            </div>

            <div className="space-y-3">
              {pageData.stories.map((story, index) => (
                <div key={story.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-500">섹션 {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeStory(story.id)}
                      className="text-[11px] text-red-500 hover:underline p-1"
                    >
                      삭제
                    </button>
                  </div>
                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => updateStory(story.id, 'title', e.target.value)}
                    placeholder="소제목"
                    className="w-full text-xs border border-slate-300 rounded p-2 outline-none bg-white font-medium"
                  />
                  <textarea
                    rows={3}
                    value={story.content}
                    onChange={(e) => updateStory(story.id, 'content', e.target.value)}
                    placeholder="상세 내용을 적어주세요."
                    className="w-full text-xs border border-slate-300 rounded p-2 outline-none bg-white leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* FAQ 블록 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">자주 묻는 질문 (FAQ)</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400">Q&A {num}</span>
                  <input
                    type="text"
                    value={(pageData as any)[`faq${num}Q`]}
                    onChange={(e) => handleChange(`faq${num}Q` as any, e.target.value)}
                    placeholder={`질문 ${num}`}
                    className="w-full text-xs border border-slate-300 rounded p-2 outline-none bg-white font-medium"
                  />
                  <textarea
                    rows={2}
                    value={(pageData as any)[`faq${num}A`]}
                    onChange={(e) => handleChange(`faq${num}A` as any, e.target.value)}
                    placeholder={`답변 ${num}`}
                    className="w-full text-xs border border-slate-300 rounded p-2 outline-none bg-white text-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">CTA 버튼 설정</h3>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <input
                type="text"
                value={pageData.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="버튼 문구"
                className="w-full text-sm border border-slate-300 rounded p-2 outline-none bg-white font-medium"
              />
              <input
                type="text"
                value={pageData.buttonLink}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                placeholder="연결 URL (https://...)"
                className="w-full text-xs border border-slate-300 rounded p-2 outline-none bg-white"
              />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">버튼 글꼴</label>
                  <select
                    value={pageData.buttonFont}
                    onChange={(e) => handleChange('buttonFont', e.target.value)}
                    className="w-full border border-slate-300 rounded p-1.5 bg-white outline-none"
                  >
                    <option value="sans">고딕 (Sans)</option>
                    <option value="serif">명조 (Serif)</option>
                    <option value="mono">고정폭 (Mono)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">버튼 색상</label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="color"
                      value={pageData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-500">{pageData.primaryColor}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                  <span>글자 크기 (px)</span>
                  <input
                    type="number"
                    value={pageData.buttonSizePx}
                    onChange={(e) => handleChange('buttonSizePx', Number(e.target.value))}
                    className="w-12 text-right border border-slate-300 rounded px-1 text-xs"
                  />
                </div>
                <input
                  type="range"
                  min="11"
                  max="24"
                  value={pageData.buttonSizePx}
                  onChange={(e) => handleChange('buttonSizePx', Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 하단 고정 발행 버튼 (모바일에서도 항상 하단에 고정) */}
        <div className="p-3 md:p-4 border-t border-slate-100 bg-white md:bg-slate-50 fixed md:relative bottom-0 left-0 w-full z-20">
          <button
            onClick={handlePublish}
            disabled={isLoading || uploadingImage}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            {isLoading ? '저장 중...' : '사이트 발행하기 (Publish)'}
          </button>
        </div>
      </aside>

      {/* 우측 미리보기 (모바일에서는 preview 탭일 때 꽉 차게 렌더링) */}
      <main className={`flex-1 p-3 md:p-12 overflow-y-auto items-center justify-center relative ${
        mobileTab === 'preview' ? 'flex' : 'hidden md:flex'
      }`}>
        <div 
          className="w-full max-w-sm md:max-h-[720px] overflow-y-auto rounded-3xl md:rounded-[36px] shadow-2xl border-2 md:border-4 border-slate-800 flex flex-col justify-start p-4 md:p-6 transition-all duration-200 space-y-6"
          style={{ backgroundColor: pageData.backgroundColor }}
        >
          {pageData.imageUrl && (
            <div className="w-full h-40 md:h-44 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={pageData.imageUrl}
                alt="Main"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
          )}

          {/* 메인 텍스트 */}
          <div className="space-y-2 text-center">
            <h2 
              className={`font-extrabold leading-tight break-keep ${getFontFamilyClass(pageData.titleFont)}`}
              style={{ color: pageData.titleColor, fontSize: `${pageData.titleSizePx}px` }}
            >
              {pageData.title || '제목을 입력하세요'}
            </h2>
            <p 
              className={`break-keep leading-relaxed ${getFontFamilyClass(pageData.subtitleFont)}`}
              style={{ color: pageData.subtitleColor, fontSize: `${pageData.subtitleSizePx}px` }}
            >
              {pageData.subtitle || '부제목을 입력하세요'}
            </p>
          </div>

          {/* 특징 카드 3종 */}
          <div className="space-y-2">
            {[
              { title: pageData.feature1Title, desc: pageData.feature1Desc },
              { title: pageData.feature2Title, desc: pageData.feature2Desc },
              { title: pageData.feature3Title, desc: pageData.feature3Desc },
            ].map((f, i) => f.title && (
              <div 
                key={i} 
                className={`p-3 bg-white/70 backdrop-blur border border-slate-200/60 rounded-xl shadow-xs ${getFontFamilyClass(pageData.featureFont)} ${
                  pageData.featureAlign === 'center' ? 'text-center' : pageData.featureAlign === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                <div className="font-bold text-slate-800" style={{ fontSize: `${pageData.featureTitleSizePx}px` }}>
                  {f.title}
                </div>
                <div className="text-slate-500 mt-0.5" style={{ fontSize: `${pageData.featureDescSizePx}px` }}>
                  {f.desc}
                </div>
              </div>
            ))}
          </div>

          {/* 다중 스토리 미리보기 */}
          {pageData.stories.length > 0 && (
            <div className="space-y-3">
              {pageData.stories.map((story) => (
                <div key={story.id} className="p-3.5 bg-white/50 backdrop-blur rounded-2xl border border-slate-200/50 text-left space-y-1.5">
                  {story.title && (
                    <div className="text-xs font-bold text-slate-900">{story.title}</div>
                  )}
                  <div className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {story.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ 아코디언 미리보기 */}
          {(pageData.faq1Q || pageData.faq2Q) && (
            <div className="space-y-1.5 text-left">
              <div className="text-xs font-bold text-slate-700 mb-1 px-1">자주 묻는 질문</div>
              {[
                { q: pageData.faq1Q, a: pageData.faq1A },
                { q: pageData.faq2Q, a: pageData.faq2A },
                { q: pageData.faq3Q, a: pageData.faq3A },
              ].map((item, idx) => item.q && (
                <div key={idx} className="bg-white/80 border border-slate-200/70 rounded-xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-2.5 text-left flex justify-between items-center text-xs font-semibold text-slate-800"
                  >
                    <span>{item.q}</span>
                    <span className="text-[10px] text-slate-400">{openFaqIndex === idx ? '▲' : '▼'}</span>
                  </button>
                  {openFaqIndex === idx && item.a && (
                    <div className="px-2.5 pb-2.5 text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CTA 버튼 */}
          <div className="pt-2 sticky bottom-0 bg-transparent">
            <a
              href={pageData.buttonLink}
              target="_blank"
              rel="noreferrer"
              style={{ backgroundColor: pageData.primaryColor, fontSize: `${pageData.buttonSizePx}px` }}
              className={`inline-block w-full py-3 px-6 text-white font-bold rounded-xl shadow-md transition text-center ${getFontFamilyClass(pageData.buttonFont)}`}
            >
              {pageData.buttonText || '버튼 문구'}
            </a>
          </div>
        </div>
      </main>

      {/* 우측 하단 플로팅 문의 버튼 (PC 화면에서만 표시) */}
      <a
        href="mailto:contact@mybuilder.com"
        target="_blank"
        rel="noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold transition transform hover:scale-105"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        개발자에게 문의하기
      </a>

    </div>
  );
}