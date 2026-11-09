export function POST() {
  return Response.json({ error: 'organization_unavailable' }, { status: 403 });
}
