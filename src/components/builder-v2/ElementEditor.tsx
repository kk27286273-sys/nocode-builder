"use client";

import type { V2Element } from "@/types/builder-v2";

interface ElementEditorProps {
  element?: V2Element;
  onChange: (content: string) => void;
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

      <p className="mt-4 text-xs text-neutral-500">{label}</p>

      <textarea
        value={element.content}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="mt-2 w-full resize-none rounded-lg border border-neutral-300 p-3 text-sm outline-none focus:border-blue-500"
      />

      <p className="mt-2 text-xs text-neutral-400">
        입력한 내용은 현재 화면에 즉시 반영됩니다.
      </p>
    </aside>
  );
}