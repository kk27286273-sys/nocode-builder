// Generate a reviewable backfill for explicitly approved existing PUBLIC site IDs.
// Prints SQL only. Never connects to a database or runs the SQL.
const ids=process.argv.slice(2);
if (!ids.length || ids.some(id => id.length < 1 || id.length > 100 || /[^a-zA-Z0-9가-힣_-]/.test(id))) {
 console.error('Usage: node scripts/prepare-publications.cjs <approved-public-site-id> ...');process.exit(1);
}
console.log(`-- Review the exact IDs before applying in staging, then separately approved production.
BEGIN;
INSERT INTO public.site_publications(site_id,data,template_type,is_public)
SELECT id, data::jsonb, COALESCE(template_type,'corporate'), true
FROM public.sites
WHERE id::text IN (${ids.map(id=>`'${id}'`).join(',')}) AND data IS NOT NULL
ON CONFLICT(site_id) DO NOTHING;
COMMIT;`);
