import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { V2Page } from "@/types/builder-v2";

const COOKIE_NAME = "nexia_admin_session";

async function isAdminRequest(): Promise<boolean> {
  const accessToken = process.env.ADMIN_ACCESS_TOKEN;

  if (!accessToken) {
    return false;
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(COOKIE_NAME)?.value;

  return sessionValue === accessToken;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isV2Pages(value: unknown): value is V2Page[] {
  return (
    Array.isArray(value) &&
    value.every(
      (page) =>
        isRecord(page) &&
        typeof page.id === "string" &&
        typeof page.name === "string" &&
        typeof page.slug === "string" &&
        Array.isArray(page.sections),
    )
  );
}

export async function GET(request: Request) {
  const authenticated = await isAdminRequest();

  if (!authenticated) {
    return NextResponse.json(
      { error: "관리자 인증이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");

    if (!siteId || !siteId.trim()) {
      return NextResponse.json(
        { error: "siteId가 필요합니다." },
        { status: 400 },
      );
    }

    const supabaseAdmin = createAdminClient();

    const { data, error } = await supabaseAdmin
      .from("sites")
      .select("id, data")
      .eq("id", siteId)
      .single();

    if (error) {
      console.error("V2 데이터 조회 오류:", error);

      return NextResponse.json(
        {
          error: "사이트 데이터를 조회하지 못했습니다.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    const siteData = isRecord(data?.data) ? data.data : {};

    const builderV2 = isRecord(siteData.builderV2)
      ? siteData.builderV2
      : {};

    const pages = Array.isArray(builderV2.pages)
      ? builderV2.pages
      : null;

    return NextResponse.json(
      {
        siteId: data.id,
        pages,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("V2 데이터 GET 오류:", error);

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const authenticated = await isAdminRequest();

  if (!authenticated) {
    return NextResponse.json(
      { error: "관리자 인증이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const siteId = body?.siteId;
    const pages = body?.pages;

    if (typeof siteId !== "string" || !siteId.trim()) {
      return NextResponse.json(
        { error: "siteId가 필요합니다." },
        { status: 400 },
      );
    }

    if (!isV2Pages(pages)) {
      return NextResponse.json(
        { error: "올바른 V2 페이지 데이터가 아닙니다." },
        { status: 400 },
      );
    }

    const supabaseAdmin = createAdminClient();

    const { data: site, error: selectError } = await supabaseAdmin
      .from("sites")
      .select("id, data")
      .eq("id", siteId)
      .single();

    if (selectError || !site) {
      console.error("사이트 조회 오류:", selectError);

      return NextResponse.json(
        { error: "사이트를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const currentData = isRecord(site.data) ? site.data : {};

    const nextData = {
      ...currentData,
      builderV2: {
        pages,
      },
    };

    const { error: updateError } = await supabaseAdmin
      .from("sites")
      .update({
        data: nextData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", siteId);

    if (updateError) {
      console.error("V2 데이터 저장 오류:", updateError);

      return NextResponse.json(
        {
          error: "V2 데이터를 저장하지 못했습니다.",
          details: updateError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        siteId,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("V2 데이터 PUT 오류:", error);

    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}