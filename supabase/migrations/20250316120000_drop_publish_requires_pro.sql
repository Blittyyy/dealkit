-- Free tier can publish (limits enforced in app + plan features)
DROP TRIGGER IF EXISTS kits_publish_requires_pro_insert ON public.kits;
DROP TRIGGER IF EXISTS kits_publish_requires_pro_update ON public.kits;
DROP FUNCTION IF EXISTS public.kits_enforce_publish_requires_pro();
