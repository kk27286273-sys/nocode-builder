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
  zoom: propZoom,
  setZoom: propSetZoom,
  activeSection,
  setActiveSection,
  published = false,
}: LivePreviewProps) {
  const zoom = propZoom ?? 100;
  const setZoom = propSetZoom || (() => {});

  if (published) {
    return (
      <div className="w-full min-h-screen bg-white">
        <CorporateViewer
          data={data}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-slate-200 relative">
      <div className="h-12 bg-white border-b border-slate-300 flex items-center justify-between px-6 z-50 shrink-0 shadow-sm">
        <span className="text-xs font-bold text-slate-600 tracking-wider">
          PREVIEW CANVAS ({zoom}%)
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((prev: number) => Math.max(prev - 10, 30))}
            className="w-7 h-7 bg-slate-100 border rounded text-xs font-bold hover:bg-slate-200"
          >
            -
          </button>
          <span className="text-xs font-semibold w-10 text-center">{zoom}%</span>
          <button
            type="button"
            onClick={() => setZoom((prev: number) => Math.min(prev + 10, 150))}
            className="w-7 h-7 bg-slate-100 border rounded text-xs font-bold hover:bg-slate-200"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 md:p-10 flex justify-center items-start">
        <div
          style={{
            width: `${1280 * (zoom / 100)}px`,
            maxWidth: '100%',
          }}
          className="bg-white shadow-2xl border border-slate-300 rounded-lg overflow-hidden h-fit shrink-0"
        >
          <CorporateViewer
            data={data}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>
      </div>
    </div>
  );
}