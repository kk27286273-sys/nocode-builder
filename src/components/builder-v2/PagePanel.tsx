"use client";

import type { V2Page } from "@/types/builder-v2";

interface PagePanelProps {
  pages: V2Page[];
  selectedPageId: string;
  selectedSectionId: string;
  onSelectPage: (pageId: string) => void;
  onSelectSection: (sectionId: string) => void;
}

export default function PagePanel({
  pages,
  selectedPageId,
  selectedSectionId,
  onSelectPage,
  onSelectSection,
}: PagePanelProps) {
  const selectedPage = pages.find((page) => page.id === selectedPageId);

  return (
    <aside className="w-72 shrink-0 border-r border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-900">페이지</h2>

      <div className="mt-3 space-y-2">
        {pages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => onSelectPage(page.id)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
              selectedPageId === page.id
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {page.name}
          </button>
        ))}
      </div>

      <h2 className="mt-8 text-sm font-semibold text-neutral-900">섹션</h2>

      <div className="mt-3 space-y-2">
        {selectedPage?.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelectSection(section.id)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
              selectedSectionId === section.id
                ? "bg-neutral-900 text-white"
                : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>
    </aside>
  );
}
