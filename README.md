# TaskPilot

TaskPilot is a modern task manager built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com), and [Drizzle ORM](https://orm.drizzle.team/). It features user authentication, task CRUD, category & priority management, and visual statistics.

✨ Features
✅ Add / edit / delete tasks

📅 Due date selector with urgency color indicators

📂 Category + priority tags with colored labels

🎯 Filter by completion, category, or search by keyword

📊 Interactive Pie Chart for completed tasks by category

🌙 Light / Dark mode toggle (auto switch based on time)

💬 Guest login via Supabase Auth (no registration required)

📦 Tech Stack
Frontend: Next.js 14 (App Router), Tailwind CSS

Backend: Supabase (Database + Auth)

Charting: Recharts (PieChart)

Deployment: Vercel + Supabase

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/taskpilot.git
cd taskpilot
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> You can find these in your [Supabase project settings](https://app.supabase.com/).

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database

- Uses Supabase Postgres for storage and authentication.
- See [`src/lib/schema.ts`](src/lib/schema.ts) for the Drizzle ORM schema.

## Project Structure

```
src/
  app/
    dashboard/      # Dashboard UI and logic
    login/          # Login page
    layout.tsx      # App layout
    globals.css     # Global styles
  lib/
    supabase.ts     # Supabase client
    schema.ts       # Drizzle ORM schema
    nickname.ts     # Nickname utility
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or any platform supporting Next.js.

## License

MIT

---

Made with ❤️ using Next.js, Supabase, and Drizzle ORM.