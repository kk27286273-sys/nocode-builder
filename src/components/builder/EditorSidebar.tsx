"use client";

import React from "react";
import { supabase } from "@/lib/supabase/client";

interface EditorSidebarProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  siteId?: string | null;
}

export default function EditorSidebar({ data, setData, siteId }: EditorSidebarProps) {
  
  const updateDeep = (path: string, value: any) => {
    setData((prev: any) => {
      const next = { ...prev };
      const keys = path.split('.');
      let current: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]] || {}) };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!siteId) {
        alert("사이트 ID가 없습니다.");
        return;
      }
      const { error } = await supabase
        .from('sites')
        .update({ data: data, updated_at: new Date().toISOString() })
        .eq('id', siteId);
      if (error) throw error;
      alert("✅ 성공적으로 발행되었습니다!");
    } catch (error: any) {
      alert("발행 실패: " + error.message);
    }
  };

  // 공통 입력 컴포넌트
  const InputField = ({ label, path, type = "text", placeholder = "" }: any) => (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 font-semibold">{label}</label>
      <input 
        type={type} 
        value={(data as any) === undefined ? '' : (path.split('.').reduce((o, i) => (o as any)?.[i], data) || '')} 
        onChange={(e) => updateDeep(path, e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      />
    </div>
  );

  const TextAreaField = ({ label, path, placeholder = "", h = "h-16" }: any) => (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 font-semibold">{label}</label>
      <textarea 
        value={(data as any) === undefined ? '' : (path.split('.').reduce((o, i) => (o as any)?.[i], data) || '')} 
        onChange={(e) => updateDeep(path, e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2 border border-slate-200 rounded text-xs ${h} resize-none outline-none focus:ring-1 focus:ring-blue-500 bg-white`}
      />
    </div>
  );

  const SelectField = ({ label, path, options }: any) => (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 font-semibold">{label}</label>
      <select 
        value={(data as any) === undefined ? '' : (path.split('.').reduce((o, i) => (o as any)?.[i], data) || '')} 
        onChange={(e) => updateDeep(path, e.target.value)}
        className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto p-5 space-y-8 custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-200">
        <div>
          <h2 className="font-black text-slate-900 text-lg leading-none">Nexia Builder</h2>
          <p className="text-[10px] text-slate-400 mt-1">Enterprise Edition v1.2</p>
        </div>
        <button onClick={handlePublish} className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95">
          발행하기
        </button>
      </div>

      {/* 1. Global Style & Brand */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Brand & Global Style</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <InputField label="회사명" path="company.name" />
          <InputField label="로고 이미지 URL" path="company.logoUrl" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="대표 색상 (Hex)" path="style.primaryColor" type="color" />
            <InputField label="포인트 색상 (Hex)" path="style.accentColor" type="color" />
          </div>
          <SelectField 
            label="기본 폰트 스타일" 
            path="style.fontFamily" 
            options={[
              { label: "Pretendard (Modern)", value: "font-pretendard" },
              { label: "Noto Sans (Standard)", value: "font-noto" },
              { label: "Nanum Myeongjo (Classic)", value: "font-nanum" },
            ]} 
          />
        </div>
      </section>

      {/* 2. Hero Section (Solution Main) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Hero Section</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <InputField label="메인 캐치프레이즈" path="solutionMain.title" />
          <TextAreaField label="서브 요약 문구" path="solutionMain.description" h="h-20" />
          <TextAreaField label="상세 설명 (본문)" path="solutionMain.detailContent" h="h-32" />
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="텍스트 정렬" path="solutionMain.align" options={[
              { label: "왼쪽", value: "left" }, { label: "중앙", value: "center" }, { label: "오른쪽", value: "right" }
            ]} />
            <SelectField label="배경 타입" path="solutionMain.bgType" options={[
              { label: "단색", value: "solid" }, { label: "그라데이션", value: "gradient" }, { label: "이미지", value: "image" }
            ]} />
          </div>
        </div>
      </section>

      {/* 3. Corporate Identity */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Corporate Identity</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <TextAreaField label="회사 소개글" path="corporateInfo.about" h="h-32" />
          <InputField label="핵심 비전" path="corporateInfo.vision" />
          <InputField label="설립 연도" path="corporateInfo.since" placeholder="예: 1990" />
          <InputField label="업력/성과 수치" path="corporateInfo.achievement" placeholder="예: 2,850건" />
        </div>
      </section>

      {/* 4. HR & ESG Management */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider">HR & ESG</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <TextAreaField label="인재상 / 채용 철학" path="hr.talent" h="h-24" />
          <TextAreaField label="ESG 경영 메시지" path="esg.message" h="h-24" />
          <InputField label="지속가능경영 목표" path="esg.goal" />
        </div>
      </section>

      {/* 5. Customer Support & Disclosure */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="w-1 h-4 bg-blue-600 rounded-full" />
          <h3 className="text-xs font-bold uppercase tracking-wider">CS & Disclosure</h3>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
          <InputField label="대표 전화번호" path="cs.phone" />
          <InputField label="대표 이메일" path="cs.email" />
          <InputField label="사업자 등록번호" path="public.bizNumber" />
          <TextAreaField label="최신 공시/안내 사항" path="public.notice" h="h-24" />
        </div>
      </section>

      {/* 6. Solution Card Manager */}
      <section className="space-y-4 pb-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-1 h-4 bg-blue-600 rounded-full" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Solution Cards</h3>
          </div>
          <button 
            onClick={() => {
              const current = data.solutions || [];
              updateDeep('solutions', [...current, { title: '', description: '', detailContent: '', icon: '', color: '#3b82f6' }]);
            }} 
            className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition shadow-sm"
          >
            + 카드 추가
          </button>
        </div>
        <div className="space-y-4">
          {(data.solutions || []).map((sol: any, idx: number) => (
            <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-white relative group shadow-sm space-y-4">
              <button 
                onClick={() => {
                  const next = [...(data.solutions || [])];
                  next.splice(idx, 1);
                  updateDeep('solutions', next);
                }} 
                className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center shadow-lg hover:bg-rose-600 transition"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded">CARD {idx + 1}</span>
              </div>
              <InputField label="솔루션 제목" path={`solutions.${idx}.title`} />
              <InputField label="요약 문구" path={`solutions.${idx}.description`} />
              <TextAreaField label="상세 설명" path={`solutions.${idx}.detailContent`} h="h-20" />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="아이콘 URL" path={`solutions.${idx}.icon`} />
                <InputField label="카드 포인트 색상" path={`solutions.${idx}.color`} type="color" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}