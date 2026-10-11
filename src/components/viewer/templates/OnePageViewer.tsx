'use client';

import React, { useState } from 'react';
import { B2BTemplateData } from '@/types/Template';

interface Props {
  data: B2BTemplateData;
  onEdit?: () => void;
}

export default function OnePageViewer({ data, onEdit }: Props) {
  const [activeSection, setActiveSection] = useState('hero');

  return (
    <div className="min-h-screen bg-white">
      {/* GNB */}
      <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-bold">{data.company.name}</div>
          <div className="flex gap-4">
            {data.navigation.menus.map((menu, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSection(menu.label.toLowerCase())}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {menu.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          {data.hero.badge && (
            <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">
              {data.hero.badge}
            </div>
          )}
          <h1 className="text-5xl font-bold text-slate-900">{data.hero.title}</h1>
          <p className="mt-6 text-xl text-slate-600">{data.hero.subtitle}</p>
          {data.hero.mediaUrl && (
            <img
              src={data.hero.mediaUrl}
              alt="Hero"
              className="mt-12 mx-auto max-h-96 rounded-lg"
            />
          )}
        </div>
      </section>

      {/* Solutions */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            서비스
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.solutions.map((solution, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-white p-8 shadow-sm border border-slate-200 hover:shadow-md transition"
              >
                {solution.image && (
                  <img
                    src={solution.image}
                    alt={solution.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-bold text-slate-900">
                  {solution.title}
                </h3>
                {solution.category && (
                  <p className="text-xs font-semibold text-blue-600 mt-2">
                    {solution.category}
                  </p>
                )}
                <p className="mt-4 text-sm text-slate-600">
                  {solution.description}
                </p>
                {solution.detailedFeatures &&
                  solution.detailedFeatures.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {solution.detailedFeatures.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="text-xs text-slate-500 flex gap-2"
                        >
                          <span className="text-blue-600">•</span>
                          <span>
                            <strong>{feature.featureTitle}:</strong>{' '}
                            {feature.featureContent}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">회사소개</h2>
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              {data.corporateInfo.ceoGreeting.image && (
                <img
                  src={data.corporateInfo.ceoGreeting.image}
                  alt="CEO"
                  className="w-full rounded-lg"
                />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {data.corporateInfo.ceoGreeting.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {data.corporateInfo.ceoGreeting.content}
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-500">미션</p>
                  <p className="mt-2 font-bold text-slate-900">
                    {data.corporateInfo.missionVision.mission}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">비전</p>
                  <p className="mt-2 font-bold text-slate-900">
                    {data.corporateInfo.missionVision.vision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">문의하기</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-400">이메일</p>
              <p className="mt-2 font-bold">{data.csCenter.contactInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">전화</p>
              <p className="mt-2 font-bold">{data.csCenter.contactInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">주소</p>
              <p className="mt-2 font-bold text-sm">
                {data.csCenter.contactInfo.address}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-bold">{data.footer.companyName}</p>
          <p className="mt-2 text-sm text-slate-400">
            {data.footer.address}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            사업자등록번호: {data.footer.businessNumber}
          </p>
          <p className="mt-4 text-xs text-slate-600">
            © {new Date().getFullYear()} {data.footer.companyName}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
