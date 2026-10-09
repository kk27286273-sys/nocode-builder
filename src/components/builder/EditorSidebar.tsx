'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/types/template';

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
  siteId: string | null;
  refreshSites?: () => void;
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export default function EditorSidebar({ data, setData, activeSection, setActiveSection }: EditorSidebarProps) {
  const [uploading, setUploading] = useState(false);

  const updateDeep = (path: string, value: any) => {
    setData(prev => {
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

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 border-r border-slate-200 p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">에디터</h2>
        {uploading && <span className="text-xs text-blue-500 animate-pulse">업로드 중...</span>}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {['corporateInfo', 'solutions', 'disclosure', 'pr', 'recruit', 'cs', 'footer'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-3 py-2 text-xs rounded-md transition-all ${activeSection === section ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            {section === 'corporateInfo' ? '기업 소개' : section === 'solutions' ? '사업 소개' : section === 'disclosure' ? '공시 정보' : section === 'pr' ? '홍보 센터' : section === 'recruit' ? '인재 경영' : section === 'cs' ? '고객 센터' : '하단 정보'}
          </button>
        ))}
      </div>

      {/* 1. 기업 소개 */}
      {activeSection === 'corporateInfo' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">기본 브랜드 정보</span>
            <div>
              <label className="text-[10px] text-slate-400">회사명</label>
              <input type="text" value={data.company.name} onChange={(e) => updateDeep('company.name', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="회사명" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">로고 URL</label>
              <input type="text" value={data.company.logoUrl} onChange={(e) => updateDeep('company.logoUrl', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="https://..." />
            </div>
          </div>

          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">CEO 인사말</span>
            <div>
              <label className="text-[10px] text-slate-400">대표자 성함/직함</label>
              <input type="text" value={data.corporateInfo.ceoGreeting.title} onChange={(e) => updateDeep('corporateInfo.ceoGreeting.title', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="대표이사 OOO" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">인사말 내용</label>
              <textarea value={data.corporateInfo.ceoGreeting.content} onChange={(e) => updateDeep('corporateInfo.ceoGreeting.content', e.target.value)} className="w-full p-2 border rounded text-sm h-32" placeholder="인사말을 입력하세요" />
            </div>
          </div>

          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">미션 및 비전</span>
            <div>
              <label className="text-[10px] text-slate-400">Mission</label>
              <input type="text" value={data.corporateInfo.missionVision.mission} onChange={(e) => updateDeep('corporateInfo.missionVision.mission', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="미션" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Vision</label>
              <input type="text" value={data.corporateInfo.missionVision.vision} onChange={(e) => updateDeep('corporateInfo.missionVision.vision', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="비전" />
            </div>
          </div>
        </div>
      )}

      {/* 2. 사업 소개 (솔루션) */}
      {activeSection === 'solutions' && (
        <div className="space-y-4">
          {(data.solutions || []).map((sol, idx) => (
            <div key={idx} className="p-3 bg-white border rounded-lg space-y-2">
              <input type="text" value={sol.title} onChange={(e) => {
                const next = [...data.solutions];
                next[idx].title = e.target.value;
                setData(prev => ({ ...prev, solutions: next }));
              }} className="w-full p-2 border rounded text-sm font-bold" placeholder="솔루션 제목" />
              <input type="text" value={sol.category} onChange={(e) => {
                const next = [...data.solutions];
                next[idx].category = e.target.value;
                setData(prev => ({ ...prev, solutions: next }));
              }} className="w-full p-2 border rounded text-xs" placeholder="카테고리" />
              <textarea value={sol.description} onChange={(e) => {
                const next = [...data.solutions];
                next[idx].description = e.target.value;
                setData(prev => ({ ...prev, solutions: next }));
              }} className="w-full p-2 border rounded text-xs h-20" placeholder="설명" />
            </div>
          ))}
          <button onClick={() => setData(prev => ({ ...prev, solutions: [...(prev.solutions || []), { title: '신규 솔루션', category: '', description: '', image: '', detailedFeatures: [] }] }))} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 솔루션 추가</button>
        </div>
      )}

      {/* 3. 공시 정보 */}
      {activeSection === 'disclosure' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-4">
            <span className="text-xs font-bold block text-blue-600">인증서 관리</span>
            {(data.corporateInfo.disclosure.certifications || []).map((cert, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-2 border rounded bg-slate-50 mb-2">
                <input type="text" value={cert.name} onChange={(e) => {
                  const next = [...data.corporateInfo.disclosure.certifications];
                  next[idx].name = e.target.value;
                  updateDeep('corporateInfo.disclosure.certifications', next);
                }} className="w-full p-1 border rounded text-[10px]" placeholder="인증서 명칭" />
                <input type="text" value={cert.date} onChange={(e) => {
                  const next = [...data.corporateInfo.disclosure.certifications];
                  next[idx].date = e.target.value;
                  updateDeep('corporateInfo.disclosure.certifications', next);
                }} className="w-full p-1 border rounded text-[10px]" placeholder="취득일자" />
              </div>
            ))}
            <button onClick={() => {
              const next = [...(data.corporateInfo.disclosure.certifications || []), { name: '신규 인증서', image: '', date: '2024-00-00' }];
              updateDeep('corporateInfo.disclosure.certifications', next);
            }} className="text-[10px] text-blue-600 font-bold">+ 인증서 추가</button>
          </div>
        </div>
      )}

      {/* 4. 홍보 센터 */}
      {activeSection === 'pr' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">뉴스/공지사항</span>
            {(data.prCenter.news || []).map((n, idx) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2">
                <input type="text" value={n.title} onChange={(e) => {
                  const next = [...data.prCenter.news];
                  next[idx].title = e.target.value;
                  updateDeep('prCenter.news', next);
                }} className="w-full p-1 border rounded text-xs" placeholder="제목" />
                <input type="text" value={n.date} onChange={(e) => {
                  const next = [...data.prCenter.news];
                  next[idx].date = e.target.value;
                  updateDeep('prCenter.news', next);
                }} className="w-full p-1 border rounded text-xs" placeholder="날짜" />
                <textarea value={n.summary} onChange={(e) => {
                  const next = [...data.prCenter.news];
                  next[idx].summary = e.target.value;
                  updateDeep('prCenter.news', next);
                }} className="w-full p-1 border rounded text-xs h-12" placeholder="요약내용" />
              </div>
            ))}
            <button onClick={() => {
              const next = [...(data.prCenter.news || []), { title: '신규 뉴스', date: '2024-00-00', summary: '', image: '' }];
              updateDeep('prCenter.news', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 뉴스 추가</button>
          </div>
        </div>
      )}

      {/* 5. 인재 경영 */}
      {activeSection === 'recruit' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">채용 정보</span>
            <div>
              <label className="text-[10px] text-slate-400">인재상</label>
              <input type="text" value={data.recruit.talentValue} onChange={(e) => updateDeep('recruit.talentValue', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="인재상" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">복지 혜택</label>
              <textarea value={data.recruit.benefitInfo} onChange={(e) => updateDeep('recruit.benefitInfo', e.target.value)} className="w-full p-2 border rounded text-sm h-24" placeholder="복지 혜택" />
            </div>
          </div>
        </div>
      )}

      {/* 6. 고객 센터 */}
      {activeSection === 'cs' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">문의처 정보</span>
            <div>
              <label className="text-[10px] text-slate-400">가이드 문구</label>
              <textarea value={data.csGuide} onChange={(e) => updateDeep('csGuide', e.target.value)} className="w-full p-2 border rounded text-sm h-20" placeholder="고객에게 보여줄 안내 문구" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">이메일</label>
              <input type="text" value={data.csCenter.contactInfo.email} onChange={(e) => updateDeep('csCenter.contactInfo.email', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="이메일" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">전화번호</label>
              <input type="text" value={data.csCenter.contactInfo.phone} onChange={(e) => updateDeep('csCenter.contactInfo.phone', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="전화번호" />
            </div>
          </div>
        </div>
      )}

      {/* 7. 하단 정보 (Footer) */}
      {activeSection === 'footer' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">푸터 상세 정보</span>
            <div>
              <label className="text-[10px] text-slate-400">회사 주소</label>
              <input type="text" value={data.footer.address} onChange={(e) => updateDeep('footer.address', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="주소" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">대표 이메일</label>
              <input type="text" value={data.footer.contactEmail} onChange={(e) => updateDeep('footer.contactEmail', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="이메일" />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">대표 전화번호</label>
              <input type="text" value={data.supportPhone} onChange={(e) => updateDeep('supportPhone', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="전화번호" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}