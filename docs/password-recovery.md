# Admin password recovery

1. Supabase → Authentication → URL Configuration → Redirect URLs: add `http://localhost:3000/auth/recovery` for local development. Add `https://your-domain.com/auth/recovery` when deployed.
2. Set `NEXT_PUBLIC_SITE_URL` to the website origin (`http://localhost:3000` locally, the real HTTPS origin in production). Keep the production Supabase Site URL pointed at the real site. Restart the app after editing local environment settings.
3. Open `/admin/login` → **Forgot password?** Enter the existing account email, open its recovery email, then set and confirm a new password of 8–128 characters. Check the spam folder if needed. The existing admin account can recover its password with public signups disabled; Email sign-in remains enabled.

The default Supabase recovery email uses its standard confirmation link. Requests use the SSR PKCE flow and a verifier cookie, so open the email in the same browser used to request it. The callback at `/auth/recovery` exchanges the code, verifies the authenticated user and administrator membership, and redirects to `/admin/reset-password`. An invalid/expired link offers a fresh recovery request. Redirects use fixed paths, never a user-supplied `next` URL. Passwords, codes and tokens are not logged or returned in action state.

The password-update action verifies administrator access again, calls Supabase `updateUser`, attempts a global sign-out to revoke refresh sessions, and returns to sign-in. Already-issued access tokens may remain valid until their JWT expiry. Failure to revoke sessions is shown separately after a successful update.

No SQL migration or service-role key is needed. Supabase sends the email using the project's Auth email service; that service's SMTP restrictions and rate limits still apply. Delivery and redirect allowlist settings cannot be changed using the public project key.

## Optional email template for opening links on another browser/device

In Supabase → Authentication → Email Templates → Reset Password, use a link in this format instead of the default confirmation link:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=recovery">Reset password</a>
```

The callback also accepts that single-use recovery token hash, which does not need a browser-local PKCE verifier. Only `type=recovery` is accepted for token hashes. Email scanners can consume single-use verification links; if this occurs, request a new email and consider a separate confirmation landing page. This optional template was not changed remotely.

References: [Supabase password-based Auth](https://supabase.com/docs/guides/auth/passwords), [password reset requests](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
