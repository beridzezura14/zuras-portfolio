# Security review — 31 October 2026

The review covered source code, installed dependencies, local HTTP responses, public-key-only checks against the connected Supabase project, and the database schema in an isolated PostgreSQL test environment. No live messages, users, administrator memberships or content were changed. Authenticated live-session testing and inspection of deployed database definitions were not available; local schema tests do not establish that every policy deployed remotely matches the source.

## Findings and status

| Priority | Finding | Status |
| --- | --- | --- |
| Medium | Direct Data API inserts bypass the contact endpoint's in-memory rate limit. | Prepared `supabase/security-hardening.sql`. **Not applied to the live database.** It adds a trigger enforcing three submissions per email per minute and thirty total per minute, including direct API inserts. Case differences cannot bypass the email limit; a transaction advisory lock prevents concurrent count/insert races. |
| Medium | Supabase public account registration is enabled (`disable_signup: false`). The portfolio has no public account feature. This permits unwanted Auth accounts, although membership checks prevent them from becoming admins. | Owner must turn off **Allow new users to sign up** in Supabase Authentication settings. Keep the Email sign-in provider enabled for the existing administrator. No Auth accounts were created during verification. |
| Medium | Multipart uploads were fully buffered before actual file-size validation; a missing or false Content-Length could bypass the early request limit. | Fixed. Actual request bytes are capped before multipart parsing, at 5 MB plus 64 KB of multipart overhead. Existing file-size, type, signature, origin and administrator checks remain. |
| Medium | Administrative responses should explicitly forbid shared caching. | Fixed. The session proxy sets `Cache-Control: private, no-store, max-age=0` and `Pragma: no-cache`. Verified on local admin/login and inbox responses. |
| Low | Browser security response headers were absent. | Fixed. Frame blocking, MIME sniffing prevention, referrer policy, restricted device permissions, and a limited CSP protecting framing, objects, base URLs and form destinations. HSTS is emitted in production; the framework identification header is disabled. |
| Medium / development only | `minimatch` advisory GHSA-g3hv-75wg-m249 affects the ESLint dependency graph. npm reports 16 affected dependency entries, all moderate, stemming from this advisory. | Open. Installed branches include 3.1.5 and 10.2.6; the advisory identifies 11.0.1 as patched. A forced major override/downgrade would need compatibility work. No blanket `npm audit fix --force` was used. |
| Medium / additional hardening | The website admin login uses email/password and has no application MFA challenge or AAL2 enforcement. | Open. Adding MFA requires enrollment and a recovery flow before enforcement. Supabase dashboard-account MFA alone does not add MFA to this website login. |

The CSP intentionally does not claim to provide a complete script policy: no `script-src` restriction or nonce-based policy was introduced. Such a change requires testing the theme bootstrap, Next.js scripts and rendering strategy together.

## Verified protections

- Every content/project/inbox mutation calls `requireAdmin()` before accessing the database. It verifies the user with `auth.getUser()` and checks `public.is_admin()`; authorization is not delegated solely to the sidebar or proxy.
- Anonymous live Supabase requests received 401 for inbox reads and the administrator RPC. An explicit draft query returned no visible records; no private record data was printed.
- Local SQL tests confirmed administrator-only management, private messages, visitor submission field restrictions, trigger rate limiting, global-limit/email-limit enforcement and recovery after the time window. The migration is safe to rerun and preserves existing content.
- Uploads accept raster formats only, restrict files to 5 MB, check signatures, and use generated object paths. Next Image remote patterns are limited to this project's public media bucket. Images in that bucket are public even when associated with a draft.
- Form/content inputs have server validation and length limits. Stored user text is rendered by React as text; the only `dangerouslySetInnerHTML` use is a fixed theme bootstrap script without user content.
- `.env.local` is ignored by Git. The current public JavaScript bundle scan found zero occurrences of the one configured non-public environment value. This check does not establish whether credentials were ever exposed outside this checkout.
- `npm audit --omit=dev`: **0 reported vulnerabilities**. Full audit: **16 moderate development dependency entries, 0 high, 0 critical**. These are registry results at review time, not a guarantee that no unknown vulnerability exists.
- Production build, targeted ESLint/TypeScript checks, bounded-stream tests, HTTP header checks, invalid-request tests and isolated database tests passed.

## Apply the database protection

Paste the entire contents of `supabase/security-hardening.sql` into the project's Supabase SQL Editor and run it. Existing messages and their read status are preserved. The application understands the trigger's rate-limit error and shows a retry message.

New installations using the regenerated `supabase/setup.sql` include the same protection. Existing installations only need the small hardening file. The process-local limiter and honeypot remain useful additional checks; a CAPTCHA/WAF can further reduce bots and denial of service, but neither an email limit nor an Origin header establishes a human identity.

## References

- [Supabase Auth general configuration](https://supabase.com/docs/guides/auth/general-configuration)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase database function security](https://supabase.com/docs/guides/database/functions)
- [minimatch advisory GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
- [Next.js security advisories](https://github.com/vercel/next.js/security/advisories)
