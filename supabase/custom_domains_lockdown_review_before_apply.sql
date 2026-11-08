-- REVIEW ONLY. Apply during the approved cutover AFTER replacing direct browser
-- sites reads/writes with the new application. Before this phase, security is incomplete.
-- Capture existing grants, column grants, RLS, views and functions before running.
BEGIN;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY sites_no_browser_access ON public.sites AS RESTRICTIVE
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);
REVOKE ALL ON public.sites FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.sites TO service_role;
COMMIT;
