# NEXUS Studio Website

## Admin Features Setup

### Prerequisites
1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Set up an SMTP server for sending newsletters (e.g., SendGrid, Amazon SES)
3. Get a Groq API key for the chatbot at [https://groq.com](https://groq.com)

### Environment Variables
Copy `.env.local.example` to `.env.local` and fill in the values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# SMTP Configuration for Newsletter
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=noreply@yourdomain.com

# Groq API Configuration
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
```

### Database Setup
1. Go to your Supabase project's SQL editor
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL commands to create the necessary tables and policies

### Creating an Admin User
1. Create a new user through Supabase Authentication
2. Use the SQL editor to update the user's role to admin:
```sql
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id';
```

### Features
- **Admin Login**: Secure authentication for admin users
- **Email Management**: View and manage newsletter subscribers
- **Newsletter**: Send newsletters to all subscribers
- **Contact Form**: View and manage customer support inquiries
- **Protected Routes**: Only admin users can access the dashboard

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Admin Routes
- `/admin` - Admin login page
- `/admin/dashboard` - Admin dashboard with email subscribers and contact form submissions

### Security
- All admin routes are protected with authentication
- Row Level Security (RLS) is enabled on all tables
- Only admin users can access sensitive data
- Secure email handling with environment variables 