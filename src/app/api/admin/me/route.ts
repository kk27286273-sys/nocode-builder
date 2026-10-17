import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "nexia_admin_session";

export async function GET() {
  const cookieStore = await cookies();

  const sessionValue = cookieStore.get(COOKIE_NAME)?.value;
  const accessToken = process.env.ADMIN_ACCESS_TOKEN;

  if (!sessionValue || !accessToken || sessionValue !== accessToken) {
    return NextResponse.json(
      { authenticated: false },
      {
        status: 401,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      role: "admin",
      user: {
        name: "TH소프트 총괄 관리자",
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}