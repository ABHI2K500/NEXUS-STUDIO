-- Create settings table for application settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users to select settings
CREATE POLICY "Allow authenticated users to select settings" 
  ON settings FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Only allow authenticated users with admin role to insert/update/delete settings
CREATE POLICY "Allow admins to insert settings" 
  ON settings FOR INSERT 
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to update settings" 
  ON settings FOR UPDATE 
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to delete settings" 
  ON settings FOR DELETE 
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'admin');

-- Insert default featured video setting
INSERT INTO settings (key, value, metadata)
VALUES (
  'featured_video', 
  'https://www.youtube.com/watch?v=bJ5ClftUcBI',
  '{"title": "Live Tournament Stream", "isLive": true}'::jsonb
)
ON CONFLICT (key) DO NOTHING; 