'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface AboutPageProps {
  corporateInfo: any;
}

export default function AboutPage({ corporateInfo }: AboutPageProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
      {/* 1. CEO 인사말 섹션: 신뢰감 있는 레이아웃 */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="w-full lg:w-2/5">
              <div className="relative group">
                <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl scale-95 group-hover:scale-100 transition-transform duration-500" />
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-slate-200">
                  {corporateInfo?.ceoGreeting?.image ? (
                    <img src={corporateInfo.ceoGreeting.image} alt="CEO" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">CEO Image</div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-3/5">
              <span className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4 block">CEO Message</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
                {corporateInfo?.ceoGreeting?.title || '인사말 제목을 입력하세요'}
              </h2>
              <div className="text-lg md:text-xl text-slate-600 leading-relaxed whitespace-pre-line font-light">
                {corporateInfo?.ceoGreeting?.content || 'CEO 인사말 내용을 입력해주세요. 기업의 철학과 비전을 담은 진정성 있는 메시지가 들어갑니다.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 미션 & 비전 섹션: 전문적인 그리드 배치 */}
      <section className="py-32 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Mission & Vision</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-12 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-8">M</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Mission</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                {corporateInfo?.missionVision?.mission || '기업의 존재 이유와 사회적 역할을 정의하는 미션 내용이 이곳에 들어갑니다.'}
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-12 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-8">V</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Vision</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                {corporateInfo?.missionVision?.vision || '기업이 나아가고자 하는 미래의 모습과 목표를 정의하는 비전 내용이 이곳에 들어갑니다.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}