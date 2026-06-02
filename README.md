# ClientFlow — Modern CRM Dashboard

![ClientFlow Banner](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=ClientFlow+CRM+Dashboard)

**Live Demo:** [https://saa-s-admin-dashboard-nine.vercel.app/](https://saa-s-admin-dashboard-nine.vercel.app/)

ClientFlow is a sleek, modern, full-stack CRM Dashboard designed to manage clients, projects, tasks, and invoices. Built to showcase enterprise-level frontend aesthetics and robust backend integration, this project leverages the latest capabilities of Next.js and Supabase.

## Features

- **Authentication & Security**: Secure user registration, login, and protected routes managed via Supabase Auth and Next.js Middleware.
- **Glassmorphism UI**: A premium, responsive interface featuring transparent panels, blur effects, mesh gradients, and smooth micro-animations.
- **Dark/Light Mode**: Full support for system-based and manual theme toggling via `next-themes` and Tailwind CSS v4.
- **Clients Management**: Full CRUD operations to track your client base.
- **Projects Tracking**: Assign projects to specific clients and monitor their active or completed status.
- **Tasks Kanban**: A visual task management board to move tasks between *Pending*, *In Progress*, and *Done* states.
- **Invoicing System**: Generate invoices, assign them to clients, and track payment statuses in real-time.
- **Real-time Dashboard**: Dynamic overview metrics displaying total clients, active projects, and financial summaries.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18.17.0 or higher)
- npm or yarn
- A [Supabase](https://supabase.com/) account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/clientflow-crm.git
cd clientflow-crm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Supabase Project
1. Create a new project in your Supabase dashboard.
2. Navigate to **SQL Editor** and run the provided SQL script to build the schema:
   *(You can find the schema in `supabase-schema.sql` at the root of this project, or see the Schema section below).*
3. Go to **Authentication > Providers > Email** and **disable "Confirm Email"** (recommended for testing purposes).

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials. You can find these in **Settings > API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Database Schema

Run the following SQL in your Supabase SQL Editor to initialize the tables and Row Level Security (RLS) policies:

```sql
-- 1. Profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Clients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Projects
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tasks
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'done')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Invoices
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'unpaid' CHECK (status IN ('paid', 'unpaid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access to profiles" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to clients" ON public.clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to tasks" ON public.tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to invoices" ON public.invoices FOR ALL TO authenticated USING (true);

-- Auth Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## License
This project is licensed under the MIT License.
