# Supabase Setup

## Database Schema

The CMS uses a single `posts` table with the following structure:

- `id` (UUID): Primary key
- `title` (TEXT): Post title
- `content` (TEXT): Post content (markdown)
- `published` (BOOLEAN): Publication status
- `author_id` (UUID): Reference to auth.users
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

## Row Level Security (RLS) Policies

The following RLS policies are implemented:

1. **Public Read**: Anyone can read posts where `published = true`
2. **User Read**: Authenticated users can read their own posts (published or not)
3. **User Create**: Authenticated users can create posts
4. **User Update**: Users can only update their own posts
5. **User Delete**: Users can only delete their own posts

## Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Get your project URL and anon key from the project settings
3. Add them to your `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Run the migration in the Supabase SQL editor:
   - Copy the contents of `migrations/001_create_posts_table.sql`
   - Paste into the Supabase SQL editor
   - Execute the query

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
