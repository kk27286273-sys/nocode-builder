'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ESGGoal {
  label?: string;
  title?: string;
  content?: string;
}

interface ESGPageProps {
  esgData?: {
    mainTitle?: string;
    mainDesc?: string;
    goals?: ESGGoal[];
    environmental?: string;
    social?: string;
    governance?: string;
  };
}

export default function ESGPage({ esgData }: ESGPageProps) {
  const data = esgData || {};
  const defaultGoals: ESGGoal[] = [
    {
      label: 'Environmental',
      title: '환경 경영',
      content: '내용을 입력해 주세요.',
    },
    {
      label: 'Social',
      title: '사회적 책임',
      content: '내용을 입력해 주세요.',
    },
    {
      label: 'Governance',
      title: '투명 경영',
      content: '내용을 입력해 주세요.',
    },
  ];

  const goals = [0, 1, 2].map((index) => ({
    ...defaultGoals[index],
    ...(data.goals?.[index] || {}),
  }));

  const colors = ['text-green-600', 'text-blue-600', 'text-purple-600'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-white"
    >
      <section className="py-24 md:py-32 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
            {data.mainTitle || '지속가능경영'}
          </h1>
          <p className="text-lg text-slate-400 font-light break-keep whitespace-pre-wrap">
            {data.mainDesc ||
              '우리는 환경, 사회, 지배구조의 조화를 통해 지속 가능한 가치를 창출합니다.'}
          </p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {goals.map((goal, index) => (
          <div
            key={index}
            className="p-10 bg-slate-50 rounded-3xl border border-slate-100"
          >
            <h3 className={`text-2xl font-bold mb-4 ${colors[index]}`}>
              {goal.label || defaultGoals[index].label}
            </h3>
            <p className="text-slate-500 font-medium mb-4">
              {goal.title || defaultGoals[index].title}
            </p>
            <div className="text-slate-600 leading-relaxed font-light break-keep whitespace-pre-wrap">
              {goal.content || defaultGoals[index].content}
            </div>
          </div>
        ))}
      </section>
    </motion.div>
  );
}