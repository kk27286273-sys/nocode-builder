'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface PRPageProps {
  prData?: {
    news: { title: string; date: string; summary: string; image: string }[];
    notice: { title: string; date: string; isImportant: boolean }[];
  };
}

export default function PRPage({ prData }: PRPageProps) {
  const data = prData || { news: [], notice: [] };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full bg-white">
      <section className="py-24 px-4 bg-[#0a192f] text-white text-center">
        <span className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-4 block">PR Center</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">홍보센터</h1>
        <p className="text-slate-400 max-w-2xl mx-auto font-light">회사의 최신 소식과 유익한 정보를 전달해 드립니다.</p>
      </section>

      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* 뉴스 카드 (2/3 영역) */}
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tighter mb-8">최신 뉴스</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.news.map((item, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-video bg-slate-200 rounded-2xl overflow-hidden mb-4 shadow-lg">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2 mb-2 group-hover:text-blue-600 transition">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 공지사항 (1/3 영역) */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tighter mb-8 text-center">공지사항</h2>
            <div className="space-y-4">
              {data.notice.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 hover:bg-white rounded-lg transition cursor-pointer">
                  {item.isImportant && <span className="text-rose-500 text-[10px] font-bold mt-1">[중요]</span>}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 line-clamp-1">{item.title}</p>
                    <span className="text-[11px] text-slate-400">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}