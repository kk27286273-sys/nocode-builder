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

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 border-r border-slate-200 p-4 space-y-6">
      <div className="grid grid-cols-2 gap-2 mb-6">
        {['corporateInfo', 'solutions', 'sustainability', 'disclosure', 'pr', 'recruit', 'cs', 'footer'].map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-3 py-2 text-xs rounded-md transition-all ${activeSection === section ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
          >
            {section === 'corporateInfo' ? '회사 소개' : section === 'solutions' ? '사업 소개' : section === 'sustainability' ? '지속가능경영' : section === 'disclosure' ? '공시 정보' : section === 'pr' ? '홍보 센터' : section === 'recruit' ? '인재 경영' : section === 'cs' ? '고객 센터' : '하단 정보'}
          </button>
        ))}
      </div>

      {/* 1. 회사 소개 (로고, CEO, 연혁 모두 포함) */}
      {activeSection === 'corporateInfo' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">기본 설정 & 로고</span>
            <label className="text-[10px] text-slate-400">회사 로고 URL</label>
            <input type="text" value={data.company.logoUrl} onChange={(e) => updateDeep('company.logoUrl', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="https://.../logo.png" />
            <label className="text-[10px] text-slate-400">회사명</label>
            <input type="text" value={data.company.name} onChange={(e) => updateDeep('company.name', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="주식회사 회사명" />
          </div>

          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">메인 헤드라인</span>
            <input type="text" value={(data as any).corporateInfo.intro?.mainTitle || ''} onChange={(e) => updateDeep('corporateInfo.intro.mainTitle', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="신뢰를 바탕으로 미래를 설계하는 기업" />
            <input type="text" value={(data as any).corporateInfo.intro?.subTitle || ''} onChange={(e) => updateDeep('corporateInfo.intro.subTitle', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Company Introduction" />
          </div>

          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">CEO 정보</span>
            <input type="text" value={(data as any).corporateInfo.ceo?.title || ''} onChange={(e) => updateDeep('corporateInfo.ceo.title', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="대표이사 OOO" />
            <textarea value={data.corporateInfo.ceoGreeting.content} onChange={(e) => updateDeep('corporateInfo.ceoGreeting.content', e.target.value)} className="w-full p-2 border rounded text-sm h-24" placeholder="CEO 인사말" />
          </div>

          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">미션 및 비전</span>
            <input type="text" value={data.corporateInfo.missionVision.mission} onChange={(e) => updateDeep('corporateInfo.missionVision.mission', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="미션 문구" />
            <input type="text" value={data.corporateInfo.missionVision.vision} onChange={(e) => updateDeep('corporateInfo.missionVision.vision', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="비전 문구" />
          </div>

          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">Company History (연혁)</span>
            {((data as any).corporateInfo.aboutUs?.history || [
              { year: '2024', event: '글로벌 시장 진출' },
              { year: '2020', event: '연구소 설립' },
              { year: '2015', event: '회사 설립' },
            ]).map((item: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2">
                <input type="text" value={item.year} onChange={(e) => {
                  const next = [...((data as any).corporateInfo.aboutUs?.history || [])];
                  next[idx] = { ...next[idx], year: e.target.value };
                  updateDeep('corporateInfo.aboutUs.history', next);
                }} className="w-full p-1 border rounded text-xs font-bold" placeholder="연도" />
                <input type="text" value={item.event} onChange={(e) => {
                  const next = [...((data as any).corporateInfo.aboutUs?.history || [])];
                  next[idx] = { ...next[idx], event: e.target.value };
                  updateDeep('corporateInfo.aboutUs.history', next);
                }} className="w-full p-1 border rounded text-xs" placeholder="사건/내용" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 사업 소개 (핵심역량 01,02,03 완벽 복구) */}
      {activeSection === 'solutions' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">마케팅 문구</span>
            <input type="text" value={(data as any).solutionsMarketing?.title || ''} onChange={(e) => updateDeep('solutionsMarketing.title', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Enterprise Solution" />
            <textarea value={(data as any).solutionsMarketing?.subTitle || ''} onChange={(e) => updateDeep('solutionsMarketing.subTitle', e.target.value)} className="w-full p-2 border rounded text-sm h-20" placeholder="핵심 역량과 차별점..." />
            <input type="text" value={(data as any).solutionsMarketing?.ctaText || ''} onChange={(e) => updateDeep('solutionsMarketing.ctaText', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="무료 컨설팅 신청하기" />
            <input type="text" value={(data as any).solutionsMarketing?.homeButtonText || ''} onChange={(e) => updateDeep('solutionsMarketing.homeButtonText', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="홈으로 돌아가기" />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">핵심 역량 (01, 02, 03)</span>
            {((data as any).coreCompetencies || [
              { title: '효율적인 프로세스', description: '업무 최적화를 통해 비용을 절감합니다.' },
              { title: '강력한 보안성', description: '엔터프라이즈급 보안 표준을 적용합니다.' },
              { title: '유연한 확장성', description: '비즈니스 성장에 맞춰 확장 가능합니다.' },
            ]).map((comp: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2">
                <div className="text-[10px] font-bold text-slate-400">역량 {idx + 1}</div>
                <input type="text" value={comp.title || ''} onChange={(e) => {
                  const next = [...((data as any).coreCompetencies || [])];
                  next[idx] = { ...next[idx], title: e.target.value };
                  updateDeep('coreCompetencies', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <textarea value={comp.description || ''} onChange={(e) => {
                  const next = [...((data as any).coreCompetencies || [])];
                  next[idx] = { ...next[idx], description: e.target.value };
                  updateDeep('coreCompetencies', next);
                }} className="w-full p-1 border rounded text-xs h-12" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 지속가능경영 (ESG) */}
      {activeSection === 'sustainability' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">ESG 메인</span>
            <input type="text" value={(data as any).sustainability?.title || ''} onChange={(e) => updateDeep('sustainability.title', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Sustainability" />
            <input type="text" value={(data as any).sustainability?.subTitle || ''} onChange={(e) => updateDeep('sustainability.subTitle', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="지속가능한 미래를 위한 약속" />
            <textarea value={(data as any).sustainability?.description || ''} onChange={(e) => updateDeep('sustainability.description', e.target.value)} className="w-full p-2 border rounded text-sm h-20" placeholder="우리는 환경, 사회..." />
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">ESG 세부 항목 (E, S, G)</span>
            {((data as any).sustainability?.items || [
              { category: 'Environment', title: '환경경영', description: '친환경 공정 도입' },
              { category: 'Social', title: '사회공헌', description: '지역사회 상생' },
              { category: 'Governance', title: '투명경영', description: '윤리경영 실천' },
            ]).map((item: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2">
                <input type="text" value={item.category || ''} onChange={(e) => {
                  const next = [...((data as any).sustainability?.items || [])];
                  next[idx] = { ...next[idx], category: e.target.value };
                  updateDeep('sustainability.items', next);
                }} className="w-full p-1 border rounded text-xs font-bold" />
                <input type="text" value={item.title || ''} onChange={(e) => {
                  const next = [...((data as any).sustainability?.items || [])];
                  next[idx] = { ...next[idx], title: e.target.value };
                  updateDeep('sustainability.items', next);
                }} className="w-full p-1 border rounded text-xs" />
                <input type="text" value={item.description || ''} onChange={(e) => {
                  const next = [...((data as any).sustainability?.items || [])];
                  next[idx] = { ...next[idx], description: e.target.value };
                  updateDeep('sustainability.items', next);
                }} className="w-full p-1 border rounded text-xs" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 공시 정보 */}
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

      {/* 5. 홍보 센터 */}
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

      {/* 6. 인재 경영 (채용 포지션 추가 기능 구현) */}
      {activeSection === 'recruit' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">기본 정보</span>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">인재상</label>
              <input type="text" value={data.recruit.talentValue} onChange={(e) => updateDeep('recruit.talentValue', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="인재상" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">복지 혜택</label>
              <textarea value={data.recruit.benefitInfo} onChange={(e) => updateDeep('recruit.benefitInfo', e.target.value)} className="w-full p-2 border rounded text-sm h-24" placeholder="복지 혜택" />
            </div>
          </div>
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">채용 중인 포지션</span>
            {((data as any).recruit.positions || [
              { title: '웹 개발자', desc: 'Next.js 숙련자 모집', type: '신입/경력' },
            ]).map((pos: any, idx: number) => (
              <div key={idx} className="p-2 border rounded bg-slate-50 space-y-2 mb-2">
                <input type="text" value={pos.title} onChange={(e) => {
                  const next = [...((data as any).recruit.positions || [])];
                  next[idx] = { ...next[idx], title: e.target.value };
                  updateDeep('recruit.positions', next);
                }} className="w-full p-1 border rounded text-xs font-bold" placeholder="포지션명" />
                <input type="text" value={pos.desc} onChange={(e) => {
                  const next = [...((data as any).recruit.positions || [])];
                  next[idx] = { ...next[idx], desc: e.target.value };
                  updateDeep('recruit.positions', next);
                }} className="w-full p-1 border rounded text-xs" placeholder="상세 설명" />
              </div>
            ))}
            <button onClick={() => {
              const next = [...((data as any).recruit.positions || []), { title: '신규 포지션', desc: '', type: '경력' }];
              updateDeep('recruit.positions', next);
            }} className="w-full py-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-md font-bold">+ 포지션 추가</button>
          </div>
        </div>
      )}

      {/* 7. 고객 센터 (연결 완료) */}
      {activeSection === 'cs' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">문의처 정보</span>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">상담 안내 문구</label>
              <textarea value={data.csGuide} onChange={(e) => updateDeep('csGuide', e.target.value)} className="w-full p-2 border rounded text-sm h-20" placeholder="고객에게 보여줄 안내 문구" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">이메일</label>
              <input type="text" value={data.csCenter.contactInfo.email} onChange={(e) => updateDeep('csCenter.contactInfo.email', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="이메일" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">전화번호</label>
              <input type="text" value={data.csCenter.contactInfo.phone} onChange={(e) => updateDeep('csCenter.contactInfo.phone', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="전화번호" />
            </div>
          </div>
        </div>
      )}

      {/* 8. 하단 정보 (Footer) */}
      {activeSection === 'footer' && (
        <div className="space-y-4">
          <div className="p-3 bg-white border rounded-lg space-y-3">
            <span className="text-xs font-bold block text-blue-600">푸터 상세 정보</span>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">회사 주소</label>
              <input type="text" value={data.footer.address} onChange={(e) => updateDeep('footer.address', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="주소" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">대표 이메일</label>
              <input type="text" value={data.footer.contactEmail} onChange={(e) => updateDeep('footer.contactEmail', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="이메일" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400">대표 전화번호</label>
              <input type="text" value={data.supportPhone} onChange={(e) => updateDeep('supportPhone', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="전화번호" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}