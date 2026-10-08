'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/types/template';
import { supabase } from '@/lib/supabase/client';
import { compressImage } from '@/utils/compressImage';

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
  siteId: string | null;
  refreshSites?: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export default function EditorSidebar({ data, setData, siteId, refreshSites, activeSection, setActiveSection }: EditorSidebarProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number, section?: string) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const compressed = await compressImage(file);
      const fileName = `${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('template-images')
        .upload(fileName, compressed);

      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('template-images').getPublicUrl(fileName);

      if (section === 'corporateInfo') {
        setData(prev => {
          const updated = { ...prev };
          if (section === 'corporateInfo' && index !== undefined) {
            // 동적 필드 업데이트 로직 (인증서, 보고서 등)
            const fieldKey = field as keyof any;
            const target = updated.corporateInfo?.disclosure?.[fieldKey] || [];
            const next = [...target];
            next[index] = { ...next[index], image: publicUrl };
            updated.corporateInfo = { 
              ...updated.corporateInfo, 
              disclosure: { ...updated.corporateInfo?.disclosure, [fieldKey]: next } 
            };
          }
          return updated;
        });
      } else {
        setData(prev => ({ ...prev, [field]: publicUrl }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('이미지 업로드 실패');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 border-r border-slate-200 p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">에디터</h2>
        {uploading && <span className="text-xs text-blue-500 animate-pulse">업로드 중...</span>}
      </div>

      {/* 섹션 탭 */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {['basic', 'corporateInfo', 'solutions', 'disclosure', 'pr', 'recruit', 'cs'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-3 py-2 text-xs rounded-md transition-all ${activeSection === section ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            {section === 'basic' ? '기본 정보' : section === 'corporateInfo' ? '기업 소개' : section === 'solutions' ? '솔루션' : section === 'disclosure' ? '공시정보' : section === 'pr' ? '홍보센터' : section === 'recruit' ? '인재경영' : '고객센터'}
          </button>
        ))}
      </div>

      {/* 기본 정보 섹션 */}
      {activeSection === 'basic' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block">사이트 기본 설정</span>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">사이트 제목</label>
              <input type="text" value={data.basicInfo.siteTitle} onChange={(e) => setData(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, siteTitle: e.target.value } }))} className="w-full p-2 border rounded text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">대표 색상</label>
              <input type="color" value={data.basicInfo.mainColor} onChange={(e) => setData(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, mainColor: e.target.value } }))} className="w-full h-8 p-1 border rounded" />
            </div>
          </div>
        </div>
      )}

      {/* 기업 소개 섹션 */}
      {activeSection === 'corporateInfo' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block">회사 기본 정보</span>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">회사명</label>
              <input type="text" value={data.corporateInfo.companyName} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, companyName: e.target.value } }))} className="w-full p-2 border rounded text-sm" />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">CEO 인사말</label>
              <textarea value={data.corporateInfo.ceoMessage} onChange={(e) => setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, ceoMessage: e.target.value } }))} className="w-full p-2 border rounded text-sm h-24" />
            </div>
          </div>
        </div>
      )}

      {/* 솔루션 섹션 */}
      {activeSection === 'solutions' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block">솔루션 목록 관리</span>
            {(data.solutions || []).map((sol, idx) => (
              <div key={idx} className="p-2 border rounded-md bg-slate-50 space-y-2 mb-2">
                <input type="text" value={sol.title} onChange={(e) => {
                  const next = [...data.solutions];
                  next[idx].title = e.target.value;
                  setData(prev => ({ ...prev, solutions: next }));
                }} className="w-full p-1 border rounded text-xs" placeholder="솔루션 제목" />
                <input type="text" value={sol.category} onChange={(e) => {
                  const next = [...data.solutions];
                  next[idx].category = e.target.value;
                  setData(prev => ({ ...prev, solutions: next }));
                }} className="w-full p-1 border rounded text-xs" placeholder="카테고리" />
                <textarea value={sol.description} onChange={(e) => {
                  const next = [...data.solutions];
                  next[idx].description = e.target.value;
                  setData(prev => ({ ...prev, solutions: next }));
                }} className="w-full p-1 border rounded text-xs h-16" placeholder="상세 설명" />
              </div>
            ))}
            <button onClick={() => setData(prev => ({ ...prev, solutions: [...(prev.solutions || []), { title: '신규 솔루션', category: '분류', description: '설명을 입력하세요', image: '', detailedFeatures: [] }] }))} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold hover:bg-blue-100 transition-colors">+ 솔루션 추가</button>
          </div>
        </div>
      )}

      {/* 공시정보 섹션 (에러 발생 지점 집중 수정) */}
      {activeSection === 'disclosure' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-4">
            <span className="text-xs font-bold block">공시정보 관리</span>
            
            {/* 인증서 관리 */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block">인증서 관리</span>
              {(data.corporateInfo?.disclosure?.certifications || []).map((cert, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={cert.name} onChange={(e) => {
                    const next = [...data.corporateInfo.disclosure.certifications];
                    next[idx].name = e.target.value;
                    setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, certifications: next } } }));
                  }} className="flex-1 p-1 border rounded text-[10px]" />
                  <input type="text" value={cert.date} onChange={(e) => {
                    const next = [...data.corporateInfo.disclosure.certifications];
                    next[idx].date = e.target.value;
                    setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, certifications: next } } }));
                  }} className="w-20 p-1 border rounded text-[10px]" />
                </div>
              ))}
              <button onClick={() => {
                const current = data.corporateInfo?.disclosure?.certifications || [];
                setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo?.disclosure, certifications: [...current, { name: '신규 인증서', image: '', date: '2024-00-00' }] } } }));
              }} className="text-[10px] text-blue-600 font-bold">+ 인증서 추가</button>
            </div>

            {/* 보고서 관리 */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block">보고서 관리</span>
              {(data.corporateInfo?.disclosure?.reports || []).map((rep, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={rep.title} onChange={(e) => {
                    const next = [...data.corporateInfo.disclosure.reports];
                    next[idx].title = e.target.value;
                    setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, reports: next } } }));
                  }} className="flex-1 p-1 border rounded text-[10px]" />
                  <input type="text" value={rep.date} onChange={(e) => {
                    const next = [...data.corporateInfo.disclosure.reports];
                    next[idx].date = e.target.value;
                    setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo.disclosure, reports: next } } }));
                  }} className="w-20 p-1 border rounded text-[10px]" />
                </div>
              ))}
              <button onClick={() => {
                const current = data.corporateInfo?.disclosure?.reports || [];
                setData(prev => ({ ...prev, corporateInfo: { ...prev.corporateInfo, disclosure: { ...prev.corporateInfo?.disclosure, reports: [...current, { title: '신규 보고서', date: '2024-00-00', link: '' }] } } }));
              }} className="text-[10px] text-blue-600 font-bold">+ 보고서 추가</button>
            </div>
          </div>
        </div>
      )}

      {/* 홍보센터, 인재경영, 고객센터 (기본 틀만 제공) */}
      {(activeSection === 'pr' || activeSection === 'recruit' || activeSection === 'cs') && (
        <div className="p-8 bg-white border rounded-lg text-center text-slate-400 text-xs">
          해당 섹션의 상세 에디터가 준비 중입니다.
        </div>
      )}
    </div>
  );
}