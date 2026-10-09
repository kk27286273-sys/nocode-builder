'use client';

import React from 'react';
import { B2BTemplateData } from '@/types/template';

interface EditorSidebarProps {
  data: B2BTemplateData;
  setData: React.Dispatch<React.SetStateAction<B2BTemplateData>>;
  activeSection: string;
  setActiveSection: (section: any) => void;
}

export default function EditorSidebar({ data, setData, activeSection, setActiveSection }: EditorSidebarProps) {
  const updateDeep = (path: string, value: any) => {
    setData(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let current: any = next;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // 대상이 배열이면 배열로 복제, 객체면 객체로 복제
        current[key] = Array.isArray(current[key]) 
          ? [...current[key]] 
          : { ...current[key] };
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const removeDeep = (path: string, index: number) => {
    setData(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let current: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      const array = current[keys[keys.length - 1]];
      if (Array.isArray(array)) {
        array.splice(index, 1);
      }
      return next;
    });
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'main': return '메인 화면';
      case 'corporateInfo': return '회사 소개';
      case 'solutions': return '사업 소개';
      case 'sustainability': return '지속가능경영';
      case 'pr': return '홍보 센터';
      case 'recruit': return '인재 경영';
      case 'cs': return '고객 센터';
      case 'footer': return '하단 정보';
      default: return section;
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 border-r border-slate-200 p-4 space-y-6">
      <div className="grid grid-cols-2 gap-2 mb-6">
        {['main', 'corporateInfo', 'solutions', 'sustainability', 'pr', 'recruit', 'cs', 'footer'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-3 py-2 text-xs rounded-md transition-all ${activeSection === section ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            {getSectionLabel(section)}
          </button>
        ))}
      </div>

      {/* 0. 메인 화면 */}
      {activeSection === 'main' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">히어로 섹션</span>
            <label className="text-[10px] text-slate-400">배지 문구</label>
            <input type="text" value={data.hero?.badge || ''} onChange={(e) => updateDeep('hero.badge', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <label className="text-[10px] text-slate-400">메인 타이틀</label>
            <input type="text" value={data.hero?.title || ''} onChange={(e) => updateDeep('hero.title', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <label className="text-[10px] text-slate-400">서브 타이틀</label>
            <textarea value={data.hero?.subtitle || ''} onChange={(e) => updateDeep('hero.subtitle', e.target.value)} className="w-full p-2 border rounded text-sm h-20" />
          </div>

          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">메인 솔루션 요약</span>
            {(data.solutions || []).map((sol: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('solutions', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <div className="text-[10px] font-bold text-slate-500">솔루션 0{idx + 1}</div>
                <input type="text" value={sol.title || ''} onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx].title = e.target.value;
                  updateDeep('solutions', next);
                }} className="w-full p-1 border rounded text-xs font-bold" placeholder="솔루션 제목" />
                <textarea value={sol.description || ''} onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx].description = e.target.value;
                  updateDeep('solutions', next);
                }} className="w-full p-1 border rounded text-xs h-12" placeholder="요약 설명" />
              </div>
            ))}
            <button onClick={() => {
              const current = data.solutions || [];
              const next = [...current, { title: '신규 솔루션', description: '상세 설명을 입력하세요' }];
              updateDeep('solutions', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 솔루션 추가</button>
          </div>
        </div>
      )}

      {/* 1. 회사 소개 */}
      {activeSection === 'corporateInfo' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">기본 설정</span>
            <label className="text-[10px] text-slate-400">로고 URL</label>
            <input type="text" value={data.company?.logoUrl || ''} onChange={(e) => updateDeep('company.logoUrl', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <label className="text-[10px] text-slate-400">회사명</label>
            <input type="text" value={data.company?.name || ''} onChange={(e) => updateDeep('company.name', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">메인 헤드라인</span>
            <input type="text" value={(data as any).corporateInfo?.intro?.mainTitle || ''} onChange={(e) => updateDeep('corporateInfo.intro.mainTitle', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="메인 제목" />
            <input type="text" value={(data as any).corporateInfo?.intro?.subTitle || ''} onChange={(e) => updateDeep('corporateInfo.intro.subTitle', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="서브 제목" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">미션 & 비전</span>
            <input type="text" value={(data as any).corporateInfo?.missionVision?.mission || ''} onChange={(e) => updateDeep('corporateInfo.missionVision.mission', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="미션 입력" />
            <input type="text" value={(data as any).corporateInfo?.missionVision?.vision || ''} onChange={(e) => updateDeep('corporateInfo.missionVision.vision', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="비전 입력" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">CEO 정보</span>
            <input type="text" value={(data as any).corporateInfo?.ceo?.title || ''} onChange={(e) => updateDeep('corporateInfo.ceo.title', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <textarea value={data.corporateInfo?.ceoGreeting?.content || ''} onChange={(e) => updateDeep('corporateInfo.ceoGreeting.content', e.target.value)} className="w-full p-2 border rounded text-sm h-24" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">연혁 관리</span>
            {((data as any).corporateInfo?.aboutUs?.history || []).map((item: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('corporateInfo.aboutUs.history', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <input type="text" value={item.year} onChange={(e) => {
                  const next = [...((data as any).corporateInfo.aboutUs.history)];
                  next[idx].year = e.target.value;
                  updateDeep('corporateInfo.aboutUs.history', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <input type="text" value={item.event} onChange={(e) => {
                  const next = [...((data as any).corporateInfo.aboutUs.history)];
                  next[idx].event = e.target.value;
                  updateDeep('corporateInfo.aboutUs.history', next);
                }} className="w-full p-1 border rounded text-xs" />
              </div>
            ))}
            <button onClick={() => {
              const current = (data as any).corporateInfo?.aboutUs?.history || [];
              const next = [...current, { year: '2024', event: '새로운 연혁' }];
              updateDeep('corporateInfo.aboutUs.history', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 연혁 추가</button>
          </div>
        </div>
      )}

      {/* 2. 사업 소개 (SolutionPage 매칭) */}
{activeSection === 'solutions' && (
  <div className="space-y-6">
    {/* [PART 1] 상단 대표 정보 (단일) */}
    <div className="p-3 bg-white border rounded-lg space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b pb-2">
        <span className="text-xs font-bold text-blue-600">📌 페이지 대표 정보</span>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase">상단 제목</label>
          <input 
            type="text" 
            value={data.solutionMain?.title || ''} 
            onChange={(e) => updateDeep('solutionMain.title', e.target.value)} 
            className="w-full p-2 border rounded bg-white text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" 
            placeholder="예: B2B 기업·제조업 전용 웹" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase">메인화면 요약</label>
          <textarea 
            value={data.solutionMain?.description || ''} 
            onChange={(e) => updateDeep('solutionMain.description', e.target.value)} 
            className="w-full p-2 border rounded bg-white text-xs h-12 resize-none outline-none focus:ring-1 focus:ring-blue-500" 
            placeholder="예: Solution Detail" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-500 uppercase">상세페이지 내용</label>
          <textarea 
            value={data.solutionMain?.detailContent || ''} 
            onChange={(e) => updateDeep('solutionMain.detailContent', e.target.value)} 
            className="w-full p-2 border rounded bg-white text-xs h-20 resize-none outline-none focus:ring-1 focus:ring-blue-500" 
            placeholder="예: 거래처 미팅 전 회사소개서 대신 전달하는..." 
          />
        </div>
      </div>
    </div>

    {/* [PART 2] 하단 상세 소개 (리스트) */}
    <div className="p-3 bg-white border rounded-lg space-y-4 shadow-sm">
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-xs font-bold text-blue-600">📦 상세 소개 (카드 리스트)</span>
        <button 
          onClick={() => {
            const current = data.solutions || [];
            updateDeep('solutions', [...current, { title: '', description: '', detailContent: '' }]);
          }} 
          className="px-2 py-1 text-[10px] bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
        >
          + 항목 추가
        </button>
      </div>
      
      <div className="space-y-4">
        {(data.solutions || []).map((sol: any, idx: number) => (
          <div key={idx} className="p-3 border rounded-lg bg-slate-50 relative group space-y-3">
            <button 
              onClick={() => removeDeep('solutions', idx)} 
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
            <div className="text-[10px] font-bold text-slate-400 mb-1">솔루션 {idx + 1}</div>
            <div className="space-y-2">
              <input 
                type="text" 
                value={sol.title || ''} 
                onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx].title = e.target.value;
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border rounded bg-white text-xs outline-none" 
                placeholder="제목" 
              />
              <input 
                type="text" 
                value={sol.description || ''} 
                onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx].description = e.target.value;
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border rounded bg-white text-xs outline-none" 
                placeholder="요약" 
              />
              <textarea 
                value={sol.detailContent || ''} 
                onChange={(e) => {
                  const next = [...(data.solutions || [])];
                  next[idx].detailContent = e.target.value;
                  updateDeep('solutions', next);
                }} 
                className="w-full p-2 border rounded bg-white text-xs h-16 resize-none outline-none" 
                placeholder="내용" 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      {/* 3. 지속가능경영 (ESG) */}
      {activeSection === 'sustainability' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-4">
            <span className="text-xs font-bold block text-green-600">ESG 경영 관리</span>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500">메인 타이틀</label>
              <input 
                type="text" 
                value={(data.esgData || {}).mainTitle || ''} 
                onChange={(e) => updateDeep('esgData', { ...(data.esgData || {}), mainTitle: e.target.value })} 
                className="w-full p-2 border rounded text-xs" 
                placeholder="예: 함께 성장하는 지속가능한 미래" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500">메인 설명</label>
              <textarea 
                value={(data.esgData || {}).mainDesc || ''} 
                onChange={(e) => updateDeep('esgData', { ...(data.esgData || {}), mainDesc: e.target.value })} 
                className="w-full p-2 border rounded text-xs h-16" 
                placeholder="ESG 경영의 핵심 가치를 입력하세요" 
              />
            </div>

            <hr className="my-4" />

            {/* E, S, G 개별 항목 */}
            {['environmental', 'social', 'governance'].map((key) => (
              <div key={key} className="p-3 bg-slate-50 rounded-lg space-y-2 border">
                <label className="text-[11px] font-bold text-slate-700 uppercase">
                  {key === 'environmental' ? 'Environmental (환경)' : key === 'social' ? 'Social (사회)' : 'Governance (지배구조)'}
                </label>
                <textarea 
                  value={(data.esgData || {})[key] || ''} 
                  onChange={(e) => updateDeep('esgData', { ...(data.esgData || {}), [key]: e.target.value })} 
                  className="w-full p-2 border rounded text-xs h-24" 
                  placeholder={`${key} 영역의 활동 내용을 입력하세요`} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 홍보 센터 (PR) */}
      {activeSection === 'pr' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">최신 뉴스</span>
            {((data as any).prData?.news || []).map((n: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('prData.news', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <input type="text" value={n.title} onChange={(e) => {
                  const next = [...((data as any).prData.news)];
                  next[idx].title = e.target.value;
                  updateDeep('prData.news', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <input type="text" value={n.date} onChange={(e) => {
                  const next = [...((data as any).prData.news)];
                  next[idx].date = e.target.value;
                  updateDeep('prData.news', next);
                }} className="w-full p-1 border rounded text-xs" />
                <textarea value={n.summary} onChange={(e) => {
                  const next = [...((data as any).prData.news)];
                  next[idx].summary = e.target.value;
                  updateDeep('prData.news', next);
                }} className="w-full p-1 border rounded text-xs h-12" />
                <input type="text" value={n.image} onChange={(e) => {
                  const next = [...((data as any).prData.news)];
                  next[idx].image = e.target.value;
                  updateDeep('prData.news', next);
                }} className="w-full p-1 border rounded text-xs" placeholder="이미지 URL" />
              </div>
            ))}
            <button onClick={() => {
              const current = (data as any).prData?.news || [];
              const next = [...current, { title: '신규 뉴스', date: '2024-00-00', summary: '', image: '' }];
              updateDeep('prData.news', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 뉴스 추가</button>
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">공지사항</span>
            {((data as any).prData?.notice || []).map((item: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('prData.notice', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <input type="text" value={item.title} onChange={(e) => {
                  const next = [...((data as any).prData.notice)];
                  next[idx].title = e.target.value;
                  updateDeep('prData.notice', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <input type="text" value={item.date} onChange={(e) => {
                  const next = [...((data as any).prData.notice)];
                  next[idx].date = e.target.value;
                  updateDeep('prData.notice', next);
                }} className="w-full p-1 border rounded text-xs" />
              </div>
            ))}
            <button onClick={() => {
              const current = (data as any).prData?.notice || [];
              const next = [...current, { title: '신규 공지', date: '2024-00-00', isImportant: false }];
              updateDeep('prData.notice', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 공지 추가</button>
          </div>
        </div>
      )}

      {/* 5. 인재 경영 (Recruit) */}
      {activeSection === 'recruit' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">기본 정보</span>
            <input type="text" value={(data as any).recruitData?.talentValue || ''} onChange={(e) => updateDeep('recruitData.talentValue', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="인재상" />
            <textarea value={(data as any).recruitData?.benefitInfo || ''} onChange={(e) => updateDeep('recruitData.benefitInfo', e.target.value)} className="w-full p-2 border rounded text-sm h-24" placeholder="복지 혜택" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">채용 포지션</span>
            {((data as any).recruitData?.openPositions || []).map((pos: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('recruitData.openPositions', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <input type="text" value={pos.title} onChange={(e) => {
                  const next = [...((data as any).recruitData.openPositions)];
                  next[idx].title = e.target.value;
                  updateDeep('recruitData.openPositions', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <input type="text" value={pos.department} onChange={(e) => {
                  const next = [...((data as any).recruitData.openPositions)];
                  next[idx].department = e.target.value;
                  updateDeep('recruitData.openPositions', next);
                }} className="w-full p-1 border rounded text-xs" placeholder="부서" />
                <input type="text" value={pos.deadline} onChange={(e) => {
                  const next = [...((data as any).recruitData.openPositions)];
                  next[idx].deadline = e.target.value;
                  updateDeep('recruitData.openPositions', next);
                }} className="w-full p-1 border rounded text-xs" placeholder="마감일" />
              </div>
            ))}
            <button onClick={() => {
              const current = (data as any).recruitData?.openPositions || [];
              const next = [...current, { title: '신규 포지션', department: '부서', deadline: '2024-00-00', link: '' }];
              updateDeep('recruitData.openPositions', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 포지션 추가</button>
          </div>
        </div>
      )}

      {/* 6. 고객 센터 (CS) */}
      {activeSection === 'cs' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">문의처 정보</span>
            <textarea value={data.csGuide || ''} onChange={(e) => updateDeep('csGuide', e.target.value)} className="w-full p-2 border rounded text-sm h-20" placeholder="가이드 문구" />
            <input type="text" value={(data as any).csCenter?.contactInfo?.email || ''} onChange={(e) => updateDeep('csCenter.contactInfo.email', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="이메일" />
            <input type="text" value={(data as any).csCenter?.contactInfo?.phone || ''} onChange={(e) => updateDeep('csCenter.contactInfo.phone', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="전화번호" />
          </div>
        </div>
      )}

      {/* 7. 하단 정보 */}
      {activeSection === 'footer' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">푸터 상세 정보</span>
            <input type="text" value={data.footer?.address || ''} onChange={(e) => updateDeep('footer.address', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="text" value={data.footer?.contactEmail || ''} onChange={(e) => updateDeep('footer.contactEmail', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="text" value={data.supportPhone || ''} onChange={(e) => updateDeep('supportPhone', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}