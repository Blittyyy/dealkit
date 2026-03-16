-- DealKit MVP: kits table

CREATE TABLE kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  niche text,
  bio text,
  ctr text,
  retention text,
  roas text,
  packages jsonb DEFAULT '[]'::jsonb,
  videos jsonb DEFAULT '[]'::jsonb,
  testimonial text,
  avatar_url text,
  is_published boolean DEFAULT false NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_kits_user_id ON kits(user_id);
CREATE INDEX idx_kits_slug ON kits(slug);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_kits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_kits_updated_at
  BEFORE UPDATE ON kits
  FOR EACH ROW
  EXECUTE FUNCTION update_kits_updated_at();

-- Row Level Security
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own kits"
  ON kits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kits"
  ON kits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kits"
  ON kits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can read kits by slug"
  ON kits FOR SELECT
  USING (true);
