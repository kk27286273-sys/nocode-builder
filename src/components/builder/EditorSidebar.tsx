"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface EditorSidebarProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  siteId?: string | null;
}

export default function EditorSidebar({ data, setData, siteId }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState("company"); // 기본 탭: 회사소개

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

  // 입력 필드 컴포넌트
  const Input = ({ label, path, type = "text", placeholder = "" }) => (
    <div className="space-y-1">
      <label className="text-[11px] text-slate-500 font-medium">{label}</label>
      <input 
        type={type} 
        value={(path.split('.').reduce((o, i) => (o as any)?.[i], data) || '')} 
        onChange={(e) => updateDeep(path, e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      />
    </div>
  );

  const TextArea = ({ label, path, placeholder = "", h = "h-20" }) => (
    <div className="space-y-1">
      <label className="text-[11px] text-slate-500 font-medium">{label}</label>
      <textarea 
        value={(path.split('.').reduce((o, i) => (o as any)?.[i], data) || '')} 
        onChange={(e) => updateDeep(path, e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2 border border-slate-200 rounded text-xs ${h} resize-none outline-none focus:ring-1 focus:ring-blue-500 bg-white`}
      />
    </div>
  );

  // 탭 메뉴 정의
  const tabs = [
    { id: "company", label: "회사소개" },
    { id: "solution", label: "사업소개" },
    { id: "esg", label: "지속가능경영" },
    { id: "pr", label: "홍보센터" },
    { id: "hr", label: "인재경영" },
    { id: "cs", label: "고객센터" },
  ];

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">
      {/* 좌측 탭 네비게이션 */}
      <div className="w-48 bg-slate-100 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-black text-slate-800 text-sm italic">NEXIA Builder</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                activeTab === tab.id 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button onClick={handlePublish} className="w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-black transition">
            발행하기
          </button>
        </div>
      </div>

      {/* 우측 편집 영역 */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{tabs.find(t => t.id === activeTab)?.label} 설정</h3>
            <span className="text-[10px] text-slate-400 font-mono">ID: {siteId}</span>
          </div>

          {/* 탭별 컨텐츠 렌더링 */}
          {activeTab === "company" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <Input label="회사명" path="company.name" />
              <Input label="로고 URL" path="company.logoUrl" />
              <TextArea label="회사 소개글" path="corporateInfo.about" h="h-32" />
              <Input label="핵심 비전" path="corporateInfo.vision" />
              <Input label="설립 연도" path="corporateInfo.since" />
            </div>
          )}

          {activeTab === "solution" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="font-bold text-xs text-blue-600 mb-2">메인 히어로</div>
                <Input label="메인 제목" path="solutionMain.title" />
                <TextArea label="서브 요약" path="solutionMain.description" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xs text-slate-600">솔루션 리스트</div>
                  <button 
                    onClick={() => updateDeep('solutions', [...(data.solutions || []), { title: '', description: '', detailContent: '' }])}
                    className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded"
                  >+ 추가</button>
                </div>
                {(data.solutions || []).map((sol: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative group">
                    <button 
                      onClick={() => {
                        const next = [...(data.solutions || [])];
                        next.splice(idx, 1);
                        updateDeep('solutions', next);
                      }}
                      className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 text-xs"
                    >✕</button>
                    <Input label={`솔루션 ${idx+1} 제목`} path={`solutions.${idx}.title`} />
                    <Input label="요약" path={`solutions.${idx}.description`} />
                    <TextArea label="상세내용" path={`solutions.${idx}.detailContent`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "esg" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <TextArea label="ESG 경영 메시지" path="esg.message" h="h-32" />
              <Input label="지속가능경영 목표" path="esg.goal" />
            </div>
          )}

          {activeTab === "pr" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <TextArea label="홍보 문구 / 보도자료" path="pr.content" h="h-40" />
              <Input label="홍보 이미지 URL" path="pr.imageUrl" />
            </div>
          )}

          {activeTab === "hr" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <TextArea label="인재상" path="hr.talent" h="h-32" />
              <TextArea label="채용 절차 안내" path="hr.process" h="h-32" />
            </div>
          )}

          {activeTab === "cs" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <Input label="고객센터 전화번호" path="cs.phone" />
              <Input label="이메일" path="cs.email" />
              <TextArea label="공시 정보 / 공지사항" path="public.notice" h="h-32" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}