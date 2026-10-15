import type { V2Page, V2Section } from "@/types/builder-v2";

interface EditorPanelProps {
  page?: V2Page;
  section?: V2Section;
  selectedElementId: string;
  onSelectElement: (elementId: string) => void;
}

export default function EditorPanel({
  page,
  section,
  selectedElementId,
  onSelectElement,
}: EditorPanelProps) {
  return (
    <section className="min-w-0 flex-1 overflow-auto bg-neutral-100 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <p className="text-sm text-neutral-500">
            {page?.name ?? "페이지 없음"}
          </p>

          <h2 className="text-2xl font-bold text-neutral-900">
            {section?.name ?? "섹션을 선택하세요"}
          </h2>
        </div>

        <div className="min-h-96 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          {section?.elements.length ? (
            <div className="space-y-4">
              {section.elements.map((element) => {
                const isSelected = selectedElementId === element.id;

                const elementClassName = [
                  "cursor-pointer rounded-lg border-2 p-2 transition",
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-transparent hover:border-blue-200",
                ].join(" ");

                return (
                  <div
                    key={element.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectElement(element.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        onSelectElement(element.id);
                      }
                    }}
                    className={elementClassName}
                  >
                    {element.type === "heading" && (
                      <h3 className="text-3xl font-bold">
                        {element.content}
                      </h3>
                    )}

                    {element.type === "button" && (
                      <span className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-white">
                        {element.content}
                      </span>
                    )}

                    {element.type !== "heading" &&
                      element.type !== "button" && (
                        <p className="text-neutral-600">
                          {element.content}
                        </p>
                      )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-500">
              이 섹션에는 아직 요소가 없습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
