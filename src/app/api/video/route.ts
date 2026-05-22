import { NextRequest } from "next/server";

export const runtime = "nodejs";

const FASHN_BASE = "https://api.fashn.ai/v1";
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40;

export async function POST(request: NextRequest) {
  const { imageUrl, duration, resolution } = await request.json();

  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) return Response.json({ error: "FASHN_API_KEY not configured" }, { status: 500 });
  if (!imageUrl) return Response.json({ error: "imageUrl required" }, { status: 400 });

  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model_name: "image-to-video",
      inputs: { image: imageUrl, duration: duration ?? 5, resolution: resolution ?? "720p" },
    }),
  });

  if (!runRes.ok) {
    const text = await runRes.text();
    return Response.json({ error: `Failed to start: ${text}` }, { status: runRes.status });
  }

  const { id } = await runRes.json();

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusRes.ok) return Response.json({ error: "Poll failed" }, { status: statusRes.status });
    const { status, output, error } = await statusRes.json();
    if (status === "completed") return Response.json({ videoUrl: output[0] });
    if (status === "failed") return Response.json({ error: error ?? "Generation failed" }, { status: 500 });
  }

  return Response.json({ error: "Timed out" }, { status: 504 });
}
