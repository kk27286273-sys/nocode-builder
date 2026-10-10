'use client';

import React from 'react';
import { CorporateViewer } from './CorporateViewer';

interface LivePreviewProps {
  data: any;
  zoom?: number;
  setZoom?: React.Dispatch<React.SetStateAction<number>>;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  currentPageId?: string;
  published?: boolean;
}

export default function LivePreview({
  data,
  activeSection,
  setActiveSection,
  published = false,
}: LivePreviewProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <CorporateViewer
        data={data}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}