import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get("mood") ?? "fashion";
  const page = searchParams.get("page") ?? "1";

  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return Response.json({ tracks: [] });

  try {
    const res = await fetch(
      `https://pixabay.com/api/videos/music/?key=${apiKey}&q=${encodeURIComponent(mood)}&per_page=12&page=${page}`
    );
    const data = await res.json();
    return Response.json({ tracks: data.hits ?? [] });
  } catch {
    return Response.json({ tracks: [] });
  }
}
