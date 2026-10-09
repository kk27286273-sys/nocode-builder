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
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
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
      array.splice(index, 1);
      return next;
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 border-r border-slate-200 p-4 space-y-6">
      <div className="grid grid-cols-2 gap-2 mb-6">
        {['corporateInfo', 'solutions', 'sustainability', 'pr', 'recruit', 'cs', 'footer'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-3 py-2 text-xs rounded-md transition-all ${activeSection === section ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            {section === 'corporateInfo' ? '회사 소개' : section === 'solutions' ? '사업 소개' : section === 'sustainability' ? '지속가능경영' : section === 'pr' ? '홍보 센터' : section === 'recruit' ? '인재 경영' : section === 'cs' ? '고객 센터' : '하단 정보'}
          </button>
        ))}
      </div>

      {/* 1. 회사 소개 */}
      {activeSection === 'corporateInfo' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">기본 설정</span>
            <label className="text-[10px] text-slate-400">로고 URL</label>
            <input type="text" value={data.company.logoUrl} onChange={(e) => updateDeep('company.logoUrl', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <label className="text-[10px] text-slate-400">회사명</label>
            <input type="text" value={data.company.name} onChange={(e) => updateDeep('company.name', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">메인 헤드라인 (연동 확인)</span>
            <input type="text" value={(data as any).corporateInfo.intro?.mainTitle || ''} onChange={(e) => updateDeep('corporateInfo.intro.mainTitle', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="신뢰와 기술로..." />
            <input type="text" value={(data as any).corporateInfo.intro?.subTitle || ''} onChange={(e) => updateDeep('corporateInfo.intro.subTitle', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="주식회사 회사명" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">CEO 정보</span>
            <input type="text" value={(data as any).corporateInfo.ceo?.title || ''} onChange={(e) => updateDeep('corporateInfo.ceo.title', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <textarea value={data.corporateInfo.ceoGreeting.content} onChange={(e) => updateDeep('corporateInfo.ceoGreeting.content', e.target.value)} className="w-full p-2 border rounded text-sm h-24" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">연혁 관리</span>
            {((data as any).corporateInfo.aboutUs?.history || []).map((item: any, idx: number) => (
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
              const next = [...((data as any).corporateInfo.aboutUs?.history || []), { year: '2024', event: '새로운 연혁' }];
              updateDeep('corporateInfo.aboutUs.history', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 연혁 추가</button>
          </div>
        </div>
      )}

      {/* 2. 사업 소개 */}
      {activeSection === 'solutions' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">마케팅 문구 (연동 확인)</span>
            <input type="text" value={(data as any).solutionsMarketing?.title || ''} onChange={(e) => updateDeep('solutionsMarketing.title', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Enterprise Solution" />
            <textarea value={(data as any).solutionsMarketing?.subTitle || ''} onChange={(e) => updateDeep('solutionsMarketing.subTitle', e.target.value)} className="w-full p-2 border rounded text-sm h-20" placeholder="B2B 기업·제조업 전용 웹..." />
            <input type="text" value={(data as any).solutionsMarketing?.ctaText || ''} onChange={(e) => updateDeep('solutionsMarketing.ctaText', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="무료 컨설팅 신청하기" />
            <input type="text" value={(data as any).solutionsMarketing?.homeButtonText || ''} onChange={(e) => updateDeep('solutionsMarketing.homeButtonText', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="홈으로 돌아가기" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">핵심 역량 (연동 확인)</span>
            {((data as any).coreCompetencies || []).map((comp: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('coreCompetencies', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <input type="text" value={comp.title || ''} onChange={(e) => {
                  const next = [...((data as any).coreCompetencies)];
                  next[idx].title = e.target.value;
                  updateDeep('coreCompetencies', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <textarea value={comp.description || ''} onChange={(e) => {
                  const next = [...((data as any).coreCompetencies)];
                  next[idx].description = e.target.value;
                  updateDeep('coreCompetencies', next);
                }} className="w-full p-1 border rounded text-xs h-12" />
              </div>
            ))}
            <button onClick={() => {
              const next = [...((data as any).coreCompetencies || []), { title: '핵심 역량', description: '내용을 입력하세요' }];
              updateDeep('coreCompetencies', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 역량 추가</button>
          </div>
        </div>
      )}

      {/* 3. 지속가능경영 (ESG) */}
      {activeSection === 'sustainability' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">ESG 메인 (연동 확인)</span>
            <input type="text" value={(data as any).sustainability?.title || ''} onChange={(e) => updateDeep('sustainability.title', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="text" value={(data as any).sustainability?.subTitle || ''} onChange={(e) => updateDeep('sustainability.subTitle', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <textarea value={(data as any).sustainability?.description || ''} onChange={(e) => updateDeep('sustainability.description', e.target.value)} className="w-full p-2 border rounded text-sm h-20" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">ESG 세부 항목 (연동 확인)</span>
            {((data as any).sustainability?.items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('sustainability.items', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <input type="text" value={item.category || ''} onChange={(e) => {
                  const next = [...((data as any).sustainability.items)];
                  next[idx].category = e.target.value;
                  updateDeep('sustainability.items', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <input type="text" value={item.title || ''} onChange={(e) => {
                  const next = [...((data as any).sustainability.items)];
                  next[idx].title = e.target.value;
                  updateDeep('sustainability.items', next);
                }} className="w-full p-1 border rounded text-xs" />
                <textarea value={item.description || ''} onChange={(e) => {
                  const next = [...((data as any).sustainability.items)];
                  next[idx].description = e.target.value;
                  updateDeep('sustainability.items', next);
                }} className="w-full p-1 border rounded text-xs h-12" />
              </div>
            ))}
            <button onClick={() => {
              const next = [...((data as any).sustainability?.items || []), { category: 'Environment', title: '새 항목', description: '내용' }];
              updateDeep('sustainability.items', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ ESG 항목 추가</button>
          </div>
        </div>
      )}

      {/* 4. 홍보 센터 */}
      {activeSection === 'pr' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">뉴스/공지사항</span>
            {(data.prCenter.news || []).map((n, idx) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('prCenter.news', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <input type="text" value={n.title} onChange={(e) => {
                  const next = [...data.prCenter.news];
                  next[idx].title = e.target.value;
                  updateDeep('prCenter.news', next);
                }} className="w-full p-1 border rounded text-xs" />
                <input type="text" value={n.date} onChange={(e) => {
                  const next = [...data.prCenter.news];
                  next[idx].date = e.target.value;
                  updateDeep('prCenter.news', next);
                }} className="w-full p-1 border rounded text-xs" />
                <textarea value={n.summary} onChange={(e) => {
                  const next = [...data.prCenter.news];
                  next[idx].summary = e.target.value;
                  updateDeep('prCenter.news', next);
                }} className="w-full p-1 border rounded text-xs h-12" />
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
            <span className="text-xs font-bold block text-blue-600">기본 정보</span>
            <input type="text" value={data.recruit.talentValue} onChange={(e) => updateDeep('recruit.talentValue', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="인재상" />
            <textarea value={data.recruit.benefitInfo} onChange={(e) => updateDeep('recruit.benefitInfo', e.target.value)} className="w-full p-2 border rounded text-sm h-24" placeholder="복지 혜택" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">채용 중인 포지션 (연동 확인)</span>
            {((data as any).recruit.positions || []).map((pos: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2 relative group">
                <button onClick={() => removeDeep('recruit.positions', idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 text-xs">삭제</button>
                <input type="text" value={pos.title} onChange={(e) => {
                  const next = [...((data as any).recruit.positions)];
                  next[idx].title = e.target.value;
                  updateDeep('recruit.positions', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <input type="text" value={pos.desc} onChange={(e) => {
                  const next = [...((data as any).recruit.positions)];
                  next[idx].desc = e.target.value;
                  updateDeep('recruit.positions', next);
                }} className="w-full p-1 border rounded text-xs" />
              </div>
            ))}
            <button onClick={() => {
              const next = [...((data as any).recruit.positions || []), { title: '신규 포지션', desc: '', type: '경력' }];
              updateDeep('recruit.positions', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 포지션 추가</button>
          </div>
        </div>
      )}

      {/* 6. 고객 센터 */}
      {activeSection === 'cs' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">문의처 정보 (연동 확인)</span>
            <textarea value={data.csGuide} onChange={(e) => updateDeep('csGuide', e.target.value)} className="w-full p-2 border rounded text-sm h-20" placeholder="가이드 문구" />
            <input type="text" value={data.csCenter.contactInfo.email} onChange={(e) => updateDeep('csCenter.contactInfo.email', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="이메일" />
            <input type="text" value={data.csCenter.contactInfo.phone} onChange={(e) => updateDeep('csCenter.contactInfo.phone', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="전화번호" />
          </div>
        </div>
      )}

      {/* 7. 하단 정보 */}
      {activeSection === 'footer' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">푸터 상세 정보</span>
            <input type="text" value={data.footer.address} onChange={(e) => updateDeep('footer.address', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="text" value={data.footer.contactEmail} onChange={(e) => updateDeep('footer.contactEmail', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <input type="text" value={data.supportPhone} onChange={(e) => updateDeep('supportPhone', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
        </div>
      )}
    </div>
  );
}