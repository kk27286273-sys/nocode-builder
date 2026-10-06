import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface PortoneWebhookBody {
  imp_uid: string;
  merchant_uid: string;
  status: string; // "paid", "cancelled", "failed"
}

export async function POST(req: NextRequest) {
  try {
    const body: PortoneWebhookBody = await req.json();
    const { imp_uid, merchant_uid, status } = body;

    if (!imp_uid || !merchant_uid) {
      return NextResponse.json(
        { error: "imp_uid 및 merchant_uid는 필수입니다." },
        { status: 400 }
      );
    }

    // merchant_uid 네이밍 규칙: site_{siteId}_{timestamp} 형태 가정
    const siteIdMatch = merchant_uid.match(/^site_([a-zA-Z0-9-]+)_/);
    const siteId = siteIdMatch ? siteIdMatch[1] : null;

    // 1. 결제 이력 기록
    await supabaseAdmin.from("payments").insert([
      {
        site_id: siteId,
        imp_uid,
        merchant_uid,
        status,
        amount: 99000, // 기본 비즈니스 플랜 기준 (필요시 포트원 API 단건조회로 실 결제액 검증)
      },
    ]);

    // 2. 결제 성공(paid) 처리: 사이트 구독 활성화 및 만료일자 30일 연장
    if (status === "paid" && siteId) {
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);

      const { error: updateError } = await supabaseAdmin
        .from("sites")
        .update({
          subscription_status: "active",
          is_published: true,
          current_period_end: nextMonth.toISOString(),
        })
        .eq("id", siteId);

      if (updateError) throw updateError;
    }

    // 3. 결제 실패/취소 시: 구독 만료 처리
    if ((status === "failed" || status === "cancelled") && siteId) {
      await supabaseAdmin
        .from("sites")
        .update({
          subscription_status: "inactive",
        })
        .eq("id", siteId);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error("[PORTONE_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "웹훅 처리 실패" },
      { status: 500 }
    );
  }
}