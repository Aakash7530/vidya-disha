-- Auto-promote specific emails to admin on signup
CREATE OR REPLACE FUNCTION public.auto_promote_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IN ('admin@vidyadisha.com', 'admin@admin.com') THEN
    UPDATE public.user_roles SET role = 'admin' WHERE user_id = NEW.id;
    IF NOT FOUND THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_promote_admin_trigger ON auth.users;
CREATE TRIGGER auto_promote_admin_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_promote_admin();