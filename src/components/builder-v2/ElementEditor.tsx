"use client";

import type { V2Element } from "@/types/builder-v2";
import { V2_FONT_OPTIONS } from "./font-options";

interface ElementEditorProps {
  element?: V2Element;
  onChange: (
    updates: Partial<Pick<V2Element, "content" | "fontFamily">>,
  ) => void;
}

export default function ElementEditor({
  element,
  onChange,
}: ElementEditorProps) {
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

  const label =
    element.type === "heading"
      ? "제목"
      : element.type === "button"
        ? "버튼 문구"
        : "본문";

  return (
    <aside className="w-80 shrink-0 border-l border-neutral-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-neutral-900">
        요소 편집
      </h2>

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
    </aside>
  );
}