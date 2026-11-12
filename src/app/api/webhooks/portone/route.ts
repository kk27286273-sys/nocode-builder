// Legacy endpoint used unverified payloads and columns absent from Production.
// Toss billing routes are independent and unchanged by this closure.
export async function POST() {
  return Response.json({ error: '검증되지 않은 결제 알림은 처리하지 않습니다.' }, { status: 503 });
}
