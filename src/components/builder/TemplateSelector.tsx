import React from 'react';
import { TemplateType } from '@/types/template';

interface TemplateSelectorProps {
  currentType: TemplateType;
  onTypeChange: (type: TemplateType) => void;
}

const templateOptions: { value: TemplateType; label: string }[] = [
  { value: 'one-page', label: '원페이지형 (랜딩)' },
  { value: 'corporate', label: '기업형 (브랜딩)' },
  { value: 'rental-shop', label: '쇼핑몰형 (렌탈)' },
  { value: 'portfolio', label: '포트폴리오형 (전시)' },
];

export const TemplateSelector = ({ currentType, onTypeChange }: TemplateSelectorProps) => {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
      <span className="text-sm font-medium text-slate-600">템플릿 타입:</span>
      <select 
        value={currentType} 
        onChange={(e) => onTypeChange(e.target.value as TemplateType)}
        className="bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {templateOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};