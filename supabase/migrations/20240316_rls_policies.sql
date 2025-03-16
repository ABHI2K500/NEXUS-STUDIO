-- Enable Row Level Security on all tables
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into email_subscribers
CREATE POLICY "Allow public inserts to email_subscribers" ON email_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow anyone to insert into contact_submissions
CREATE POLICY "Allow public inserts to contact_submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Allow only admins to select from email_subscribers
CREATE POLICY "Allow admin select from email_subscribers" ON email_subscribers
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Allow only admins to select from contact_submissions
CREATE POLICY "Allow admin select from contact_submissions" ON contact_submissions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Allow only admins to insert into newsletter_logs
CREATE POLICY "Allow admin inserts to newsletter_logs" ON newsletter_logs
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Allow only admins to select from newsletter_logs
CREATE POLICY "Allow admin select from newsletter_logs" ON newsletter_logs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  ); 