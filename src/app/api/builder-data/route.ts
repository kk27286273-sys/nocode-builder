import { GET as list } from '../manage/sites/route';
export async function GET(request: Request) {
  const response = await list(request); if (!response.ok) return response;
  const body = await response.json();
  if (!body.data?.[0]) return new Response(null, { status: 404 });
  return Response.json({ data: body.data[0] }, { headers: { 'Cache-Control': 'private, no-store' } });
}
