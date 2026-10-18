// src/components/builder-v2/ElementEditor.tsx

"use client";

import type { V2Element } from "@/types/builder-v2";
import { V2_FONT_OPTIONS } from "./font-options";
import { useState } from "react";

interface ElementEditorProps {
  element?: V2Element;
  onChange: (
    updates: Partial<
      Pick<V2Element, "content" | "fontFamily" | "metadata" | "alt">
    >,
  ) => void;
}

export default function ElementEditor({
  element,
  onChange,
}: ElementEditorProps) {
  const [urlInput, setUrlInput] = useState("");

  if (!element) {
    return (
      <aside className="w-80 shrink-0 border-l border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-neutral-900">
          요소 편집
        </h2>

        <p className="mt-4 text-sm text-neutral-500">
          미리보기에서 요소를 선택하세요.
        </p>
      </aside>
    );
  }

  const isImageType = element.type === "image";
  const isVideoType = element.type === "video";
  const isMediaType = isImageType || isVideoType;

  const label =
    element.type === "heading"
      ? "제목"
      : element.type === "button"
        ? "버튼 문구"
        : element.type === "image"
          ? "이미지 URL"
          : element.type === "video"
            ? "비디오 URL"
            : "본문";

  const handleMetadataChange = (key: string, value: any) => {
    onChange({
      metadata: {
        ...element.metadata,
        [key]: value,
      },
    });
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange({
        content: urlInput.trim(),
      });
      setUrlInput("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onChange({
          content: dataUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-80 shrink-0 border-l border-neutral-200 bg-white p-5 overflow-y-auto max-h-screen">
      <h2 className="text-sm font-semibold text-neutral-900">
        요소 편집
      </h2>

      {/* ===== 미디어 타입 (이미지/비디오) ===== */}
      {isMediaType && (
        <>
          {/* 현재 URL 표시 */}
          {element.content && (
            <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="text-xs text-neutral-500 mb-2">현재 {isImageType ? "이미지" : "비디오"}:</p>
              {isImageType ? (
                <img
                  src={element.content}
                  alt={element.alt || "미리보기"}
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <video
                  src={element.content}
                  className="w-full h-32 object-cover rounded bg-neutral-900"
                  controls
                />
              )}
              <p className="mt-2 text-xs text-neutral-400 break-all">
                {element.content}
              </p>
            </div>
          )}

          {/* URL 입력 */}
          <label className="mt-4 block text-xs text-neutral-500">
            {isImageType ? "이미지" : "비디오"} URL
          </label>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={
                isImageType
                  ? "https://example.com/image.jpg"
                  : "https://example.com/video.mp4"
              }
              className="flex-1 rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddUrl}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              적용
            </button>
          </div>

          {/* 파일 업로드 */}
          <label className="mt-3 block text-xs text-neutral-500">
            또는 파일 업로드
          </label>
          <input
            type="file"
            accept={isImageType ? "image/*" : "video/*"}
            onChange={handleFileUpload}
            className="mt-2 w-full text-xs text-neutral-500 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-200"
          />

          {/* Alt 텍스트 (이미지만) */}
          {isImageType && (
            <>
              <label className="mt-3 block text-xs text-neutral-500">
                Alt 텍스트 (접근성)
              </label>
              <input
                type="text"
                value={element.alt || ""}
                onChange={(e) =>
                  onChange({
                    alt: e.target.value,
                  })
                }
                placeholder="이미지 설명"
                className="mt-2 w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
              />
            </>
          )}

          {/* 메타데이터 섹션 */}
          <div className="mt-4 border-t border-neutral-200 pt-4">
            <p className="text-xs font-semibold text-neutral-700">
              추가 정보
            </p>

            {/* 제목 */}
            <label className="mt-3 block text-xs text-neutral-500">
              제목
            </label>
            <input
              type="text"
              value={element.metadata?.title || ""}
              onChange={(e) =>
                handleMetadataChange("title", e.target.value)
              }
              placeholder="프로젝트 제목, 서비스명 등"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />

            {/* 설명 */}
            <label className="mt-3 block text-xs text-neutral-500">
              설명
            </label>
            <textarea
              value={element.metadata?.description || ""}
              onChange={(e) =>
                handleMetadataChange("description", e.target.value)
              }
              placeholder="상세 설명 (갤러리, 사례 등)"
              rows={2}
              className="mt-1 w-full resize-none rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />

            {/* 카테고리 (법률형용) */}
            <label className="mt-3 block text-xs text-neutral-500">
              카테고리
            </label>
            <input
              type="text"
              value={element.metadata?.category || ""}
              onChange={(e) =>
                handleMetadataChange("category", e.target.value)
              }
              placeholder="예: 세무, 노무, 법무"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />

            {/* 결과/성과 (법률형용) */}
            <label className="mt-3 block text-xs text-neutral-500">
              결과/성과
            </label>
            <input
              type="text"
              value={element.metadata?.result || ""}
              onChange={(e) =>
                handleMetadataChange("result", e.target.value)
              }
              placeholder="예: 절세액 3.2억 원"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />

            {/* 면적/평수 (인테리어형용) */}
            <label className="mt-3 block text-xs text-neutral-500">
              면적/평수
            </label>
            <input
              type="text"
              value={element.metadata?.area || ""}
              onChange={(e) =>
                handleMetadataChange("area", e.target.value)
              }
              placeholder="예: 84㎡"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />

            {/* 소요 기간 */}
            <label className="mt-3 block text-xs text-neutral-500">
              소요 기간/기간
            </label>
            <input
              type="text"
              value={element.metadata?.duration || ""}
              onChange={(e) =>
                handleMetadataChange("duration", e.target.value)
              }
              placeholder="예: 3개월"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />

            {/* 태그 */}
            <label className="mt-3 block text-xs text-neutral-500">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={
                element.metadata?.tags?.join(", ") || ""
              }
              onChange={(e) => {
                const tags = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                handleMetadataChange("tags", tags);
              }}
              placeholder="예: 풀리모델링, 거실, 모던"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />

            {/* Before 이미지 (인테리어형용) */}
            <label className="mt-3 block text-xs text-neutral-500">
              Before 이미지 URL (선택)
            </label>
            <input
              type="text"
              value={element.metadata?.beforeImage || ""}
              onChange={(e) =>
                handleMetadataChange("beforeImage", e.target.value)
              }
              placeholder="https://example.com/before.jpg"
              className="mt-1 w-full rounded-lg border border-neutral-300 p-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </>
      )}

      {/* ===== 텍스트 타입 (heading, text, button) ===== */}
      {!isMediaType && (
        <>
          <label
            htmlFor="element-content"
            className="mt-4 block text-xs text-neutral-500"
          >
            {label}
          </label>

          <textarea
            id="element-content"
            value={element.content}
            onChange={(event) =>
              onChange({
                content: event.target.value,
              })
            }
            rows={5}
            className="mt-2 w-full resize-none rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-blue-500"
          />

          <label
            htmlFor="element-font"
            className="mt-5 block text-xs text-neutral-500"
          >
            글꼴
          </label>

          <select
            id="element-font"
            value={element.fontFamily ?? "system"}
            onChange={(event) =>
              onChange({
                fontFamily: event.target
                  .value as NonNullable<V2Element["fontFamily"]>,
              })
            }
            className="mt-2 w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm outline-none focus:border-blue-500"
          >
            {V2_FONT_OPTIONS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>

          <p className="mt-3 text-xs text-neutral-400">
            입력한 내용과 글꼴은 현재 화면에 즉시 반영됩니다.
          </p>
        </>
      )}
    </aside>
  );
}