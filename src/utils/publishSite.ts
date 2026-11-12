import { supabase } from '@/lib/supabase/client';
import { B2BTemplateData } from "@/data/templates";

interface PublishResponse {
  success: boolean;
  siteId?: string;
  error?: string;
}

export async function publishSite(
  templateData: B2BTemplateData,
  currentSiteId?: string | null
): Promise<PublishResponse> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: false, error: '개인 계정 로그인이 필요합니다.' };
    const res = await fetch("/api/sites/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({
        siteId: currentSiteId || null,
        templateData,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "발행 요청 처리에 실패했습니다.");
    }

    // 신규 생성된 경우 URL 파라미터에 siteId 즉시 반영 (새로고침 시 Update 모드로 유지)
    if (!currentSiteId && result.siteId && typeof window !== "undefined") {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("siteId", result.siteId);
      window.history.replaceState({}, "", newUrl.toString());
    }

    return { success: true, siteId: result.siteId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}