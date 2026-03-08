
-- Fix profiles RLS: drop RESTRICTIVE policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix handle_new_user to parse Google OAuth metadata correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _first_name text;
  _surname text;
  _full_name text;
BEGIN
  -- Google OAuth provides full_name, not first_name/surname
  _first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  _surname := COALESCE(NEW.raw_user_meta_data->>'surname', '');
  _full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');

  -- If first_name is empty but full_name exists (Google OAuth), split it
  IF _first_name = '' AND _full_name != '' THEN
    _first_name := split_part(_full_name, ' ', 1);
    _surname := COALESCE(nullif(substring(_full_name from position(' ' in _full_name) + 1), ''), '');
  END IF;

  INSERT INTO public.profiles (user_id, first_name, surname, email, phone, address)
  VALUES (
    NEW.id,
    _first_name,
    _surname,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', '')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, (COALESCE(NEW.raw_user_meta_data->>'role', 'customer'))::app_role);

  RETURN NEW;
END;
$$;
