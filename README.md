# The Art Leaf - Full Stack Website

Production-style multi-page website for The Art Leaf, built with Next.js App Router, MongoDB, Mongoose, JWT admin authentication, Framer Motion animations, and premium glassmorphism UI.

## Features

- Multi-page frontend: Home, About, Services, Gallery, Contact, Admin
- Sticky navbar + mobile hamburger navigation
- Premium luxury UI (gold/bronze/beige palette)
- Framer Motion scroll reveal animations
- REST API routes for services, gallery, and contact
- MongoDB with Mongoose models
- JWT-based admin login
- Admin dashboard for creating and deleting content
- Cloudinary image upload integration for gallery
- SEO metadata via Next.js `metadata`

## Tech Stack

- Next.js (App Router)
- TypeScript
- CSS (no Tailwind)
- Framer Motion
- MongoDB + Mongoose
- JWT + bcryptjs
- Cloudinary

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy env file and fill values:
   ```bash
   cp .env.example .env.local
   ```

3. Generate admin password hash (example):
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-admin-password', 10))"
   ```
   Put the output into `ADMIN_PASSWORD_HASH`.

4. Start dev server:
   ```bash
   npm run dev
   ```

5. Open:
   - Site: `http://localhost:3000`
   - Admin login: `http://localhost:3000/admin/login`

## API Routes

- `POST /api/auth/login`
- `GET, POST /api/services`
- `PUT, DELETE /api/services/:id`
- `GET, POST /api/gallery`
- `DELETE /api/gallery/:id`
- `GET, POST /api/contact`
- `DELETE /api/contact/:id`

## Folder Highlights

- `src/app/*` - pages and route handlers
- `src/components/*` - reusable UI components
- `src/lib/*` - db, auth, cloudinary utils
- `src/models/*` - mongoose schemas
- `src/data/services.ts` - fallback service seed content

## Notes

- `/api/services` and `/api/gallery` are public for read, admin-protected for write.
- `/api/contact` accepts public POST, admin-only GET/DELETE.
- Replace demo WhatsApp number and map location in `src/app/contact/page.tsx`.

