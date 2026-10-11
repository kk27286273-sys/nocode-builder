'use client';

import React from 'react';

interface ShowroomTemplateItem {
  id: string;
  category: string;
  name: string;
  tagline: string;
  description: string;
  themeColor: string;
  thumbnailImage: string;
  features: string[];
  targetAudience: string;
  pageStructure: {
    main: string;
    sub: string;
    conversion: string;
  };
}

interface LivePreviewProps {
  template: ShowroomTemplateItem;
}

export default function LivePreview({ template }: LivePreviewProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{template.name}</h1>
        <p className="text-xl text-slate-600 mb-8">{template.description}</p>
        <div className="bg-slate-50 p-8 rounded-lg">
          <p className="text-slate-700">미리보기 콘텐츠</p>
        </div>
      </div>
    </main>
  );
}