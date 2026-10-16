"use client";

import { useState } from "react";
import type { V2Element, V2Page } from "@/types/builder-v2";
import PagePanel from "./PagePanel";
import EditorPanel from "./EditorPanel";
import ElementEditor from "./ElementEditor";

const initialPages: V2Page[] = [
  {
    id: "home",
    name: "메인",
    slug: "/",
    sections: [
      {
        id: "hero",
        name: "메인 배너",
        elements: [
          {
            id: "hero-title",
            type: "heading",
            content: "새로운 홈페이지를 시작하세요",
          },
          {
            id: "hero-description",
            type: "text",
            content: "Nexia Builder V2에서 쉽고 빠르게 홈페이지를 만드세요.",
          },
          {
            id: "hero-button",
            type: "button",
            content: "문의하기",
          },
        ],
      },
      {
        id: "about",
        name: "회사 소개",
        elements: [
          {
            id: "about-title",
            type: "heading",
            content: "회사 소개",
          },
          {
            id: "about-description",
            type: "text",
            content: "고객에게 회사의 강점과 이야기를 소개하세요.",
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    name: "고객센터",
    slug: "/contact",
    sections: [
      {
        id: "contact-info",
        name: "연락처",
        elements: [
          {
            id: "contact-title",
            type: "heading",
            content: "문의해 주세요",
          },
          {
            id: "contact-description",
            type: "text",
            content: "전화번호와 이메일을 입력할 수 있는 영역입니다.",
          },
        ],
      },
    ],
  },
];

export default function BuilderV2Shell() {
  const [pages, setPages] = useState<V2Page[]>(initialPages);
  const [selectedPageId, setSelectedPageId] = useState(initialPages[0].id);
  const [selectedSectionId, setSelectedSectionId] = useState(
    initialPages[0].sections[0].id,
  );
  const [selectedElementId, setSelectedElementId] = useState(
    initialPages[0].sections[0].elements[0].id,
  );

  const selectedPage = pages.find((page) => page.id === selectedPageId);

  const selectedSection = selectedPage?.sections.find(
    (section) => section.id === selectedSectionId,
  );

  const selectedElement = selectedSection?.elements.find(
    (element) => element.id === selectedElementId,
  );

  const handleSelectPage = (pageId: string) => {
    const nextPage = pages.find((page) => page.id === pageId);
    const nextSection = nextPage?.sections[0];

    setSelectedPageId(pageId);
    setSelectedSectionId(nextSection?.id ?? "");
    setSelectedElementId(nextSection?.elements[0]?.id ?? "");
  };

  const handleSelectSection = (sectionId: string) => {
    const nextSection = selectedPage?.sections.find(
      (section) => section.id === sectionId,
    );

    setSelectedSectionId(sectionId);
    setSelectedElementId(nextSection?.elements[0]?.id ?? "");
  };

  const handleChangeElement = (
    updates: Partial<Pick<V2Element, "content" | "fontFamily">>,
  ) => {
    if (!selectedPageId || !selectedSectionId || !selectedElementId) {
      return;
    }
  
    setPages((currentPages) =>
      currentPages.map((page) => {
        if (page.id !== selectedPageId) {
          return page;
        }
  
        return {
          ...page,
          sections: page.sections.map((section) => {
            if (section.id !== selectedSectionId) {
              return section;
            }
  
            return {
              ...section,
              elements: section.elements.map((element) =>
                element.id === selectedElementId
                  ? { ...element, ...updates }
                  : element,
              ),
            };
          }),
        };
      }),
    );
  };

  return (
    <main className="flex min-h-screen flex-col bg-neutral-100">
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
        <div>
          <p className="text-xs font-semibold text-blue-600">NEXIA</p>
          <h1 className="text-lg font-bold text-neutral-900">Builder V2</h1>
        </div>

        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
          개발 버전
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        <PagePanel
          pages={pages}
          selectedPageId={selectedPageId}
          selectedSectionId={selectedSectionId}
          onSelectPage={handleSelectPage}
          onSelectSection={handleSelectSection}
        />

        <EditorPanel
          page={selectedPage}
          section={selectedSection}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
        />

        <ElementEditor
          element={selectedElement}
          onChange={handleChangeElement}
        />
      </div>
    </main>
  );
}
