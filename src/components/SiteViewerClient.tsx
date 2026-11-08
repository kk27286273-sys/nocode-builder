'use client';
import { useState } from 'react';
import ViewerManager from './builder/ViewerManager';
import type { B2BTemplateData } from '@/types/Template';
export default function SiteViewerClient({ data }: { data: B2BTemplateData }) {
  const [activeSection, setActiveSection] = useState('main');
  return <main className="min-h-screen w-full bg-white"><ViewerManager data={data} activeSection={activeSection} setActiveSection={setActiveSection} published /></main>;
}
