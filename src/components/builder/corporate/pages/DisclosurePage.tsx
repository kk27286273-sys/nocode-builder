'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface DisclosurePageProps {
  disclosureData?: {
    certifications: { name: string; image: string; date: string }[];
    reports: { title: string; date: string; link: string }[];
  };
}

export default function DisclosurePage({ disclosureData }: DisclosurePageProps) {
  const data = disclosureData || { certifications: [], reports: [] };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      <section className="py-24 px-4 bg-slate-50 border-b border-slate-100 text-center">
        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4 block">Disclosure</span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tighter">공시정보</h1>
        <p className="text-slate-500 mt-4 font-light">투명한 경영과 신뢰할 수 있는 정보를 제공합니다.</p>
      </section>

      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto space-y-32">
          {/* 인증서 그리드 */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center tracking-tighter">인증 및 특허</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.certifications.map((cert, idx) => (
                <div key={idx} className="group p-4 bg-white border border-slate-200 rounded-xl hover:shadow-xl transition-all duration-300 text-center">
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-4">
                    <img src={cert.image} alt={cert.name} className="w-full h-full object-contain group-hover:scale-110 transition duration-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{cert.name}</h3>
                  <p className="text-xs text-slate-400">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 보고서 리스트 */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center tracking-tighter">정기 보고서</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {data.reports.map((report, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">PDF</div>
                    <span className="font-medium text-slate-700 group-hover:text-blue-600 transition">{report.title}</span>
                  </div>
                  <span className="text-sm text-slate-400">{report.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}