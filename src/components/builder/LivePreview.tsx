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
}

export default function LivePreview({
  data,
  setData,
  activeSection,
  setActiveSection,
  published = false,
}: LivePreviewProps) {
  const templateType = data?.templateType;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
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
  sectionsVisible={sectionsVisible}
/>
      )}
    </div>
  );
}