# Content Platform - Next.js CMS

A modern, full-stack content management system built with Next.js 15, TypeScript, Supabase, and Tailwind CSS. Features multi-language support, authentication, and a powerful post management system.

## ✨ Features

- 🚀 **Next.js 15** with App Router and React 19
- 🔐 **Authentication** with Supabase Auth
- 🌍 **Internationalization** (i18n) - English & Vietnamese support
- 📝 **Markdown Support** for rich content creation
- 🎨 **Tailwind CSS 4** for modern styling
- 📊 **PostgreSQL Database** with Supabase
- 🔒 **Row-Level Security** (RLS) for data protection
- ✅ **Type Safety** with TypeScript & Zod validation
- 📦 **Code Quality** with ESLint & TypeScript
- 🎯 **SEO Optimized** with metadata & sitemaps

## 🛠️ Tech Stack

### Core

- **Framework**: Next.js 15 (with Turbopack)
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)

### Development

- **Testing**: Vitest, Playwright
- **Linting**: ESLint (Antfu Config)
- **Type Checking**: TypeScript
- **Git Hooks**: Lefthook
- **Commit Convention**: Conventional Commits

## 📋 Prerequisites

- Node.js 20 or higher
- npm or yarn
- Supabase account ([sign up here](https://supabase.com))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Next-js-Boilerplate-1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the migration:
   - Open the Supabase SQL Editor
   - Copy the contents of `supabase/migrations/001_create_posts_table.sql`
   - Execute the query

See [supabase/README.md](./supabase/README.md) for detailed database schema information.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

### Development

```bash
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run clean            # Clean build artifacts
```

### Code Quality

```bash
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
npm run check:types      # Type check with TypeScript
npm run check:deps       # Check unused dependencies
npm run check:i18n       # Check translation files
```

### Testing

```bash
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests with Playwright
```

### Analysis

```bash
npm run build-stats      # Build with bundle analyzer
```

## 📁 Project Structure

```text
src/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes
│   │   ├── (marketing)/     # Marketing pages
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   └── posts/           # Post management
│   ├── global-error.tsx     # Global error handler
│   ├── robots.ts            # Robots.txt generator
│   └── sitemap.ts           # Sitemap generator
├── components/              # React components
│   ├── analytics/           # Analytics components
│   ├── layout/              # Layout components
│   ├── posts/               # Post-related components
│   └── ui/                  # UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Core libraries
│   ├── auth/                # Authentication context
│   ├── posts/               # Post management
│   └── supabase/            # Supabase client
├── locales/                 # Translation files
│   ├── en.json              # English translations
│   └── vi.json              # Vietnamese translations
├── styles/                  # Global styles
├── types/                   # TypeScript types
├── utils/                   # Utility functions
└── validations/             # Zod schemas
```

## 🌍 Internationalization

The application supports multiple languages using `next-intl`:

- **English** (default)
- **Vietnamese**

Add translations in `src/locales/[locale].json` files.

### Language Switching

The language switcher is available in the header. URLs are automatically prefixed with the locale (e.g., `/vi/posts`).

## 🔐 Authentication

Authentication is handled by Supabase Auth with the following features:

- Email/Password authentication
- Protected routes with middleware
- Row-Level Security (RLS) for database access
- User context via React Context API

### Protected Routes

Routes under `/dashboard` and `/posts` require authentication. The middleware automatically redirects unauthenticated users to the login page.

## 📊 Database Schema

### Posts Table

```sql
posts (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

See [supabase/README.md](./supabase/README.md) for RLS policies and detailed schema.

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

Make sure to:

1. Set all required environment variables
2. Build command: `npm run build`
3. Start command: `npm run start`

## 🔧 Configuration

### App Config

Edit `src/utils/AppConfig.ts` to customize:

```typescript
export const AppConfig = {
  name: 'Content Platform',
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
};
```

### Tailwind CSS

Customize styling in `src/styles/global.css` and `postcss.config.mjs`.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```bash
npm run commit  # Interactive commit prompt
```
