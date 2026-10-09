"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";

const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
  <div className="space-y-1">
    <label className="text-[11px] text-slate-500 font-medium">{label}</label>
    <input 
      type={type} 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder = "", h = "h-20" }: any) => (
  <div className="space-y-1">
    <label className="text-[11px] text-slate-500 font-medium">{label}</label>
    <textarea 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-2 border border-slate-200 rounded text-xs ${h} resize-none outline-none focus:ring-1 focus:ring-blue-500 bg-white`}
    />
  </div>
);

interface EditorSidebarProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  siteId?: string | null;
}

export default function EditorSidebar({ data, setData, siteId }: EditorSidebarProps) {
  const [activeSection, setActiveSection] = useState("main");

  const updateDeep = (path: string, value: any) => {
    setData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const removeDeep = (path: string, index: number) => {
    setData((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      const array = current[keys[keys.length - 1]];
      if (Array.isArray(array)) {
        array.splice(index, 1);
      }
      return next;
    });
  };

  const getValue = (path: string) => {
    return path.split('.').reduce((o, i) => (o as any)?.[i], data);
  };

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!siteId) { alert("사이트 ID가 없습니다."); return; }
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

  const sections = [
    { id: "main", label: "메인 화면" },
    { id: "corporateInfo", label: "회사 소개" },
    { id: "solutions", label: "사업 소개" },
    { id: "sustainability", label: "지속가능경영" },
    { id: "pr", label: "홍보 센터" },
    { id: "recruit", label: "인재 경영" },
    { id: "cs", label: "고객 센터" },
    { id: "footer", label: "하단 정보" },
  ];

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">
      <div className="w-48 bg-slate-100 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-black text-slate-800 text-sm italic">NEXIA Builder</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                activeSection === sec.id ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button onClick={handlePublish} className="w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-black transition">
            발행하기
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              {sections.find(s => s.id === activeSection)?.label} 설정
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">ID: {siteId}</span>
          </div>

          {/* 1. 메인 화면: 경로를 'solutionMain'으로 완전히 격리 */}
          {activeSection === "main" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="font-bold text-xs text-blue-600 mb-2">메인 히어로 설정 (최상단)</div>
              <InputField label="메인 배지 (예: BRAND NEW)" value={getValue('solutionMain.badge')} onChange={(v: any) => updateDeep('solutionMain.badge', v)} />
              <InputField label="메인 타이틀" value={getValue('solutionMain.title')} onChange={(v: any) => updateDeep('solutionMain.title', v)} />
              <TextAreaField label="메인 서브 타이틀" value={getValue('solutionMain.description')} onChange={(v: any) => updateDeep('solutionMain.description', v)} h="h-24" />
              <InputField label="CTA 버튼 문구" value={getValue('solutionMain.ctaText')} onChange={(v: any) => updateDeep('solutionMain.ctaText', v)} />
            </div>
          )}

          {/* 2. 회사 소개 */}
          {activeSection === "corporateInfo" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <InputField label="회사명" value={getValue('company.name')} onChange={(v: any) => updateDeep('company.name', v)} />
              <InputField label="로고 URL" value={getValue('company.logoUrl')} onChange={(v: any) => updateDeep('company.logoUrl', v)} />
              <TextAreaField label="회사 소개글" value={getValue('corporateInfo.about')} onChange={(v: any) => updateDeep('corporateInfo.about', v)} h="h-32" />
              <InputField label="핵심 비전" value={getValue('corporateInfo.vision')} onChange={(v: any) => updateDeep('corporateInfo.vision', v)} />
              <InputField label="설립 연도" value={getValue('corporateInfo.since')} onChange={(v: any) => updateDeep('corporateInfo.since', v)} />
            </div>
          )}

          {/* 3. 사업 소개: 경로를 'solutions'로 완전히 격리 및 상세 입력창 추가 */}
          {activeSection === "solutions" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="font-bold text-xs text-blue-600 mb-2">솔루션 섹션 헤더 (메인 하단)</div>
                <InputField label="섹션 제목" value={getValue('solutions.sectionTitle')} onChange={(v: any) => updateDeep('solutions.sectionTitle', v)} />
                <TextAreaField label="섹션 설명" value={getValue('solutions.sectionDesc')} onChange={(v: any) => updateDeep('solutions.sectionDesc', v)} />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xs text-slate-600">솔루션 카드 리스트</div>
                  <button 
                    onClick={() => updateDeep('solutions.list', [...(data.solutions?.list || []), { title: '', description: '', detailContent: '' }])}
                    className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded"
                  >+ 카드 추가</button>
                </div>
                {(data.solutions?.list || []).map((sol: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative group">
                    <button 
                      onClick={() => removeDeep('solutions.list', idx)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 text-xs"
                    >✕</button>
                    <div className="font-bold text-[11px] text-slate-400 mb-1">솔루션 {idx+1} 설정</div>
                    <InputField label="카드 제목" value={getValue(`solutions.list.${idx}.title`)} onChange={(v: any) => updateDeep(`solutions.list.${idx}.title`, v)} />
                    <InputField label="요약 설명 (메인카드 노출)" value={getValue(`solutions.list.${idx}.description`)} onChange={(v: any) => updateDeep(`solutions.list.${idx}.description`, v)} />
                    <div className="pt-2 border-t border-slate-100">
                      <TextAreaField label="상세페이지 내용 (상세뷰어 노출)" value={getValue(`solutions.list.${idx}.detailContent`)} onChange={(v: any) => updateDeep(`solutions.list.${idx}.detailContent`, v)} h="h-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 지속가능경영 */}
          {activeSection === "sustainability" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <TextAreaField label="ESG 경영 메시지" value={getValue('esg.message')} onChange={(v: any) => updateDeep('esg.message', v)} h="h-32" />
              <InputField label="지속가능경영 목표" value={getValue('esg.goal')} onChange={(v: any) => updateDeep('esg.goal', v)} />
            </div>
          )}

          {/* 5. 홍보 센터 */}
          {activeSection === "pr" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <TextAreaField label="홍보 문구 / 보도자료" value={getValue('pr.content')} onChange={(v: any) => updateDeep('pr.content', v)} h="h-40" />
              <InputField label="홍보 이미지 URL" value={getValue('pr.imageUrl')} onChange={(v: any) => updateDeep('pr.imageUrl', v)} />
            </div>
          )}

          {/* 6. 인재 경영 */}
          {activeSection === "recruit" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <TextAreaField label="인재상" value={getValue('hr.talent')} onChange={(v: any) => updateDeep('hr.talent', v)} h="h-32" />
              <TextAreaField label="채용 절차 안내" value={getValue('hr.process')} onChange={(v: any) => updateDeep('hr.process', v)} h="h-32" />
            </div>
          )}

          {/* 7. 고객 센터 */}
          {activeSection === "cs" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <InputField label="고객센터 전화번호" value={getValue('cs.phone')} onChange={(v: any) => updateDeep('cs.phone', v)} />
              <InputField label="이메일" value={getValue('cs.email')} onChange={(v: any) => updateDeep('cs.email', v)} />
              <TextAreaField label="공시 정보 / 공지사항" value={getValue('public.notice')} onChange={(v: any) => updateDeep('public.notice', v)} h="h-32" />
            </div>
          )}

          {/* 8. 하단 정보 */}
          {activeSection === "footer" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <InputField label="사업자 등록번호" value={getValue('footer.bizNumber')} onChange={(v: any) => updateDeep('footer.bizNumber', v)} />
              <InputField label="대표자명" value={getValue('footer.ceoName')} onChange={(v: any) => updateDeep('footer.ceoName', v)} />
              <InputField label="주소" value={getValue('footer.address')} onChange={(v: any) => updateDeep('footer.address', v)} />
              <InputField label="Copyright 문구" value={getValue('footer.copyright')} onChange={(v: any) => updateDeep('footer.copyright', v)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}