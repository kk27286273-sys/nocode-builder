'use client';

import React from 'react';
import CorporateViewer from './CorporateViewer';
import InteriorViewer from '@/components/viewer/templates/InteriorViewer';
import LegalViewer from '@/components/viewer/templates/LegalViewer';
import FitnessViewer from '@/components/viewer/templates/FitnessViewer';

interface LivePreviewProps {
  data: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  zoom?: number;
  setZoom?: React.Dispatch<React.SetStateAction<number>>;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  currentPageId?: string;
  published?: boolean;
  beforeMain?: React.ReactNode;
  afterMain?: React.ReactNode;
}

export default function LivePreview({
  data,
  setData,
  activeSection,
  setActiveSection,
  published = false,
  beforeMain,
  afterMain,
}: LivePreviewProps) {
  const templateType = data?.templateType;
  const hasSeparateViewer = ['fitness', 'interior', 'onepage', 'legal'].includes(templateType);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {hasSeparateViewer && beforeMain}
      {templateType === 'fitness' ? (
        <FitnessViewer data={data} sectionsVisible={data?.sectionsVisible} />
      ) : templateType === 'interior' || templateType === 'onepage' ? (
        <InteriorViewer
          data={data}
          setData={setData}
          editable={!published}
          sectionsVisible={data?.sectionsVisible}
        />
      ) : templateType === 'legal' ? (
        <LegalViewer
          data={data}
          setData={setData}
          editable={!published}
          sectionsVisible={data?.sectionsVisible}
        />
      ) : (
<CorporateViewer 
  data={data}
  activeSection={activeSection}
  setActiveSection={setActiveSection}
  sectionsVisible={data?.sectionsVisible}
  beforeMain={beforeMain}
  afterMain={afterMain}
/>
      )}
      {hasSeparateViewer && afterMain}
    </div>
  );
}
