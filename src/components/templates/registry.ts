// src/components/templates/registry.ts
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// 업종별 전용 레이아웃 등록
export const TEMPLATE_LAYOUTS: Record<string, ComponentType> = {
  'legal-tax': dynamic(() => import('./LegalTaxLayout')),
  // 'corporate': dynamic(() => import('./CorporateLayout')),
  // 'counseling': dynamic(() => import('./CounselingLayout')),
  // 'fitness-lesson': dynamic(() => import('./FitnessLayout')),
};

export const TEMPLATE_IDS = Object.keys(TEMPLATE_LAYOUTS);