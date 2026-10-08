'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface RecruitPageProps {
  recruitData?: {
    talentValue: string;
    benefitInfo: string;
    openPositions: { title: string; department: string; deadline: string; link: string }[];
  };
}

export default function RecruitPage({ recruitData }: RecruitPageProps) {
  const data = recruitData || { talentValue: '', benefitInfo: '', openPositions: [] };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      <section className="py-24 px-4 bg-slate-50 border-b border-slate-100 text-center">
        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">Recruitment</span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter">인재경영</h1>
        <p className="text-slate-500 mt-4 font-light">함께 성장하며 미래를 만들어갈 인재를 기다립니다.</p>
      </section>

      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* 인재상 & 복지 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-12 bg-[#0a192f] text-white rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-8 tracking-tighter">우리가 찾는 인재상</h2>
              <p className="text-slate-300 leading-relaxed font-light break-keep text-lg">
                {data.talentValue || '도전 정신과 전문성을 갖춘 인재, 협력과 소통을 통해 함께 성장하는 인재를 찾습니다.'}
              </p>
            </div>
            <div className="p-12 bg-blue-600 text-white rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-8 tracking-tighter">복지 및 혜택</h2>
              <p className="text-blue-100 leading-relaxed font-light break-keep text-lg">
                {data.benefitInfo || '최고의 업무 환경과 성장을 위한 전폭적인 지원, 그리고 일과 삶의 균형을 위한 다양한 복지 제도를 운영합니다.'}
              </p>
            </div>
          </div>

          {/* 채용 공고 테이블 */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center tracking-tighter">현재 채용 중인 포지션</h2>
            <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-6 text-sm font-bold text-slate-600">부서</th>
                    <th className="p-6 text-sm font-bold text-slate-600">모집 직무</th>
                    <th className="p-6 text-sm font-bold text-slate-600">마감일</th>
                    <th className="p-6 text-sm font-bold text-slate-600 text-center">지원하기</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.openPositions.map((pos, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-6 text-sm text-slate-500">{pos.department}</td>
                      <td className="p-6 text-sm font-bold text-slate-900">{pos.title}</td>
                      <td className="p-6 text-sm text-slate-500">{pos.deadline}</td>
                      <td className="p-6 text-center">
                        <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition">지원</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}