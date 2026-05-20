import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT_MAP: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json({ error: "File must be a JPEG, PNG, WebP, or GIF image" }, { status: 400 });
  }

  const ext = EXT_MAP[file.type];
  const filename = `${crypto.randomUUID()}.${ext}`;
  const bytes = await file.arrayBuffer();

  try {
    await mkdir(UPLOADS_DIR, { recursive: true });
    await writeFile(join(UPLOADS_DIR, filename), Buffer.from(bytes));
  } catch (err) {
    console.error("[/api/upload] Failed to write file:", err);
    return Response.json({ error: "Failed to save uploaded file" }, { status: 500 });
  }

  const responsePayload = { url: `/uploads/${filename}` };
  console.log("[/api/upload] returning:", JSON.stringify(responsePayload));
  return Response.json(responsePayload);
}
