export function recoveryErrorMessage(error: { code?: string; status?: number }) {
  switch (error.code) {
    case "over_email_send_rate_limit":
      return "Supabase's email sending limit has been reached. Wait before trying again, or configure a custom SMTP service in Supabase.";
    case "email_address_not_authorized":
      return "Supabase's default email service cannot send to this address. Configure a custom SMTP service in Supabase.";
    case "email_provider_disabled":
      return "Email sign-in is disabled in Supabase. Enable the Email provider; public signups can remain disabled.";
    case "over_request_rate_limit":
      return "Too many recovery requests. Wait a few minutes before trying again.";
    default:
      return error.status === 429
        ? "Too many recovery requests. Wait before trying again."
        : "Supabase could not send the recovery email. Check Authentication logs and email/SMTP settings in Supabase.";
  }
}
