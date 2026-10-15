"use client";

import { useState } from "react";
import type { V2Page } from "@/types/builder-v2";
import PagePanel from "./PagePanel";
import EditorPanel from "./EditorPanel";

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
  const [selectedPageId, setSelectedPageId] = useState(initialPages[0].id);
  const [selectedSectionId, setSelectedSectionId] = useState(
    initialPages[0].sections[0].id,
  );

  const selectedPage = initialPages.find(
    (page) => page.id === selectedPageId,
  );

  const selectedSection = selectedPage?.sections.find(
    (section) => section.id === selectedSectionId,
  );

  const handleSelectPage = (pageId: string) => {
    const nextPage = initialPages.find((page) => page.id === pageId);

    setSelectedPageId(pageId);
    setSelectedSectionId(nextPage?.sections[0]?.id ?? "");
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
          pages={initialPages}
          selectedPageId={selectedPageId}
          selectedSectionId={selectedSectionId}
          onSelectPage={handleSelectPage}
          onSelectSection={setSelectedSectionId}
        />

        <EditorPanel page={selectedPage} section={selectedSection} />
      </div>
    </main>
  );
}
