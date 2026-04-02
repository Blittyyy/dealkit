-- 1) New auth users get a user_subscriptions row (plan = free)
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan)
  VALUES (NEW.id, 'free')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- 2) Backfill: existing users without a row
INSERT INTO public.user_subscriptions (user_id, plan)
SELECT u.id, 'free'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_subscriptions s WHERE s.user_id = u.id
)
ON CONFLICT (user_id) DO NOTHING;

-- 3) Only Pro can publish (first publish or insert-as-published)
CREATE OR REPLACE FUNCTION public.kits_enforce_publish_requires_pro()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_published IS TRUE THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE user_id = NEW.user_id AND plan = 'pro'
      ) THEN
        RAISE EXCEPTION 'Publishing requires an active Pro subscription';
      END IF;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.is_published IS TRUE AND OLD.is_published IS NOT TRUE THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.user_subscriptions
        WHERE user_id = NEW.user_id AND plan = 'pro'
      ) THEN
        RAISE EXCEPTION 'Publishing requires an active Pro subscription';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS kits_publish_requires_pro_insert ON public.kits;
CREATE TRIGGER kits_publish_requires_pro_insert
  BEFORE INSERT ON public.kits
  FOR EACH ROW
  EXECUTE FUNCTION public.kits_enforce_publish_requires_pro();

DROP TRIGGER IF EXISTS kits_publish_requires_pro_update ON public.kits;
CREATE TRIGGER kits_publish_requires_pro_update
  BEFORE UPDATE ON public.kits
  FOR EACH ROW
  EXECUTE FUNCTION public.kits_enforce_publish_requires_pro();
