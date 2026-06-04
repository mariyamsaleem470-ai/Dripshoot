import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { category, occasion, gender, ethnicity, background, platform } =
    await request.json();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return Response.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are a professional fashion social media copywriter. Write engaging captions with emojis and hashtags for fashion product posts.",
        },
        {
          role: "user",
          content: `Write a ${platform} caption for a ${category} product. Model: ${gender}, ${ethnicity}. Occasion: ${occasion}. Background: ${background}. Include 15 relevant hashtags. Format: Caption on first lines, then hashtags. Make it trendy, engaging and professional.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: `Groq error: ${text}` }, { status: res.status });
  }

  const data = await res.json();
  const caption = data.choices?.[0]?.message?.content ?? "";
  return Response.json({ caption });
}
