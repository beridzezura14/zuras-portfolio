# Prepare the portfolio database

## 1. Run the setup SQL

In your Supabase project, open **SQL Editor → New query**.
Copy the entire contents of `supabase/setup.sql` into the editor and click **Run**.
It runs in one transaction and creates:

| Table | Purpose |
| --- | --- |
| `public.site_content` | Three editable documents: `about`, `story`, and `contact`. |
| `public.projects` | Projects, gallery URLs, technologies, features, ordering, and draft/published status. |
| `public.contact_messages` | Form submissions and their read/unread status. |
| `portfolio_private.admin_users` | Explicit admin access, maintained only through SQL Editor. |

It also creates the `portfolio-media` image bucket (JPEG, PNG, WebP, AVIF, GIF; 5 MB per file) and imports all four existing projects, the seven story chapters, About data, and contact details. Existing project images keep their `/projects/...` paths; the files already live in the website's public directory. New images can use Storage URLs later.

Re-running the setup does not erase records or overwrite edited content. It reapplies this application's policy definitions. This is initial setup SQL, not a general migration tool for changing existing column types.

## 2. Create your admin account

In **Authentication → Users**, create your user with an email and password. Use your own email. Turn off public sign-ups in the project's Auth settings for this single-owner admin panel.

Open `supabase/create-admin.sql`, replace `YOUR_ADMIN_EMAIL`, and run it in SQL Editor. It only grants access to an existing Auth user; it does not create a password or enable visitor registration. Keeping the membership table outside the public API prevents users from promoting themselves.

## 3. Verify

In Table Editor, check `site_content` has three rows and `projects` has four rows. After making yourself an admin, `portfolio_private.admin_users` should have your Auth user's UUID.

You can also run `npm run supabase:check` locally. With the table now available, both Auth and Data API should report `connected`.

## Access rules

- Visitors read site content and published projects. Drafts are visible only to admins.
- Only admins change content, projects, and uploaded image files.
- Visitors submit messages using only `name`, `email`, `subject`, and `message`. They cannot read messages or set read status, IDs, or timestamps.
- Only admins read messages, mark them read/unread, or delete them.
- Images are public website assets, including images uploaded while preparing a draft. The bucket is not for private documents.

The homepage About section reads `site_content.about` and is edited at `/admin/about`. More About Me reads `site_content.story` and is edited at `/admin/story`. `/admin/projects` manages database projects: create, edit, upload cover/gallery images, feature on the homepage, publish/unpublish, order and delete. Public project lists and detail pages use only published database rows; saving invalidates their caches. The contact form submits through `/api/contact` into `contact_messages`; `/admin/messages` provides the private inbox, unread filters, read/unread actions and confirmed deletion. These features use existing tables, grants and storage policies without a new SQL migration. Contact details still use local data. `/admin` redirects unauthenticated visitors to `/admin/login`; both login and every management mutation verify administrator membership. Contact detail editing remains a subsequent step.

## Regenerate before first setup only

```sh
node --experimental-strip-types scripts/generate-supabase-setup.mjs
```

The generator uses public portfolio content only and never reads `.env.local`.

References: [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).
