import type { V2Page, V2Section } from "@/types/builder-v2";

interface EditorPanelProps {
  page?: V2Page;
  section?: V2Section;
}

export default function EditorPanel({ page, section }: EditorPanelProps) {
  return (
    <section className="flex-1 overflow-auto bg-neutral-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <p className="text-sm text-neutral-500">{page?.name ?? "페이지 없음"}</p>
          <h2 className="text-2xl font-bold text-neutral-900">
            {section?.name ?? "섹션을 선택하세요"}
          </h2>
        </div>

        <div className="min-h-96 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          {section?.elements.length ? (
            <div className="space-y-4">
              {section.elements.map((element) => {
                if (element.type === "heading") {
                  return (
                    <h3 key={element.id} className="text-3xl font-bold">
                      {element.content}
                    </h3>
                  );
                }

                if (element.type === "button") {
                  return (
                    <button
                      key={element.id}
                      type="button"
                      className="rounded-lg bg-blue-600 px-5 py-3 text-white"
                    >
                      {element.content}
                    </button>
                  );
                }

                return (
                  <p key={element.id} className="text-neutral-600">
                    {element.content}
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-500">이 섹션에는 아직 요소가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
