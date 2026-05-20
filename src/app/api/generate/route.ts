const FASHN_BASE = "https://api.fashn.ai/v1";
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40; // 2 minutes max

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[/api/generate] request body:", JSON.stringify(body));

  const { garmentImageUrl, gender, ethnicity, occasion } = body;

  if (!garmentImageUrl || !gender || !ethnicity || !occasion) {
    const missing = { garmentImageUrl, gender, ethnicity, occasion };
    console.warn("[/api/generate] missing fields:", missing);
    return Response.json(
      { error: "Missing required fields: garmentImageUrl, gender, ethnicity, occasion", received: missing },
      { status: 400 }
    );
  }

  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "FASHN_API_KEY not configured" }, { status: 500 });
  }

  const absoluteGarmentUrl = new URL(garmentImageUrl, request.url).toString();
  console.log("[/api/generate] resolved garment URL:", absoluteGarmentUrl);

  // Start generation job
  const fashnPayload = {
    model_name: "fashn/tryon",
    inputs: {
      model_image: "https://picsum.photos/800/1200",
      garment_image: absoluteGarmentUrl,
      category: "one-piece",
      mode: "quality",
      num_samples: 1,
    },
  };
  console.log("[/api/generate] sending to FASHN:", JSON.stringify(fashnPayload));

  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fashnPayload),
  });

  if (!runRes.ok) {
    const text = await runRes.text();
    console.error("[/api/generate] FASHN error response:", runRes.status, text);
    return Response.json(
      { error: `Failed to start generation: ${text}` },
      { status: runRes.status }
    );
  }

  const { id } = await runRes.json();

  // Poll until complete
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!statusRes.ok) {
      return Response.json(
        { error: "Failed to poll generation status" },
        { status: statusRes.status }
      );
    }

    const { status, output, error } = await statusRes.json();

    if (status === "completed") {
      return Response.json({ images: output });
    }

    if (status === "failed") {
      return Response.json({ error: error ?? "Generation failed" }, { status: 500 });
    }
  }

  return Response.json({ error: "Generation timed out" }, { status: 504 });
}
