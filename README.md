# Small Restaurant POS & Billing System MVP

A beautifully designed, lightning-fast Point Of Sale (POS) and billing web application tailored for local small business restaurants, cafes, and tea stalls. Focuses on daily cash counter operations with analytics.

## Tech Stack
- **Frontend Core**: Next.js 14 (App Router) with React Server Components, TypeScript.
- **Styling**: Tailwind CSS & custom animations.
- **Backend API**: Next.js API Routes (`/api/*`).
- **Database**: PostgreSQL with Prisma ORM.

## Features Implemented
- **Products**: Built-in seeding for snacks, tea, and drinks with easy CRUD extensions.
- **POS Billing Logic**: Rapid calculation board, interactive tax percentages, zero-lag subtotal additions, automated DB saving.
- **Reports Dashboard**: Aggregated total sales, number of bills, and top-selling items calculated natively from related Postgre queries. Designed for Daily, Weekly, and Monthly.
- **Seamless Interfaces**: Modern grid-based button UI mimicking a tablet touch ecosystem for faster checkout counter usage.

## Folder Architecture 
```text
/prisma/
  schema.prisma     <- Primary DB Models
  seed.ts           <- Pre-config items script
/src/
  app/
    api/            <- REST API built into Next
      bills/        <- Transaction controllers
      products/     <- Catalog logic
      reports/      <- Metric aggregation 
    dashboard/      <- Modern Admin Reporting Board
    pos/            <- Live Cash Counter App
    layout.tsx      <- Contains default Sidebar navigation
  components/       <- Abstract layouts and UX atoms
  lib/              <- Core utility, Prisma Singleton
```

## Quick Start (Local Setup)

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment variables**
   Create a `.env` file in the root.
   ```env
   # Replace with your local/cloud PostgreSQL connection URI
   DATABASE_URL="postgresql://user:password@localhost:5432/pos_db?schema=public"
   ```

3. **Initialize Database and Seed Items**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run prisma:seed    # Uses TS Node (tsx) bound via package.json
   ```
   *(Note: The seed command is mapped internally using `tsx prisma/seed.ts`)*

4. **Launch Application**
   ```bash
   npm run dev
   ```
   *Dashboard handles its own port allocation, usually starting at http://localhost:3000.*

## Deployment to Vercel (Phase 6)

The project is fully ready for zero-config Vercel deployment natively leveraging Prisma with serverless routing.

1. **Push your code to GitHub/GitLab**.
2. **Import Project** on the Vercel Dashboard.
3. Automatically, Vercel detects **Next.js**.
4. Set the **environment variable `DATABASE_URL`** to an external PostgreSQL service (e.g., Supabase, Neon, AWS RDS, Vercel Postgres).
5. In your Vercel Build Settings, configure the Install Command:
   ```bash
   npm install && npx prisma generate
   ```
6. Click **Deploy**. Vercel will bundle the Prisma client locally and push to edge infrastructure.

**Production DB Migration**
Instead of `db push`, use `npx prisma migrate deploy` locally before launching, pointing correctly to the production DB, to formally version structure.
