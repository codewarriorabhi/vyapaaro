
CREATE TABLE public.user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  -- Notification settings
  email_notifs boolean NOT NULL DEFAULT true,
  sms_notifs boolean NOT NULL DEFAULT true,
  new_shops_nearby boolean NOT NULL DEFAULT true,
  review_replies boolean NOT NULL DEFAULT true,
  promo_offers boolean NOT NULL DEFAULT true,
  order_updates boolean NOT NULL DEFAULT true,
  -- Privacy settings
  public_profile boolean NOT NULL DEFAULT true,
  show_email boolean NOT NULL DEFAULT false,
  show_phone boolean NOT NULL DEFAULT false,
  show_reviews boolean NOT NULL DEFAULT true,
  allow_contact boolean NOT NULL DEFAULT true,
  -- Location settings
  auto_detect_location boolean NOT NULL DEFAULT true,
  manual_location text NOT NULL DEFAULT '',
  location_radius text NOT NULL DEFAULT '5',
  -- Theme & Language
  theme text NOT NULL DEFAULT 'system',
  language text NOT NULL DEFAULT 'en',
  -- Review preferences
  review_visibility boolean NOT NULL DEFAULT true,
  review_notifs boolean NOT NULL DEFAULT true,
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON public.user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON public.user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON public.user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
