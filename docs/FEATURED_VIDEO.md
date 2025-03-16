# Featured Video Management

This document explains how to set up and use the featured video management feature in Nexus Studio.

## Overview

The featured video management feature allows administrators to change the YouTube video displayed on the homepage through the admin dashboard. This includes:

- Updating the YouTube video URL
- Changing the video title
- Toggling the "Live" status

## Database Setup

The feature uses a `settings` table in Supabase to store the video information. The migration script is located at:

```
supabase/migrations/20240316_create_settings_table.sql
```

To apply the migration, run:

```bash
npx supabase migration up
```

## API Endpoints

The feature uses the following API endpoints:

- `GET /api/featured-video` - Retrieves the current featured video settings
- `POST /api/featured-video` - Updates the featured video settings

## Admin Dashboard

Administrators can manage the featured video through the admin dashboard:

1. Navigate to `/admin/dashboard`
2. Log in with admin credentials
3. Click on the "Featured Video" tab
4. Update the video URL, title, and live status
5. Click "Update Featured Video" to save changes

## Implementation Details

### Components

- `VideoPlayer` - Updated to support YouTube embeds
- Admin dashboard with featured video management tab

### Files

- `app/api/featured-video/route.ts` - API endpoint for managing the featured video
- `app/admin/dashboard/page.tsx` - Admin dashboard with featured video tab
- `components/video-player.tsx` - Video player component with YouTube support
- `app/page.tsx` - Homepage that displays the featured video

## Troubleshooting

If the featured video is not displaying correctly:

1. Check that the YouTube URL is valid and in the format `https://www.youtube.com/watch?v=VIDEO_ID`
2. Verify that the settings table has been created in Supabase
3. Check the browser console for any errors
4. Ensure the user has admin permissions to update the video

## Security

The feature implements row-level security (RLS) in Supabase to ensure that only authenticated administrators can update the featured video settings. 