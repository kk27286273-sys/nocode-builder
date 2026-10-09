"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: any) => (
  <div className="space-y-1">
    <label className="text-[11px] text-slate-500 font-medium">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
    />
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  h = "h-20",
}: any) => (
  <div className="space-y-1">
    <label className="text-[11px] text-slate-500 font-medium">{label}</label>
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full p-2 border border-slate-200 rounded text-xs ${h} resize-y outline-none focus:ring-1 focus:ring-blue-500 bg-white`}
    />
  </div>
);

interface EditorSidebarProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  siteId?: string | null;
}

const defaultSolutionCard = () => ({
  title: "",
  description: "",
  detailContent: "",
});

const defaultEsgGoal = () => ({
  label: "",
  title: "",
  content: "",
});

export default function EditorSidebar({
  data,
  setData,
  siteId,
}: EditorSidebarProps) {
  const [activeSection, setActiveSection] = useState("main");
  const [isPublishing, setIsPublishing] = useState(false);

  const updateDeep = (path: string, value: any) => {
    const keys = path.split(".");

    setData((prev: any) => {
      const next = { ...(prev || {}) };
      let source: any = prev || {};
      let target: any = next;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const sourceValue = source?.[key];

        target[key] = Array.isArray(sourceValue)
          ? [...sourceValue]
          : { ...(sourceValue || {}) };

        source = sourceValue || {};
        target = target[key];
      }

      target[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const getValue = (path: string) =>
    path.split(".").reduce((value: any, key) => value?.[key], data);

  const getArray = (path: string): any[] => {
    const value = getValue(path);
    return Array.isArray(value) ? value : [];
  };

  const addArrayItem = (path: string, item: any) => {
    updateDeep(path, [...getArray(path), item]);
  };

  const removeArrayItem = (path: string, index: number) => {
    updateDeep(
      path,
      getArray(path).filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handlePublish = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!siteId) {
      alert("사이트 ID가 없습니다.");
      return;
    }

    setIsPublishing(true);

    try {
      const { error } = await supabase
        .from("sites")
        .update({
          data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", siteId);

      if (error) throw error;

      alert("✅ 성공적으로 발행되었습니다!");
    } catch (error: any) {
      alert("발행 실패: " + (error?.message || "알 수 없는 오류"));
    } finally {
      setIsPublishing(false);
    }
  };

  const sections = [
    { id: "main", label: "메인 화면" },
    { id: "corporateInfo", label: "회사 소개" },
    { id: "solutions", label: "사업 소개" },
    { id: "sustainability", label: "지속가능경영" },
    { id: "pr", label: "홍보 센터" },
    { id: "recruit", label: "인재 경영" },
    { id: "cs", label: "고객 센터" },
    { id: "footer", label: "하단 정보" },
  ];

  return (
    <div className="flex w-full h-full bg-white overflow-hidden">
      <div className="w-48 bg-slate-100 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-black text-slate-800 text-sm italic">
            NEXIA Builder
          </h2>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                activeSection === section.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-black transition disabled:opacity-50"
          >
            {isPublishing ? "발행 중..." : "발행하기"}
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0 overflow-y-auto p-6 bg-slate-50">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">
              {sections.find((section) => section.id === activeSection)?.label} 설정
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              ID: {siteId || "없음"}
            </span>
          </div>

          {activeSection === "main" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="font-bold text-xs text-blue-600 mb-2">
                메인 히어로 설정
              </div>

              <InputField
                label="메인 배지"
                value={getValue("solutionMain.badge")}
                onChange={(value: string) =>
                  updateDeep("solutionMain.badge", value)
                }
              />
              <InputField
                label="메인 타이틀"
                value={getValue("solutionMain.title")}
                onChange={(value: string) =>
                  updateDeep("solutionMain.title", value)
                }
              />
              <TextAreaField
                label="메인 서브 타이틀"
                value={
                  getValue("solutionMain.subtitle") ??
                  getValue("solutionMain.description")
                }
                onChange={(value: string) =>
                  updateDeep("solutionMain.subtitle", value)
                }
                h="h-24"
              />
              <InputField
                label="CTA 버튼 문구"
                value={getValue("solutionMain.ctaText")}
                onChange={(value: string) =>
                  updateDeep("solutionMain.ctaText", value)
                }
              />
            </div>
          )}

          {activeSection === "corporateInfo" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="font-bold text-xs text-blue-600 mb-2">
                회사 소개
              </div>

              <InputField
                label="회사명"
                value={getValue("company.name")}
                onChange={(value: string) => updateDeep("company.name", value)}
              />
              <InputField
                label="회사 로고 URL"
                value={getValue("company.logoUrl")}
                onChange={(value: string) =>
                  updateDeep("company.logoUrl", value)
                }
              />
              <TextAreaField
                label="회사 소개글"
                value={getValue("corporateInfo.about")}
                onChange={(value: string) =>
                  updateDeep("corporateInfo.about", value)
                }
                h="h-32"
              />
              <InputField
                label="핵심 비전"
                value={getValue("corporateInfo.vision")}
                onChange={(value: string) =>
                  updateDeep("corporateInfo.vision", value)
                }
              />
              <TextAreaField
                label="한 마디"
                value={getValue("corporateInfo.ceoMessage")}
                onChange={(value: string) =>
                  updateDeep("corporateInfo.ceoMessage", value)
                }
                h="h-24"
              />
              <InputField
                label="대표자명"
                value={getValue("corporateInfo.representativeName")}
                onChange={(value: string) =>
                  updateDeep("corporateInfo.representativeName", value)
                }
              />
              <InputField
                label="설립 연도"
                value={getValue("corporateInfo.since")}
                onChange={(value: string) =>
                  updateDeep("corporateInfo.since", value)
                }
              />
            </div>
          )}

          {activeSection === "solutions" && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="font-bold text-xs text-blue-600">
                  사업 소개 상단
                </div>

                <InputField
                  label="상단 제목"
                  value={getValue("solutionMain.title")}
                  onChange={(value: string) =>
                    updateDeep("solutionMain.title", value)
                  }
                />
                <TextAreaField
                  label="상단 요약"
                  value={getValue("solutionMain.description")}
                  onChange={(value: string) =>
                    updateDeep("solutionMain.description", value)
                  }
                />
                <TextAreaField
                  label="사업 상세"
                  value={getValue("solutionMain.detailContent")}
                  onChange={(value: string) =>
                    updateDeep("solutionMain.detailContent", value)
                  }
                  h="h-32"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-xs text-slate-600">
                    하단 카드칸
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem("solutions.list", defaultSolutionCard())
                    }
                    className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    + 카드 추가
                  </button>
                </div>

                {getArray("solutions.list").map((solution: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => removeArrayItem("solutions.list", index)}
                      aria-label={`솔루션 ${index + 1} 삭제`}
                      className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 text-xs"
                    >
                      ✕
                    </button>

                    <div className="font-bold text-[11px] text-slate-400">
                      카드 {index + 1}
                    </div>
                    <InputField
                      label="카드 제목"
                      value={getValue(`solutions.list.${index}.title`)}
                      onChange={(value: string) =>
                        updateDeep(`solutions.list.${index}.title`, value)
                      }
                    />
                    <TextAreaField
                      label="카드 요약"
                      value={getValue(`solutions.list.${index}.description`)}
                      onChange={(value: string) =>
                        updateDeep(`solutions.list.${index}.description`, value)
                      }
                    />
                    <TextAreaField
                      label="카드 상세 내용"
                      value={getValue(`solutions.list.${index}.detailContent`)}
                      onChange={(value: string) =>
                        updateDeep(
                          `solutions.list.${index}.detailContent`,
                          value
                        )
                      }
                      h="h-32"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "sustainability" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="font-bold text-xs text-blue-600 mb-2">
                지속가능경영
              </div>

              <InputField
                label="ESG 상단 제목"
                value={getValue("esg.mainTitle")}
                onChange={(value: string) => updateDeep("esg.mainTitle", value)}
              />
              <TextAreaField
                label="ESG 서브제목"
                value={getValue("esg.mainDesc")}
                onChange={(value: string) => updateDeep("esg.mainDesc", value)}
              />

              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="p-4 border border-slate-200 rounded-lg space-y-3"
                >
                  <div className="font-bold text-xs text-slate-600">
                    목표 {index + 1}
                  </div>
                  <InputField
                    label={`목표 ${index + 1} 영문명`}
                    value={getValue(`esg.goals.${index}.label`)}
                    onChange={(value: string) =>
                      updateDeep(`esg.goals.${index}.label`, value)
                    }
                  />
                  <InputField
                    label={`목표 ${index + 1} 제목`}
                    value={getValue(`esg.goals.${index}.title`)}
                    onChange={(value: string) =>
                      updateDeep(`esg.goals.${index}.title`, value)
                    }
                  />
                  <TextAreaField
                    label={`목표 ${index + 1} 내용`}
                    value={getValue(`esg.goals.${index}.content`)}
                    onChange={(value: string) =>
                      updateDeep(`esg.goals.${index}.content`, value)
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {activeSection === "pr" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="font-bold text-xs text-blue-600 mb-2">
                홍보 센터
              </div>
              <TextAreaField
                label="홍보 문구"
                value={getValue("pr.content")}
                onChange={(value: string) => updateDeep("pr.content", value)}
                h="h-40"
              />
              <InputField
                label="홍보 이미지 URL"
                value={getValue("pr.imageUrl")}
                onChange={(value: string) => updateDeep("pr.imageUrl", value)}
              />
            </div>
          )}

          {activeSection === "recruit" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="font-bold text-xs text-blue-600 mb-2">
                인재 경영
              </div>
              <TextAreaField
                label="인재상"
                value={getValue("hr.talent")}
                onChange={(value: string) => updateDeep("hr.talent", value)}
                h="h-32"
              />
              <TextAreaField
                label="복지 및 혜택"
                value={getValue("hr.benefitInfo")}
                onChange={(value: string) =>
                  updateDeep("hr.benefitInfo", value)
                }
                h="h-32"
              />
              <TextAreaField
                label="채용 절차 안내"
                value={getValue("hr.process")}
                onChange={(value: string) => updateDeep("hr.process", value)}
                h="h-32"
              />
            </div>
          )}

          {activeSection === "cs" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="font-bold text-xs text-blue-600 mb-2">
                고객 센터
              </div>
              <InputField
                label="고객센터 전화번호"
                value={getValue("cs.phone")}
                onChange={(value: string) => updateDeep("cs.phone", value)}
              />
              <InputField
                label="이메일"
                value={getValue("cs.email")}
                onChange={(value: string) => updateDeep("cs.email", value)}
              />
              <TextAreaField
                label="공시 정보 / 공지사항"
                value={getValue("public.notice")}
                onChange={(value: string) =>
                  updateDeep("public.notice", value)
                }
                h="h-32"
              />
            </div>
          )}

          {activeSection === "footer" && (
            <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="font-bold text-xs text-blue-600 mb-2">
                하단 정보
              </div>
              <InputField
                label="사업자 등록번호"
                value={getValue("footer.bizNumber")}
                onChange={(value: string) =>
                  updateDeep("footer.bizNumber", value)
                }
              />
              <InputField
                label="대표자명"
                value={getValue("footer.ceoName")}
                onChange={(value: string) => updateDeep("footer.ceoName", value)}
              />
              <InputField
                label="주소"
                value={getValue("footer.address")}
                onChange={(value: string) => updateDeep("footer.address", value)}
              />
              <InputField
                label="Copyright 문구"
                value={getValue("footer.copyright")}
                onChange={(value: string) =>
                  updateDeep("footer.copyright", value)
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}