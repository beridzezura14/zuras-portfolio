import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/supabase/admin";
import { BodyTooLargeError, readLimitedBody } from "@/lib/security/request-body";

const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };
const maxSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Invalid upload origin." }, { status: 403 });
  const contentType = request.headers.get("content-type");
  if (!contentType?.toLowerCase().startsWith("multipart/form-data;")) return Response.json({ error: "Invalid upload format." }, { status: 415 });
  // Uploads use the authenticated session and the same admin/RLS checks as edits.
  const { supabase } = await requireAdmin();
  let form: FormData;
  try {
    const body = await readLimitedBody(request, maxSize + 65536);
    form = await new Response(body, { headers: { "Content-Type": contentType } }).formData();
  } catch (error) { return Response.json({ error: error instanceof BodyTooLargeError ? "Images must be 5 MB or smaller." : "Invalid upload." }, { status: error instanceof BodyTooLargeError ? 413 : 400 }); }
  const file = form.get("file");
  if (!(file instanceof File) || !file.size || file.size > maxSize || !types[file.type]) return Response.json({ error: "Choose a JPG, PNG, WebP, AVIF or GIF image up to 5 MB." }, { status: 400 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const matches = file.type === "image/jpeg" ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : file.type === "image/png" ? bytes.slice(0, 8).join(",") === "137,80,78,71,13,10,26,10"
    : file.type === "image/webp" ? ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP"
    : file.type === "image/gif" ? ["GIF87a", "GIF89a"].includes(ascii(0, 6))
    : ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12));
  if (!matches) return Response.json({ error: "The file does not match its image format." }, { status: 400 });
  const path = `projects/${randomUUID()}.${types[file.type]}`;
  const { error } = await supabase.storage.from("portfolio-media").upload(path, bytes, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) return Response.json({ error: "Unable to upload the image. Please try again." }, { status: 500 });
  return Response.json({ url: supabase.storage.from("portfolio-media").getPublicUrl(path).data.publicUrl });
}
