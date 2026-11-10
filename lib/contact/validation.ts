export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function validateContactMessage(value: unknown): ContactMessage {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Please check your message fields.");
  const data = value as Record<string, unknown>;
  function text(key: string, min: number, max: number, label: string) {
    const value = data[key];
    if (typeof value !== "string" || value.length > max || value.trim().length < min || value.includes("\0")) throw new Error(`Check ${label} (${min}–${max} characters).`);
    return value.trim();
  }
  const name = text("name", 1, 100, "your name");
  const email = text("email", 3, 254, "your email address").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  const subject = data.subject === undefined ? "" : text("subject", 0, 200, "the subject");
  const message = text("message", 10, 3000, "your message");
  return { name, email, subject, message };
}
