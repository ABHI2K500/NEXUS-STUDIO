# Nexus Studio

A modern website for Nexus Studio, featuring live streaming, media production, digital marketing, event management, and esports services.

## Deploying to Vercel

### Prerequisites

- A [Vercel](https://vercel.com) account
- [Git](https://git-scm.com/) installed on your machine
- Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Push your code to a Git repository**

   Make sure your code is pushed to a Git repository on GitHub, GitLab, or Bitbucket.

2. **Import your project to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Select your Git repository
   - Configure your project settings

3. **Configure Environment Variables**

   Add the following environment variables in the Vercel dashboard:

   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `GROQ_API_KEY`: Your Groq API key
   - `NEXT_PUBLIC_GROQ_API_KEY`: Your public Groq API key
   - SMTP settings if you're using the newsletter feature

4. **Deploy**

   Click "Deploy" and Vercel will build and deploy your project.

5. **Assign a Custom Domain (Optional)**

   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain

## Development

### Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SMTP Configuration for Newsletter
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_from_email

# Groq API Configuration
NEXT_PUBLIC_GROQ_API_KEY=your_public_groq_api_key
GROQ_API_KEY=your_groq_api_key
```

## Features

- Live streaming services
- Media production
- Digital marketing
- Event management
- Esports services
- AI-powered chat assistant
- User authentication
- Blog section
- Portfolio showcase
- Responsive design

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