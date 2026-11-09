begin;
set local lock_timeout = '5s';
lock table public.medinsure_access_suspensions in access exclusive mode;
do $verify$
begin
  if exists (select 1 from public.medinsure_access_suspensions) then
    raise exception 'Existing suspension identities must be reconciled before switching Auth projects';
  end if;
end;
$verify$;
-- The route derives this UUID exclusively from the MedinSure Auth server.
alter table public.medinsure_access_suspensions
  drop constraint medinsure_access_suspensions_user_id_fkey;
commit;
