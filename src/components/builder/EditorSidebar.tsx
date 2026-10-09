"use client";

import React from "react";
import { supabase } from "@/lib/supabase/client";

interface SolutionItem {
  title: string;
  description: string;
  detailContent: string;
}

interface TemplateData {
  company?: {
    name: string;
    logoUrl: string;
  };
  solutionMain?: {
    title: string;
    description: string;
    detailContent: string;
  };
  solutions?: SolutionItem[];
  [key: string]: any;
}

interface EditorSidebarProps {
  data: TemplateData;
  setData: React.Dispatch<React.SetStateAction<any>>;
  siteId?: string | null;
  refreshSites?: () => void;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

export default function EditorSidebar({ 
  data, 
  setData,
  siteId
}: EditorSidebarProps) {

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

  const removeDeep = (path: string, index: number) => {
    setData((prev: any) => {
      const next = { ...prev };
      if (path === 'solutions' && Array.isArray(next.solutions)) {
        next.solutions = next.solutions.filter((_: any, i: number) => i !== index);
      }
      return next;
    });
  };

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      if (!siteId) {
        alert("선택된 사이트 ID가 없습니다. 상단에서 사이트를 선택해주세요.");
        return;
      }

      if (!data || Object.keys(data).length === 0) {
        alert("저장할 내용이 없습니다.");
        return;
      }

      console.log("🚀 [저장 시도] 전송 데이터:", data);

      const { error } = await supabase
        .from('sites')
        .update({ 
          data: data,
          updated_at: new Date().toISOString() 
        })
        .eq('id', siteId);

      if (error) throw error;

      alert("✅ 성공적으로 발행되었습니다!");
    } catch (error: any) {
      console.error("❌ 저장 에러:", error);
      alert("발행 실패: " + (error.message || "오류가 발생했습니다."));
    }
  };

  return (
    <div className="w-full h-full bg-slate-100 overflow-y-auto p-4 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <h2 className="font-black text-slate-800 text-sm">Nexia Builder</h2>
        <button 
          type="button" 
          onClick={handlePublish} 
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          발행하기
        </button>
      </div>

      {/* 회사 정보 */}
      <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">Company Info</div>
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="회사명" 
            value={data.company?.name || ''} 
            onChange={(e) => updateDeep('company.name', e.target.value)}
            className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input 
            type="text" 
            placeholder="로고 URL" 
            value={data.company?.logoUrl || ''} 
            onChange={(e) => updateDeep('company.logoUrl', e.target.value)}
            className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 메인 히어로 섹션 */}
      <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">Page Hero Section</div>
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold">상단 제목</label>
            <input 
              type="text" 
              value={data.solutionMain?.title || ''} 
              onChange={(e) => updateDeep('solutionMain.title', e.target.value)} 
              className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold">메인 요약</label>
            <textarea 
              value={data.solutionMain?.description || ''} 
              onChange={(e) => updateDeep('solutionMain.description', e.target.value)} 
              className="w-full p-2 border border-slate-200 rounded text-xs h-14 resize-none outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold">상세 내용</label>
            <textarea 
              value={data.solutionMain?.detailContent || ''} 
              onChange={(e) => updateDeep('solutionMain.detailContent', e.target.value)} 
              className="w-full p-2 border border-slate-200 rounded text-xs h-20 resize-none outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>
      </div>

      {/* 솔루션 카드 섹션 */}
      <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div className="text-[10px] font-bold text-blue-600 uppercase">Solution Cards</div>
          <button 
            type="button"
            onClick={() => {
              const current = data.solutions || [];
              updateDeep('solutions', [...current, { title: '', description: '', detailContent: '' }]);
            }} 
            className="px-2 py-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition"
          >
            + 추가
          </button>
        </div>
        
        <div className="space-y-4">
          {(data.solutions || []).map((sol: any, idx: number) => (
            <div key={idx} className="p-3 border border-slate-200 rounded-lg bg-slate-50 relative group space-y-2">
              <button 
                type="button"
                onClick={() => removeDeep('solutions', idx)} 
                className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] opacity-80 hover:opacity-100 transition flex items-center justify-center shadow"
              >
                ✕
              </button>
              <div className="text-[10px] font-bold text-slate-400">솔루션 {idx + 1}</div>
              <input 
                type="text" 
                placeholder="제목" 
                value={sol.title || ''} 
                onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx] = { ...next[idx], title: e.target.value };
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border border-slate-200 rounded bg-white text-xs outline-none focus:ring-1 focus:ring-blue-500" 
              />
              <input 
                type="text" 
                placeholder="요약" 
                value={sol.description || ''} 
                onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx] = { ...next[idx], description: e.target.value };
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border border-slate-200 rounded bg-white text-xs outline-none focus:ring-1 focus:ring-blue-500" 
              />
              <textarea 
                placeholder="상세 내용" 
                value={sol.detailContent || ''} 
                onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx] = { ...next[idx], detailContent: e.target.value };
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border border-slate-200 rounded bg-white text-xs h-16 resize-none outline-none focus:ring-1 focus:ring-blue-500" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}