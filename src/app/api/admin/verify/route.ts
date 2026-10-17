import { NextResponse } from "next/server";

const COOKIE_NAME = "nexia_admin_session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body?.password ?? "");

    const adminPassword = process.env.ADMIN_PASSWORD;
    const accessToken = process.env.ADMIN_ACCESS_TOKEN;

    if (!adminPassword || !accessToken) {
      console.error("관리자 환경변수 누락", {
        hasAdminPassword: Boolean(adminPassword),
        hasAccessToken: Boolean(accessToken),
      });

      return NextResponse.json(
        { error: "관리자 인증 환경변수가 설정되지 않았습니다." },
        { status: 500 },
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "관리자 비밀번호가 일치하지 않습니다." },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        authenticated: true,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );

    response.cookies.set({
      name: COOKIE_NAME,
      value: accessToken,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("관리자 로그인 오류:", error);

    return NextResponse.json(
      { error: "로그인 요청을 처리하지 못했습니다." },
      { status: 400 },
    );
  }
}