'use client';

import React from 'react';
import LivePreview from './LivePreview';

interface ViewerManagerProps {
  data: any;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
  published?: boolean;
}

export default function ViewerManager({
  data,
  setData,
  activeSection,
  setActiveSection,
  published = false,
}: ViewerManagerProps) {
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <LivePreview
      data={data}
      setData={setData}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      published={published}
    />
  );
}