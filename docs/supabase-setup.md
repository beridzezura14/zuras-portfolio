# Supabase connection

The connection foundation uses `@supabase/supabase-js` and `@supabase/ssr`.
The homepage About section reads `site_content.about` from Supabase. The More About Me page reads `site_content.story`. Homepage projects, `/projects`, and individual project pages read published rows from `projects`. Contacts still use local content.

## Connect the project

Find the project URL and publishable key in Supabase Dashboard → Connect / API Keys.
Add these to `.env.local` (keep existing entries):

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is accepted as a legacy alternative. The database password and service-role/secret keys are not used by this integration.

Restart the development server after changing environment variables, then run:

```sh
npm run supabase:check
```

The check makes read-only requests to Auth settings and a zero-row `projects` table query. If PostgREST reports that the table is not exposed yet (`PGRST205`), the Data API connection is still verified. No records are read or created, and credentials are not printed. The REST root is not used, because its OpenAPI endpoint can require a secret key. Both checks must succeed to verify the connection; this does not verify database policies or admin permissions.

## Client utilities

- `lib/supabase/client.ts`: browser client.
- `lib/supabase/server.ts`: request-scoped server client using async Next.js cookies. With Cache Components, use it inside a Suspense boundary, a Server Action, or a Route Handler; not inside `use cache`.
- `lib/supabase/proxy.ts` and root `proxy.ts`: refresh session cookies on `/admin`, `/auth`, and `/api/admin` paths. Public portfolio routes do not make extra auth requests.

Run the database setup and admin membership steps in `docs/supabase-tables.md` before signing in at `/admin/login`. Session refreshing is not admin authorization: editing pages and Server Actions verify both identity and admin membership, with database Row Level Security enforcing permissions.

## Edit About

Open `/admin` → **Edit About**, or `/admin/about`. Edit the profile, social links, introduction, description, experience, education, skill groups and languages. List entries support adding, removing and reordering. **Save changes** publishes the whole About section immediately and invalidates its public cache. Existing email and phone values are preserved; contact editing is a separate step.

No additional SQL migration is needed. The editor uses the existing `site_content` row with `key = 'about'`. When Supabase is not configured, the public About section uses local seed data. Configured database failures surface as errors rather than silently displaying old seed content.

## Edit More About Me / My Story

Open `/admin` → **Edit My Story**, or `/admin/story`. Edit the page title, subtitle and chapters; add, remove or reorder chapters. Separate paragraphs with a blank line. A whole paragraph wrapped in `**double asterisks**` appears as a highlighted quote. Text is rendered safely as text rather than HTML.

**Save changes** updates the existing `site_content` row with `key = 'story'` and immediately invalidates `/about` and its content cache. The chapter navigation uses the saved titles and order; chapter IDs remain stable when renamed or reordered. Name, role and location on this page follow the About editor. No new SQL is required.

## Manage projects

Open `/admin/projects` from the sidebar. Search by title, category or slug; filter published projects and drafts. **Add project** creates a draft by default. Edit the title, URL slug, category, year, descriptions, technologies, features and HTTPS links. Technologies and features use one item per line. Existing slugs must be unique; changing a slug changes the public address.

Upload a cover image and up to 24 gallery images (JPG, PNG, WebP, AVIF or GIF, up to 5 MB each). Images upload to the existing public `portfolio-media` bucket through an authenticated admin endpoint. File type/signature and size are checked server-side. Gallery images can be reordered and removed. Images are public assets even while their project is a draft; removing an image from a project or deleting a project does not delete storage files that might be referenced elsewhere.

**Published** makes the page and listing visible to visitors; drafts are excluded from public lists and resolve to a 404 on their public URL. **Featured on homepage** selects published projects for Selected Work, which displays the first four by display order. Lower display order numbers appear first. **Save changes** invalidates the homepage, project list, and project detail caches. Deleting a project requires confirmation in its editor.

No new SQL is needed if the existing database setup and storage policies have been run. Next Image permits only this project's `portfolio-media` public image URLs; local seed images remain supported. Restart the dev server after changing Next configuration.

## Contact form and inbox

The public contact form posts to `/api/contact`. The server checks the request origin, limits the request body to 32 KB, validates name/email/subject/message, checks a honeypot and applies a best-effort limit of three attempts per email per minute per server process. It inserts only the four public message fields into `contact_messages`, using the public key and `Prefer: return=minimal`; it never asks anonymous visitors to read the private inbox. The form shows success and clears its inputs only after the database accepts the message. Failures keep the visitor's text intact.

Open `/admin/messages` or **Inbox** in the sidebar. Expand a message to read it, mark it read/unread, reply using your email app, or delete it after confirmation. Filters distinguish all/unread/read messages; pages show 25 messages. **Refresh inbox** loads new submissions. Only administrators can read or manage messages; all mutations recheck membership and use the existing RLS policies.

Delivery here means storage in the admin inbox; no outgoing email notification service is configured. Contact detail editing remains a separate step. The process-local rate limit and honeypot are basic controls, not a distributed spam filter. Existing installations should run `supabase/security-hardening.sql` to add database-level limits that also cover direct anonymous Data API inserts. Regenerated `setup.sql` includes these limits for new installations. See `docs/security-review.md` for the review results and remaining Auth settings.

Reference: https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs
