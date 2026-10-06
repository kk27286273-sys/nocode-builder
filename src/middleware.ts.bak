import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|dashboard).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const currentHost = hostname.replace(/:\d+$/, "");

  // 로컬 환경이나 vercel 기본 주소는 통과
  if (
    currentHost.includes("localhost") ||
    currentHost.includes("vercel.app")
  ) {
    return NextResponse.next();
  }

  // 고객 커스텀 도메인 유입 시 해당 사이트 화면으로 연결
  try {
    const { data: site } = await supabase
      .from("sites")
      .select("id")
      .eq("custom_domain", currentHost)
      .eq("is_published", true)
      .maybeSingle();

    if (site && site.id) {
      return NextResponse.rewrite(new URL(`/p/${site.id}`, req.url));
    }
  } catch (error) {
    console.error("[MIDDLEWARE_ERROR]", error);
  }

  return NextResponse.next();
}