import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { siteId, domain } = await req.json();

    if (!siteId || !domain) {
      return NextResponse.json(
        { error: "siteId와 도메인은 필수 항목입니다." },
        { status: 400 }
      );
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, "");

    // Supabase sites 테이블에 도메인 매핑 저장
    const { error: dbError } = await supabaseAdmin
      .from("sites")
      .update({ custom_domain: cleanDomain })
      .eq("id", siteId);

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      domain: cleanDomain,
      cnameTarget: "cname.vercel-dns.com",
      message: "도메인이 성공적으로 등록되었습니다. DNS CNAME을 연결해 주세요.",
    });
  } catch (err: any) {
    console.error("[DOMAIN_SAVE_ERROR]", err);
    return NextResponse.json(
      { error: err.message || "도메인 저장 중 오류 발생" },
      { status: 500 }
    );
  }
}