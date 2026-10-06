"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { B2BTemplateData } from "@/data/templates";

const STORAGE_KEY_PREFIX = "b2b_builder_draft_";

export function useAutoSave(
  siteId: string | null,
  currentData: B2BTemplateData,
  onRestore: (savedData: B2BTemplateData) => void
) {
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const isInitialMount = useRef(true);
  const storageKey = `${STORAGE_KEY_PREFIX}${siteId || "new"}`;

  // 1. 초기 마운트 시 LocalStorage 데이터 복구 확인
  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const userConfirm = window.confirm(
            "작성 중이던 임시 저장 데이터가 있습니다. 복구하시겠습니까?"
          );
          if (userConfirm) {
            onRestore(parsed);
          } else {
            localStorage.removeItem(storageKey);
          }
        }
      } catch (err) {
        console.error("임시 저장 데이터 파싱 실패", err);
      }
    }
  }, [storageKey]);

  // 2. 디바운스 자동 저장 (500ms)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setIsDirty(true);
    const handler = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(currentData));
        setLastSavedTime(new Date());
      } catch (err) {
        console.warn("LocalStorage 저장 용량 초과 또는 쓰기 오류", err);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [currentData, storageKey]);

  // 3. 브라우저 이탈 방지 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // 4. 발행 성공 시 임시 캐시 클리어
  const clearDraft = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
      setIsDirty(false);
    }
  }, [storageKey]);

  return { isDirty, lastSavedTime, clearDraft };
}