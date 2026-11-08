-- REVIEW ONLY. No automatic backfill, publication, deployment or production execution.
-- Run first on a staging COPY of the actual schema. sites.id may be text or UUID.
BEGIN;
DO $ddl$
DECLARE id_type text;
BEGIN
  SELECT format_type(atttypid, atttypmod) INTO id_type FROM pg_attribute
    WHERE attrelid = 'public.sites'::regclass AND attname = 'id' AND NOT attisdropped;
  IF id_type IS NULL THEN RAISE EXCEPTION 'sites.id is required'; END IF;
  EXECUTE format('CREATE TABLE public.site_publications (
    site_id %s PRIMARY KEY REFERENCES public.sites(id) ON DELETE CASCADE,
    data jsonb NOT NULL, template_type text NOT NULL,
    is_public boolean NOT NULL DEFAULT false,
    revision bigint NOT NULL DEFAULT 1, published_at timestamptz NOT NULL DEFAULT now()
  )', id_type);
  EXECUTE format('CREATE TABLE public.site_domains (
    domain text PRIMARY KEY,
    site_id %s NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT ''pending'' CHECK (status IN (''pending'',''verified'',''active'',''disabled'')),
    verification_token text NOT NULL, verified_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (domain = lower(domain) AND length(domain) <= 253),
    CHECK (status <> ''active'' OR verified_at IS NOT NULL)
  )', id_type);
END $ddl$;
CREATE INDEX site_domains_site_idx ON public.site_domains(site_id);
ALTER TABLE public.site_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_publications ENABLE ROW LEVEL SECURITY;
-- Preparation phase deliberately leaves existing sites browser access unchanged.
-- Apply the separate lockdown script ONLY during the approved application cutover.
REVOKE ALL ON public.site_domains, public.site_publications FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.site_domains, public.site_publications, public.sites TO service_role;

CREATE FUNCTION public.manage_builder_site(p_site_id text, p_action text, p_data jsonb, p_template text)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp AS $fn$
DECLARE current_site public.sites%ROWTYPE;
BEGIN
  IF p_site_id IS NULL OR length(p_site_id) NOT BETWEEN 1 AND 100
    OR p_site_id COLLATE "C" ~ '[^a-zA-Z0-9가-힣_-]' OR p_action NOT IN ('create','save','publish','unpublish','delete')
    OR p_template NOT IN ('corporate','interior','onepage','fitness','legal') THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_site_id, 0));
  IF p_action = 'create' THEN
    INSERT INTO public.sites (id, name, template_type, updated_at)
      SELECT r.id, p_site_id, p_template, now()
      FROM jsonb_populate_record(NULL::public.sites, jsonb_build_object('id',p_site_id)) r;
    RETURN jsonb_build_object('siteId',p_site_id);
  END IF;
  SELECT * INTO current_site FROM public.sites WHERE id::text = p_site_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Site not found'; END IF;
  IF p_action = 'delete' THEN
    DELETE FROM public.sites WHERE id = current_site.id;
  ELSIF p_action = 'unpublish' THEN
    UPDATE public.site_publications SET is_public = false, revision = revision + 1 WHERE site_id = current_site.id;
  ELSE
    IF p_data IS NULL OR jsonb_typeof(p_data) <> 'object' OR octet_length(p_data::text) > 2000000 THEN
      RAISE EXCEPTION 'Invalid site data';
    END IF;
    p_data := p_data || jsonb_build_object('templateType', p_template);
    UPDATE public.sites SET data = p_data, template_type = p_template, updated_at = now() WHERE id = current_site.id;
    IF p_action = 'publish' THEN
      INSERT INTO public.site_publications (site_id,data,template_type,is_public)
        VALUES (current_site.id,p_data,p_template,true)
      ON CONFLICT (site_id) DO UPDATE SET data = excluded.data, template_type = excluded.template_type,
        is_public = true, revision = site_publications.revision + 1, published_at = now();
    END IF;
  END IF;
  RETURN jsonb_build_object('siteId',p_site_id,'action',p_action);
END $fn$;
REVOKE ALL ON FUNCTION public.manage_builder_site(text,text,jsonb,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.manage_builder_site(text,text,jsonb,text) TO service_role;
COMMIT;
