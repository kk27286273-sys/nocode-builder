'use client';

import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function CustomerPage({ data }: { data: B2BTemplateData }) {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">Customer Center</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {data.csGuide || '고객센터 안내 문구가 설정되지 않았습니다. 에디터에서 수정해 주세요.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 border rounded-2xl bg-slate-50 space-y-4">
            <div className="text-blue-600 font-bold">Email Inquiry</div>
            <div className="text-2xl font-medium">{data.csCenter.contactInfo.email}</div>
          </div>
          <div className="p-8 border rounded-2xl bg-slate-50 space-y-4">
            <div className="text-blue-600 font-bold">Phone Support</div>
            <div className="text-2xl font-medium">{data.csCenter.contactInfo.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
}