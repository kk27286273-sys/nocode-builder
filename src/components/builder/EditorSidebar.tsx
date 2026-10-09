"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface SolutionItem {
  title: string;
  description: string;
  detailContent: string;
}

interface TemplateData {
  company: {
    name: string;
    logoUrl: string;
  };
  solutionMain: {
    title: string;
    description: string;
    detailContent: string;
  };
  solutions: SolutionItem[];
}

export default function EditorSidebar({ 
  data, 
  setData 
}: { 
  data: TemplateData; 
  setData: React.Dispatch<React.SetStateAction<TemplateData>>; 
}) {
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  // 깊은 단계의 데이터 수정 함수
  const updateDeep = (path: string, value: any) => {
    setData((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let current: any = next;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // 리스트 항목 삭제 함수
  const removeDeep = (path: string, index: number) => {
    setData((prev) => {
      const next = { ...prev };
      if (path === 'solutions') {
        next.solutions = prev.solutions.filter((_, i) => i !== index);
      }
      return next;
    });
  };

  // [핵심 수정] 발행 및 저장 함수
  const handlePublish = async () => {
    try {
      // 1. 현재 상태의 데이터 강제 로깅 (디버깅용)
      console.log("🚀 [저장 시도] 현재 전송할 데이터:", data);

      // 2. 빈 데이터 전송 방지
      if (!data || Object.keys(data).length === 0) {
        alert("저장할 내용이 없습니다. 내용을 입력해주세요.");
        return;
      }

      // 3. 사이트 ID 확인
      const siteId = searchParams.get('id');
      if (!siteId) {
        alert("사이트 ID가 주소창에 없습니다. (id=... 확인 필요)");
        return;
      }

      // 4. Supabase 업데이트 실행
      const { error } = await supabase
        .from('sites')
        .update({ 
          data: data, // 객체 그대로 전달 (SDK가 JSON 변환)
          updated_at: new Date().toISOString() 
        })
        .eq('id', siteId);

      if (error) throw error;

      alert("✅ 성공적으로 발행되었습니다! 뷰어에서 확인하세요.");
      console.log("✅ DB 저장 완료");

    } catch (error) {
      console.error("❌ 저장 중 에러 발생:", error);
      alert("발행 중 오류가 발생했습니다. 콘솔창을 확인하세요.");
    }
  };

  return (
    <div className="w-80 h-screen bg-slate-100 border-l overflow-y-auto p-4 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="font-black text-slate-800">Nexia Builder</h2>
        <button 
          onClick={handlePublish} 
          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          발행하기
        </button>
      </div>

      {/* 회사 기본 정보 */}
      <div className="p-3 bg-white border rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">Company Info</div>
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="회사명" 
            value={data.company?.name || ''} 
            onChange={(e) => updateDeep('company.name', e.target.value)}
            className="w-full p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input 
            type="text" 
            placeholder="로고 URL" 
            value={data.company?.logoUrl || ''} 
            onChange={(e) => updateDeep('company.logoUrl', e.target.value)}
            className="w-full p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 상단 대표 정보 (Solution Main) */}
      <div className="p-3 bg-white border rounded-lg space-y-3 shadow-sm">
        <div className="text-[10px] font-bold text-blue-600 uppercase">Page Hero Section</div>
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold">상단 제목</label>
            <input 
              type="text" 
              value={data.solutionMain?.title || ''} 
              onChange={(e) => updateDeep('solutionMain.title', e.target.value)} 
              className="w-full p-2 border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold">메인 요약</label>
            <textarea 
              value={data.solutionMain?.description || ''} 
              onChange={(e) => updateDeep('solutionMain.description', e.target.value)} 
              className="w-full p-2 border rounded text-xs h-12 resize-none outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] text-slate-400 font-bold">상세 내용</label>
            <textarea 
              value={data.solutionMain?.detailContent || ''} 
              onChange={(e) => updateDeep('solutionMain.detailContent', e.target.value)} 
              className="w-full p-2 border rounded text-xs h-20 resize-none outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>
      </div>

      {/* 하단 솔루션 리스트 (Solution Cards) */}
      <div className="p-3 bg-white border rounded-lg space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b pb-2">
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
            <div key={idx} className="p-3 border rounded-lg bg-slate-50 relative group space-y-2">
              <button 
                onClick={() => removeDeep('solutions', idx)} 
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
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
                  next[idx].title = e.target.value;
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border rounded bg-white text-xs outline-none" 
              />
              <input 
                type="text" 
                placeholder="요약" 
                value={sol.description || ''} 
                onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx].description = e.target.value;
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border rounded bg-white text-xs outline-none" 
              />
              <textarea 
                placeholder="상세 내용" 
                value={sol.detailContent || ''} 
                onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx].detailContent = e.target.value;
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border rounded bg-white text-xs h-16 resize-none outline-none" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}