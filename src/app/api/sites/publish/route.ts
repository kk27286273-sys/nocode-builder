import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { B2BTemplateData } from "@/data/templates";

interface PublishPayload {
  siteId?: string | null;
  templateData: B2BTemplateData;
  subdomain?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PublishPayload = await req.json();
    const { siteId, templateData, subdomain } = body;

    const title = templateData.hero?.title?.trim() || templateData.company?.name?.trim();
    if (!title) {
      return NextResponse.json(
        { error: "사이트 제목 또는 기업명을 입력해야 합니다." },
        { status: 400 }
      );
    }

    const record = {
      title,
      content: templateData,
      subdomain: subdomain || null,
      updated_at: new Date().toISOString(),
    };

    let result;

    if (siteId) {
      // 1. 기존 사이트 갱신 (UPDATE)
      const { data, error } = await supabaseAdmin
        .from("sites")
        .update(record)
        .eq("id", siteId)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // 2. 신규 사이트 등록 (INSERT)
      const { data, error } = await supabaseAdmin
        .from("sites")
        .insert([{ ...record, is_published: true }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      siteId: result.id,
      data: result,
    });
  } catch (error: any) {
    console.error("[PUBLISH_API_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "발행 처리 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}