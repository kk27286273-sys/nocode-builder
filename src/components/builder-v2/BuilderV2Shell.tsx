"use client";

import { useEffect, useState } from "react";
import type { V2Element, V2Page, V2Section } from "@/types/builder-v2";
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
            content:
              "Nexia Builder V2에서 쉽고 빠르게 홈페이지를 만드세요.",
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
  const [siteId, setSiteId] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [selectedPageId, setSelectedPageId] = useState(
    initialPages[0]?.id ?? "",
  );

  const [selectedSectionId, setSelectedSectionId] = useState(
    initialPages[0]?.sections[0]?.id ?? "",
  );

  const [selectedElementId, setSelectedElementId] = useState(
    initialPages[0]?.sections[0]?.elements[0]?.id ?? "",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentSiteId = params.get("siteId")?.trim() ?? "";

    setSiteId(currentSiteId);

    if (!currentSiteId) {
      setIsLoading(false);
      setLoadError("URL에 siteId가 없습니다.");
      return;
    }

    const loadBuilderData = async () => {
      try {
        const response = await fetch(
          `/api/builder-data?siteId=${encodeURIComponent(currentSiteId)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result?.error ?? "사이트 데이터를 불러오지 못했습니다.",
          );
        }

        const savedPages = result?.pages;

        if (Array.isArray(savedPages) && savedPages.length > 0) {
          setPages(savedPages);

          const firstPage = savedPages[0];
          const firstSection = firstPage?.sections?.[0];
          const firstElement = firstSection?.elements?.[0];

          setSelectedPageId(firstPage?.id ?? "");
          setSelectedSectionId(firstSection?.id ?? "");
          setSelectedElementId(firstElement?.id ?? "");
        }
      } catch (error) {
        console.error("V2 사이트 데이터 불러오기 오류:", error);

        setLoadError(
          error instanceof Error
            ? error.message
            : "사이트 데이터를 불러오지 못했습니다.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadBuilderData();
  }, []);

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
    const nextElement = nextSection?.elements[0];

    setSelectedPageId(pageId);
    setSelectedSectionId(nextSection?.id ?? "");
    setSelectedElementId(nextElement?.id ?? "");
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

    setSaveMessage("저장되지 않은 변경사항이 있습니다.");

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

  const handleAddSection = () => {
    if (!selectedPageId) return;

    const newSectionId = `section-${Date.now()}`;
    const newSection: V2Section = {
      id: newSectionId,
      name: "새 섹션",
      elements: [
        {
          id: `element-${Date.now()}`,
          type: "heading",
          content: "제목을 입력하세요",
        },
      ],
    };

    setSaveMessage("저장되지 않은 변경사항이 있습니다.");

    setPages((currentPages) =>
      currentPages.map((page) => {
        if (page.id !== selectedPageId) {
          return page;
        }

        return {
          ...page,
          sections: [...page.sections, newSection],
        };
      }),
    );

    setSelectedSectionId(newSectionId);
    setSelectedElementId(newSection.elements[0]?.id ?? "");
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedPageId || !confirm("이 섹션을 삭제하시겠습니까?")) {
      return;
    }

    setSaveMessage("저장되지 않은 변경사항이 있습니다.");

    setPages((currentPages) =>
      currentPages.map((page) => {
        if (page.id !== selectedPageId) {
          return page;
        }

        const updatedSections = page.sections.filter(
          (section) => section.id !== sectionId,
        );

        if (selectedSectionId === sectionId) {
          const nextSection = updatedSections[0];
          setSelectedSectionId(nextSection?.id ?? "");
          setSelectedElementId(nextSection?.elements[0]?.id ?? "");
        }

        return {
          ...page,
          sections: updatedSections,
        };
      }),
    );
  };

  const handleDuplicateSection = (sectionId: string) => {
    if (!selectedPageId) return;

    const sectionToDuplicate = selectedPage?.sections.find(
      (section) => section.id === sectionId,
    );

    if (!sectionToDuplicate) return;

    const newSectionId = `section-${Date.now()}`;
    const newSection: V2Section = {
      ...sectionToDuplicate,
      id: newSectionId,
      elements: sectionToDuplicate.elements.map((element, idx) => ({
        ...element,
        id: `element-${Date.now()}-${idx}`,
      })),
    };

    setSaveMessage("저장되지 않은 변경사항이 있습니다.");

    setPages((currentPages) =>
      currentPages.map((page) => {
        if (page.id !== selectedPageId) {
          return page;
        }

        const sectionIndex = page.sections.findIndex(
          (section) => section.id === sectionId,
        );

        const updatedSections = [...page.sections];
        updatedSections.splice(sectionIndex + 1, 0, newSection);

        return {
          ...page,
          sections: updatedSections,
        };
      }),
    );

    setSelectedSectionId(newSectionId);
    setSelectedElementId(newSection.elements[0]?.id ?? "");
  };

  const handleMoveSection = (sectionId: string, direction: "up" | "down") => {
    if (!selectedPageId || !selectedPage) return;

    const sectionIndex = selectedPage.sections.findIndex(
      (section) => section.id === sectionId,
    );

    if (sectionIndex === -1) return;

    const isFirst = sectionIndex === 0;
    const isLast = sectionIndex === selectedPage.sections.length - 1;

    if ((direction === "up" && isFirst) || (direction === "down" && isLast)) {
      return;
    }

    setSaveMessage("저장되지 않은 변경사항이 있습니다.");

    setPages((currentPages) =>
      currentPages.map((page) => {
        if (page.id !== selectedPageId) {
          return page;
        }

        const updatedSections = [...page.sections];
        const targetIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1;

        [updatedSections[sectionIndex], updatedSections[targetIndex]] = [
          updatedSections[targetIndex],
          updatedSections[sectionIndex],
        ];

        return {
          ...page,
          sections: updatedSections,
        };
      }),
    );
  };

  const handleSave = async () => {