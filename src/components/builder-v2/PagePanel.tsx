"use client";

import type { V2Page, V2Element } from "@/types/builder-v2";

interface PagePanelProps {
  pages: V2Page[];
  selectedPageId: string;
  selectedSectionId: string;
  selectedElementId?: string;
  onSelectPage: (pageId: string) => void;
  onSelectSection: (sectionId: string) => void;
  onSelectElement?: (elementId: string) => void;
  onAddSection: () => void;
  onAddElement?: (sectionId: string) => void;
  onDeleteElement?: (sectionId: string, elementId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: "up" | "down") => void;
}

export default function PagePanel({
  pages,
  selectedPageId,
  selectedSectionId,
  selectedElementId,
  onSelectPage,
  onSelectSection,
  onSelectElement,
  onAddSection,
  onAddElement,
  onDeleteElement,
  onDeleteSection,
  onDuplicateSection,
  onMoveSection,
}: PagePanelProps) {
  const selectedPage = pages.find((page) => page.id === selectedPageId);
  const selectedSection = selectedPage?.sections?.find(
    (section) => section.id === selectedSectionId,
  );

  return (
    <aside className="w-72 shrink-0 border-r border-neutral-200 bg-white p-4 overflow-y-auto">
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

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">섹션</h2>
        <button
          type="button"
          onClick={onAddSection}
          className="rounded px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700"
        >
          + 추가
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {(selectedPage?.sections || []).map((section) => (
          <div key={section.id} className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectSection(section.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                selectedSectionId === section.id
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {section.name}
              {section.type && (
                <span className="ml-2 text-xs text-neutral-500">
                  ({section.type})
                </span>
              )}
            </button>

            {selectedSectionId === section.id && (
              <>
                <div className="flex gap-1 px-1">
                  <button
                    type="button"
                    onClick={() => onMoveSection(section.id, "up")}
                    className="flex-1 rounded px-2 py-1 text-xs bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    title="위로 이동"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveSection(section.id, "down")}
                    className="flex-1 rounded px-2 py-1 text-xs bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    title="아래로 이동"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicateSection(section.id)}
                    className="flex-1 rounded px-2 py-1 text-xs bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                    title="복제"
                  >
                    📋
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSection(section.id)}
                    className="flex-1 rounded px-2 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200"
                    title="삭제"
                  >
                    🗑
                  </button>
                </div>

                {/* 요소 목록 */}
                <div className="mt-2 ml-2 space-y-1 border-l-2 border-neutral-200 pl-2">
                  {section.elements?.map((element) => (
                    <div key={element.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectElement?.(element.id)}
                        className={`flex-1 rounded px-2 py-1 text-xs text-left ${
                          selectedElementId === element.id
                            ? "bg-blue-100 text-blue-700"
                            : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        {element.type === "image"
                          ? "🖼 이미지"
                          : element.type === "heading"
                            ? "📝 제목"
                            : element.type === "button"
                              ? "🔘 버튼"
                              : "📄 텍스트"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onDeleteElement?.(section.id, element.id)
                        }
                        className="rounded px-1.5 py-1 text-xs bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* 요소 추가 버튼 */}
                  <button
                    type="button"
                    onClick={() => onAddElement?.(section.id)}
                    className="w-full rounded px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold"
                  >
                    + 요소 추가
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}