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

  // 섹션별 렌더링 헬퍼
  const renderInput = (label: string, path: string, placeholder: string) => (
    <div className="space-y-1">
      <label className="text-[9px] text-slate-400 font-bold">{label}</label>
      <input 
        type="text" 
        value={(data as any) === undefined ? '' : (path.split('.').reduce((o, i) => (o as any)?.[i], data) || '')} 
        onChange={(e) => updateDeep(path, e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );

  const renderTextarea = (label: string, path: string, placeholder: string, h = "h-12") => (
    <div className="space-y-1">
      <label className="text-[9px] text-slate-400 font-bold">{label}</label>
      <textarea 
        value={(data as any) === undefined ? '' : (path.split('.').reduce((o, i) => (o as any)?.[i], data) || '')} 
        onChange={(e) => updateDeep(path, e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2 border border-slate-200 rounded text-xs ${h} resize-none outline-none focus:ring-1 focus:ring-blue-500`}
      />
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-100 overflow-y-auto p-4 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h2 className="font-black text-slate-800 text-sm">Nexia Full Builder</h2>
        <button onClick={handlePublish} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-sm">
          발행하기
        </button>
      </div>

      {/* 1. 기본 회사 정보 */}
      <section className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">Basic Info</div>
        {renderInput("회사명", "company.name", "회사명 입력")}
        {renderInput("로고 URL", "company.logoUrl", "로고 이미지 주소")}
      </section>

      {/* 2. 메인 히어로 (솔루션 메인) */}
      <section className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">Hero Section</div>
        {renderInput("메인 제목", "solutionMain.title", "메인 제목")}
        {renderTextarea("메인 요약", "solutionMain.description", "메인 요약", "h-14")}
        {renderTextarea("상세 내용", "solutionMain.detailContent", "상세 내용", "h-20")}
      </section>

      {/* 3. 기업 소개 / 비전 / 연혁 (Corporate) */}
      <section className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">Corporate Info</div>
        {renderTextarea("회사 소개", "corporateInfo.about", "회사 소개글")}
        {renderInput("비전", "corporateInfo.vision", "기업 비전")}
        {renderInput("설립연도", "corporateInfo.since", "Since 1990")}
      </section>

      {/* 4. 인재 경영 / 지속가능경영 (HR & ESG) */}
      <section className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">HR & ESG</div>
        {renderTextarea("인재상", "hr.talent", "원하는 인재상", "h-20")}
        {renderTextarea("지속가능경영", "esg.message", "ESG 경영 메시지", "h-20")}
      </section>

      {/* 5. 고객센터 / 공시정보 (CS & Public) */}
      <section className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">CS & Disclosure</div>
        {renderInput("고객센터 전화번호", "cs.phone", "02-xxx-xxxx")}
        {renderInput("이메일", "cs.email", "contact@company.com")}
        {renderTextarea("공시 정보", "public.notice", "최신 공시 내용", "h-20")}
      </section>

      {/* 6. 솔루션 카드 리스트 (Dynamic) */}
      <section className="p-3 bg-white border border-slate-200 rounded-lg space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div className="text-[10px] font-bold text-blue-600 uppercase">Solution Cards</div>
          <button 
            onClick={() => {
              const current = data.solutions || [];
              updateDeep('solutions', [...current, { title: '', description: '', detailContent: '' }]);
            }} 
            className="px-2 py-1 text-[10px] bg-blue-600 text-white rounded font-bold"
          >
            + 추가
          </button>
        </div>
        <div className="space-y-4">
          {(data.solutions || []).map((sol: any, idx: number) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50 relative group space-y-2">
              <button 
                onClick={() => {
                  const next = [...(data.solutions || [])];
                  next.splice(idx, 1);
                  updateDeep('solutions', next);
                }} 
                className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center shadow"
              >
                ✕
              </button>
              <div className="text-[10px] font-bold text-slate-400">솔루션 {idx + 1}</div>
              {renderInput("제목", `solutions.${idx}.title`, "제목")}
              {renderInput("요약", `solutions.${idx}.description`, "요약")}
              {renderTextarea("상세 내용", `solutions.${idx}.detailContent`, "상세 내용", "h-16")}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}