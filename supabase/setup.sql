-- Zura Portfolio: tables, policies, image bucket, and existing content.
-- Generated from supabase/schema.sql, supabase/security-hardening.sql and app/data/*.ts.
-- Paste this entire file into Supabase SQL Editor and click Run.
-- Does not create auth users or grant anyone admin access.
begin;

-- Source schema for scripts/generate-supabase-setup.mjs.
-- Run the generated supabase/setup.sql in the Supabase SQL Editor.

create schema if not exists portfolio_private;
revoke all on schema portfolio_private from public, anon, authenticated;
grant usage on schema portfolio_private to authenticated;

create table if not exists portfolio_private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table portfolio_private.admin_users enable row level security;
revoke all on portfolio_private.admin_users from public, anon, authenticated;

-- Only the database owner can maintain the admin list. This helper reads it
-- with its owner's privileges, accepts no user ID, and checks the caller's JWT.
create or replace function portfolio_private.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from portfolio_private.admin_users
    where user_id = (select auth.uid())
  );
$$;
revoke all on function portfolio_private.is_admin() from public, anon, authenticated;
grant execute on function portfolio_private.is_admin() to authenticated;

-- Future admin routes can call this RPC to check their verified user's role.
create or replace function public.is_admin()
returns boolean
language sql stable security invoker
set search_path = ''
as $$ select portfolio_private.is_admin(); $$;
revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

create or replace function portfolio_private.touch_updated_at()
returns trigger
language plpgsql security invoker
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;
revoke all on function portfolio_private.touch_updated_at() from public, anon, authenticated;

create table if not exists public.site_content (
  key text primary key check (key in ('about', 'story', 'contact')),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 200),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  category text not null default '' check (char_length(category) <= 120),
  year integer not null check (year between 1900 and 9999),
  short_description text not null default '' check (char_length(short_description) <= 1000),
  full_description text not null default '' check (char_length(full_description) <= 20000),
  cover_image text not null default '' check (char_length(cover_image) <= 2048),
  gallery text[] not null default '{}',
  technologies text[] not null default '{}',
  features text[] not null default '{}',
  live_url text not null default '' check (char_length(live_url) <= 2048),
  github_url text check (github_url is null or char_length(github_url) <= 2048),
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_project_has_cover check (not published or char_length(btrim(cover_image)) > 0)
);
create index if not exists portfolio_projects_listing_idx
  on public.projects (published, sort_order, created_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  email text not null check (
    char_length(email) <= 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  subject text not null default '' check (char_length(subject) <= 200),
  message text not null check (char_length(btrim(message)) between 10 and 3000),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists portfolio_messages_inbox_idx
  on public.contact_messages (is_read, created_at desc);

alter table public.site_content enable row level security;
alter table public.projects enable row level security;
alter table public.contact_messages enable row level security;

-- Reset only this application's grants, including Supabase's default grants.
revoke all on public.site_content, public.projects, public.contact_messages
  from public, anon, authenticated;
grant select on public.site_content, public.projects to anon, authenticated;
grant insert, update on public.site_content to authenticated;
grant insert, update, delete on public.projects to authenticated;
grant insert (name, email, subject, message) on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant update (is_read) on public.contact_messages to authenticated;

drop policy if exists portfolio_content_read on public.site_content;
create policy portfolio_content_read on public.site_content
  for select to anon, authenticated using (true);
drop policy if exists portfolio_content_insert on public.site_content;
create policy portfolio_content_insert on public.site_content
  for insert to authenticated with check ((select portfolio_private.is_admin()));
drop policy if exists portfolio_content_update on public.site_content;
create policy portfolio_content_update on public.site_content
  for update to authenticated using ((select portfolio_private.is_admin()))
  with check ((select portfolio_private.is_admin()));

drop policy if exists portfolio_projects_published on public.projects;
create policy portfolio_projects_published on public.projects
  for select to anon, authenticated using (published);
drop policy if exists portfolio_projects_admin on public.projects;
create policy portfolio_projects_admin on public.projects
  for all to authenticated using ((select portfolio_private.is_admin()))
  with check ((select portfolio_private.is_admin()));

drop policy if exists portfolio_messages_submit on public.contact_messages;
create policy portfolio_messages_submit on public.contact_messages
  for insert to anon, authenticated with check (true);
drop policy if exists portfolio_messages_admin_read on public.contact_messages;
create policy portfolio_messages_admin_read on public.contact_messages
  for select to authenticated using ((select portfolio_private.is_admin()));
drop policy if exists portfolio_messages_admin_update on public.contact_messages;
create policy portfolio_messages_admin_update on public.contact_messages
  for update to authenticated using ((select portfolio_private.is_admin()))
  with check ((select portfolio_private.is_admin()));
drop policy if exists portfolio_messages_admin_delete on public.contact_messages;
create policy portfolio_messages_admin_delete on public.contact_messages
  for delete to authenticated using ((select portfolio_private.is_admin()));

drop trigger if exists portfolio_content_updated_at on public.site_content;
create trigger portfolio_content_updated_at before update on public.site_content
  for each row execute function portfolio_private.touch_updated_at();
drop trigger if exists portfolio_projects_updated_at on public.projects;
create trigger portfolio_projects_updated_at before update on public.projects
  for each row execute function portfolio_private.touch_updated_at();
drop trigger if exists portfolio_messages_updated_at on public.contact_messages;
create trigger portfolio_messages_updated_at before update on public.contact_messages
  for each row execute function portfolio_private.touch_updated_at();

-- Images are public website assets. Only designated admins can manage them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do nothing;

drop policy if exists portfolio_media_admin_select on storage.objects;
create policy portfolio_media_admin_select on storage.objects
  for select to authenticated
  using (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()));
drop policy if exists portfolio_media_admin_insert on storage.objects;
create policy portfolio_media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()));
drop policy if exists portfolio_media_admin_update on storage.objects;
create policy portfolio_media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()))
  with check (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()));
drop policy if exists portfolio_media_admin_delete on storage.objects;
create policy portfolio_media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and (select portfolio_private.is_admin()));

-- Run once in Supabase SQL Editor. Safe to rerun; preserves all existing content.
-- A database trigger also covers direct Data API inserts, so callers cannot
-- bypass the website's process-local limiter by submitting straight to Supabase.

create index if not exists portfolio_messages_email_time_idx
  on public.contact_messages (lower(email), created_at desc);
create index if not exists portfolio_messages_created_at_idx
  on public.contact_messages (created_at desc);

create or replace function portfolio_private.limit_contact_submissions()
returns trigger
language plpgsql security definer
set search_path = ''
as $$
begin
  -- Serialize the short count/insert transaction to prevent concurrent requests
  -- from racing past the limits. No message data or IP addresses are logged.
  perform pg_catalog.pg_advisory_xact_lock(761924, 1);
  if (
    select count(*) from public.contact_messages
    where lower(email) = lower(new.email)
      and created_at > pg_catalog.clock_timestamp() - interval '1 minute'
  ) >= 3 or (
    select count(*) from public.contact_messages
    where created_at > pg_catalog.clock_timestamp() - interval '1 minute'
  ) >= 30 then
    raise exception using errcode = 'P0001', message = 'CONTACT_RATE_LIMIT';
  end if;
  return new;
end;
$$;

revoke all on function portfolio_private.limit_contact_submissions() from public, anon, authenticated;
drop trigger if exists portfolio_messages_submission_limit on public.contact_messages;
create trigger portfolio_messages_submission_limit
  before insert on public.contact_messages
  for each row execute function portfolio_private.limit_contact_submissions();



-- Seed current public content. Re-running never overwrites existing edits.
insert into public.site_content (key, content) values
  ('about', $portfolio_seed$
{
  "name": "Zura Beridze",
  "title": "Full-Stack Developer & IT Specialist",
  "location": "Tbilisi, Georgia",
  "email": "zuraberidze12@gmail.com",
  "phone": "+995 558 29 43 64",
  "introduction": "I'm a developer passionate about building modern, functional, and visually engaging digital experiences.",
  "description": "My professional journey combines hands-on IT experience with a strong interest in web development. With a background in technical support, telecommunications, and architectural design, I bring a practical, problem-solving mindset to every project. I specialize in building responsive, high-performance web applications using React, Next.js, and TypeScript, with a focus on clean design, usability, and modern development practices.",
  "experience": [
    {
      "id": 1,
      "position": "IT Specialist",
      "company": "Ministry of Defense of Georgia",
      "startDate": "2022-02-01",
      "endDate": null,
      "description": [
        "Provide technical support to users and maintain IT systems.",
        "Diagnose and resolve hardware, software, and connectivity issues.",
        "Install, configure, and maintain software applications and computer equipment."
      ]
    },
    {
      "id": 2,
      "position": "Architect & Land Surveyor",
      "company": "Architectural Services Company",
      "startDate": "2020-03-01",
      "endDate": "2022-01-31",
      "description": [
        "Prepared architectural drawings and technical documentation.",
        "Conducted land surveying and measurement activities.",
        "Worked with CAD software and technical project documentation."
      ]
    },
    {
      "id": 3,
      "position": "Internet Installation Technician",
      "company": "Global Erty",
      "startDate": "2018-09-01",
      "endDate": "2020-02-29",
      "description": [
        "Installed and maintained internet connectivity services.",
        "Diagnosed and resolved network connectivity issues.",
        "Configured networking equipment and provided customer support."
      ]
    }
  ],
  "education": [
    {
      "id": 1,
      "institution": "Georgian Technical University",
      "program": "Bachelor's Degree in Energy and Telecommunications",
      "startDate": "2015-01-01",
      "endDate": "2019-12-31"
    },
    {
      "id": 2,
      "institution": "Smart Academy",
      "program": "Front-End Development — HTML, CSS, JavaScript",
      "startDate": "2019-03-01",
      "endDate": "2019-05-31"
    },
    {
      "id": 3,
      "institution": "Goal Oriented Academy",
      "program": "Front-End Development — HTML, CSS, JavaScript, Python",
      "startDate": "2023-09-01",
      "endDate": "2024-04-30"
    },
    {
      "id": 4,
      "institution": "Smart Academy",
      "program": "Back-End Development with Python",
      "startDate": "2025-02-01",
      "endDate": "2025-05-31"
    }
  ],
  "skills": [
    {
      "id": 1,
      "category": "Frontend Development",
      "skills": [
        "HTML5",
        "CSS3",
        "Sass",
        "JavaScript",
        "TypeScript",
        "React.js",
        "Next.js",
        "Tailwind CSS",
        "GSAP",
        "Framer Motion"
      ]
    },
    {
      "id": 2,
      "category": "Backend & Databases",
      "skills": [
        "Node.js",
        "Express.js",
        "MongoDB",
        "Supabase",
        "Firebase",
        "Python"
      ]
    },
    {
      "id": 3,
      "category": "Tools & Platforms",
      "skills": [
        "Git",
        "GitHub",
        "VS Code",
        "Figma",
        "Vercel",
        "Netlify"
      ]
    },
    {
      "id": 4,
      "category": "IT & Technical Support",
      "skills": [
        "Hardware Troubleshooting",
        "Software Installation",
        "System Configuration",
        "Network Troubleshooting",
        "Technical Support"
      ]
    }
  ],
  "languages": [
    {
      "name": "Georgian",
      "level": "Native"
    },
    {
      "name": "English",
      "level": "Intermediate (B1)"
    }
  ],
  "socialLinks": {
    "github": "https://github.com/beridzezura14",
    "linkedin": "https://www.linkedin.com/in/zura-beridze-a39725197/"
  }
}
$portfolio_seed$::jsonb),
  ('story', $portfolio_seed$
{
  "title": "My Story.",
  "subtitle": "Not a straight path, but one worth taking.",
  "chapters": [
    {
      "id": "beginnings",
      "title": "Where It All Began — 2019",
      "paragraphs": [
        "My journey into web development began in 2019.",
        "I was curious about how websites worked, how they were built, and how something could go from a simple idea to a fully functional digital experience.",
        "That curiosity led me to take my first steps into HTML, CSS, and the fundamentals of web development.",
        "However, life doesn't always go according to plan.",
        "For personal reasons and other responsibilities, I had to step away from learning web development. What started as an exciting journey was put on hold.",
        "But my interest in technology never completely disappeared."
      ]
    },
    {
      "id": "starting-again",
      "title": "Starting Again — December 2023",
      "paragraphs": [
        "In December 2023, I made a decision that would change the direction of my professional development.",
        "I decided to start learning web development again.",
        "This time, I approached it differently.",
        "I wasn't just interested in understanding how websites worked. I wanted to learn how to build complete applications, solve real problems, and turn ideas into working products.",
        "I started rebuilding my knowledge, improving my JavaScript skills, and exploring modern web technologies.",
        "Step by step, I moved into React, Next.js, TypeScript, and the wider ecosystem of modern web development.",
        "There were challenges, moments of frustration, and problems that took hours to solve.",
        "But every challenge taught me something new.",
        "And with every project, I became more confident in my abilities."
      ]
    },
    {
      "id": "learning-to-building",
      "title": "From Learning to Building",
      "paragraphs": [
        "At some point, I realized that watching tutorials and completing exercises wasn't enough.",
        "I needed to build real things.",
        "So I started creating my own projects.",
        "What began with simple websites gradually evolved into more complex applications featuring authentication, databases, administrative dashboards, product management systems, and interactive user interfaces.",
        "I learned how to work with technologies such as Next.js, React, TypeScript, Tailwind CSS, Supabase, and other tools that help turn ideas into functional web applications.",
        "I also developed a strong interest in UI/UX design.",
        "For me, writing code is only one part of building a great website. Understanding how people interact with it, how it looks, and how it performs is equally important.",
        "That's why I pay attention to both the technical and visual sides of every project."
      ]
    },
    {
      "id": "real-world-experience",
      "title": "Building Real-World Experience",
      "paragraphs": [
        "As my skills developed, I began working on increasingly practical projects across different industries.",
        "From travel websites and corporate platforms to beauty businesses, construction product catalogs, and administrative systems, each project introduced new challenges.",
        "Some required complex data management. Others focused on performance, responsive design, or creating intuitive user experiences.",
        "Working on these projects helped me understand something important:",
        "**Being a developer isn't just about knowing technologies. It's about knowing how to use them to solve problems.**",
        "I began approaching projects as complete products rather than collections of pages and components.",
        "From planning and interface design to frontend development, backend integration, database management, and deployment, I learned to take responsibility for the entire development process."
      ]
    },
    {
      "id": "beyond-development",
      "title": "More Than Just Development",
      "paragraphs": [
        "My professional background also includes experience outside the software development industry.",
        "Working in IT and other technical roles has helped me develop problem-solving skills, responsibility, attention to detail, and the ability to approach challenges from different perspectives.",
        "These experiences have shaped how I work today.",
        "I believe that technical knowledge is important, but so are communication, organization, reliability, and the willingness to keep learning."
      ]
    },
    {
      "id": "today",
      "title": "Where I Am Today",
      "paragraphs": [
        "Today, I'm a Full-Stack Developer focused on building modern, responsive, and functional web applications.",
        "I work primarily with Next.js, React, TypeScript, Tailwind CSS, and Supabase, creating projects that combine clean design with practical functionality.",
        "I enjoy the entire development process — from the first idea and initial design to writing code, solving technical challenges, and seeing the finished product come to life.",
        "I'm still learning, still improving, and constantly looking for ways to become a better developer.",
        "Looking back, my journey hasn't been perfectly straightforward.",
        "I started in 2019, stepped away, and found my way back in December 2023.",
        "But that experience taught me something valuable:",
        "**Progress isn't always about moving forward without stopping. Sometimes, it's about having the determination to start again.**",
        "And that's exactly what I did."
      ]
    },
    {
      "id": "whats-next",
      "title": "What's Next?",
      "paragraphs": [
        "I don't see where I am today as the finish line.",
        "It's another step in a much bigger journey.",
        "My goal is to continue growing as a developer, work on more challenging projects, collaborate with talented people, and build digital products that create real value.",
        "There's still a lot I want to learn and accomplish.",
        "**And I'm just getting started.**"
      ]
    }
  ]
}
$portfolio_seed$::jsonb),
  ('contact', $portfolio_seed$
{
  "email": "zuraberidze12@gmail.com",
  "phone": "+995 558 29 43 64",
  "phoneLink": "+995558294364",
  "whatsapp": "https://wa.me/995558294364",
  "github": "https://github.com/beridzezura14",
  "linkedin": "https://www.linkedin.com/in/zura-beridze-a39725197/",
  "location": "Tbilisi, Georgia",
  "availability": "Open to opportunities"
}
$portfolio_seed$::jsonb)
on conflict (key) do nothing;

insert into public.projects (
  slug, title, category, year, short_description, full_description,
  cover_image, gallery, technologies, features, live_url, github_url,
  featured, published, sort_order
)
select
  slug, title, category, year, short_description, full_description,
  cover_image, gallery, technologies, features, live_url, github_url,
  featured, published, sort_order
from jsonb_to_recordset($portfolio_seed$
[
  {
    "slug": "salia-travel",
    "title": "Salia Travel",
    "category": "Travel Agency",
    "year": 2026,
    "short_description": "Modern travel agency website.",
    "full_description": "A modern travel agency website featuring a tour catalog, detailed tour pages, and an inquiry form.",
    "cover_image": "/projects/saliatravel.png",
    "gallery": [],
    "technologies": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS"
    ],
    "features": [
      "Responsive website",
      "Tour catalog",
      "Tour detail pages",
      "Inquiry form"
    ],
    "live_url": "https://saliatravel.com",
    "github_url": null,
    "featured": true,
    "published": true,
    "sort_order": 0
  },
  {
    "slug": "trust-point",
    "title": "Trust Point",
    "category": "Corporate Website",
    "year": 2026,
    "short_description": "Tax and legal services website.",
    "full_description": "A professional corporate website for a tax and legal services company, featuring service pages, a blog, and an academy section.",
    "cover_image": "/projects/trust-point.png",
    "gallery": [],
    "technologies": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS"
    ],
    "features": [
      "Responsive design",
      "Service pages",
      "Blog",
      "Academy section",
      "SEO optimization"
    ],
    "live_url": "https://trust-point.ge",
    "github_url": null,
    "featured": true,
    "published": true,
    "sort_order": 1
  },
  {
    "slug": "beauty-salon",
    "title": "Beauty Salon",
    "category": "Beauty & Wellness",
    "year": 2026,
    "short_description": "Modern beauty salon website.",
    "full_description": "An elegant beauty salon website with a responsive interface, interactive sections, and smooth animations.",
    "cover_image": "/projects/beauty-salon.png",
    "gallery": [],
    "technologies": [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion"
    ],
    "features": [
      "Responsive layout",
      "Service presentation",
      "Interactive animations",
      "Modern user interface"
    ],
    "live_url": "https://beautysalon-sandy.vercel.app",
    "github_url": null,
    "featured": true,
    "published": true,
    "sort_order": 2
  },
  {
    "slug": "pudzemsheni",
    "title": "Pudzemsheni",
    "category": "Construction & E-commerce",
    "year": 2026,
    "short_description": "A modern construction products website featuring a product catalog, shopping cart, and admin dashboard.",
    "full_description": "Pudzemsheni is a modern web application designed to showcase reinforced concrete and construction products online. The website features a product catalog, detailed categories, product galleries, a shopping cart, and contact forms. Built with Next.js and Supabase, it includes a secure admin dashboard for managing products, categories, and images. The platform also features dynamic product pages, SEO optimization, Google Analytics, a sitemap, and responsive design. Customer inquiries and order requests are delivered via email.",
    "cover_image": "/projects/pudzemsheni.png",
    "gallery": [],
    "technologies": [
      "Next.js",
      "Tailwind CSS",
      "Supabase",
      "Swiper"
    ],
    "features": [
      "Product catalog and categories",
      "Dynamic product detail pages",
      "Shopping cart functionality",
      "Secure admin dashboard",
      "Product and category management (CRUD)",
      "Image upload and management",
      "Supabase authentication and database",
      "Order and contact forms",
      "Email notifications",
      "SEO optimization and sitemap",
      "Google Analytics integration",
      "Responsive design"
    ],
    "live_url": "https://pudzemsheni.ge/",
    "github_url": null,
    "featured": true,
    "published": true,
    "sort_order": 3
  }
]
$portfolio_seed$::jsonb) as project (
  slug text, title text, category text, year integer,
  short_description text, full_description text, cover_image text,
  gallery text[], technologies text[], features text[], live_url text,
  github_url text, featured boolean, published boolean, sort_order integer
)
on conflict (slug) do nothing;

notify pgrst, 'reload schema';

commit;
