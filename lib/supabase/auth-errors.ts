export function signInErrorMessage(error: { code?: string; status?: number }) {
  switch (error.code) {
    case "invalid_credentials":
      return "Email or password is incorrect.";
    case "email_not_confirmed":
      return "Your email is not confirmed. Verify the account email before signing in.";
    case "email_provider_disabled":
      return "Email and password sign-in is disabled for this Supabase project.";
    case "user_banned":
      return "This account is disabled. Check its status in Supabase Authentication.";
    case "over_request_rate_limit":
      return "Too many sign-in attempts. Wait a few minutes before trying again.";
    default:
      return error.status === 429
        ? "Too many sign-in attempts. Wait a few minutes before trying again."
        : "Supabase could not complete sign-in. Please try again.";
  }
}
