export function recoveryRedirectUrl(configuredUrl: string | undefined, requestOrigin: string | null, development: boolean) {
  const configured = configuredUrl?.trim();
  const candidate = configured || (development ? requestOrigin : null);
  if (!candidate) throw new Error("Set NEXT_PUBLIC_SITE_URL to enable password recovery.");
  const url = new URL(candidate);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.username || url.password || url.protocol !== "https:" && !(url.protocol === "http:" && local)) throw new Error("Use an HTTPS website origin for password recovery.");
  if (!configured && !local) throw new Error("Set NEXT_PUBLIC_SITE_URL to enable password recovery.");
  return `${url.origin}/auth/recovery`;
}

export function validateNewPassword(password: unknown, confirmation: unknown): string {
  if (typeof password !== "string" || password.length < 8 || password.length > 128 || !password.trim()) throw new Error("Use a password between 8 and 128 characters.");
  if (password !== confirmation) throw new Error("The passwords do not match.");
  return password;
}
