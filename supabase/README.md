# Supabase Database Setup

This directory contains SQL migrations for setting up the necessary database tables for the Nexus Studio application.

## Required Tables

The application requires the following tables:

1. `profiles` - User profiles with role information
2. `email_subscribers` - Newsletter subscribers
3. `contact_submissions` - Contact form submissions
4. `newsletter_logs` - Logs of sent newsletters

## Running Migrations

### Option 1: Using Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase db push
```

### Option 2: Manual Execution

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy the contents of the migration files in the `migrations` directory
4. Execute the SQL statements

## Database Schema

### profiles

This table is automatically created by Supabase Auth, but we need to add a `role` column:

```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
```

### email_subscribers

Stores email addresses of newsletter subscribers:

```sql
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### contact_submissions

Stores contact form submissions:

```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### newsletter_logs

Logs newsletters sent by admins:

```sql
CREATE TABLE IF NOT EXISTS newsletter_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  recipient_count INTEGER NOT NULL,
  sent_by UUID NOT NULL REFERENCES auth.users(id),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS) Policies

Make sure to set appropriate RLS policies for these tables:

```sql
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
```

Don't forget to enable Row Level Security on all tables:

```sql
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_logs ENABLE ROW LEVEL SECURITY;
``` 