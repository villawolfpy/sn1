// app/frame/route.tsx
import { NextResponse } from "next/server";

type Item = { title: string; url: string; pubDate?: string; sats?: number; comments?: number };

async function getItems(territory?: string): Promise<Item[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const url = territory
    ? `${base}/api/sn/rss?territory=${encodeURIComponent(territory)}`
    : `${base}/api/sn/rss`;
  const r = await fetch(url, { cache: "no-store" });
  const j = await r.json();
  return (j.items || []) as Item[];
}

function html(meta: Record<string, string>) {
  const tags = Object.entries(meta)
    .map(([k, v]) => `<meta property="${k}" content="${v}" />`)
    .join("\n");
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>SN → Farcaster</title>
    ${tags}
    <meta property="og:type" content="website" />
  </head>
  <body></body>
</html>`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const territory = searchParams.get("territory") || undefined;
  const itemId = searchParams.get("item") || undefined;

  const items = await getItems(territory);

  let first: Item | undefined;
  if (itemId) first = items.find((it) => it.url?.includes(`/items/${itemId}`));
  if (!first) first = items[0] || { title: "No posts found", url: "https://stacker.news" };

  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const subtitle = territory ? `~${territory}` : itemId ? `item #${itemId}` : "home";
  const og = `${base}/api/og?t=${encodeURIComponent(first.title)}&s=${encodeURIComponent(subtitle)}`;

  const meta: Record<string, string> = {
    "og:title": "SN → Farcaster",
    "og:description": `Stacker News • ${subtitle}`,
    "og:image": og,

    "fc:frame": "vNext",
    "fc:frame:image": og,

    "fc:frame:button:1": "🔗 Abrir post",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": first.url,

    "fc:frame:button:2": territory ? `🧭 Ver ~${territory}` : "🧭 Ver home SN",
    "fc:frame:button:2:action": "link",
    "fc:frame:button:2:target": territory
      ? `https://stacker.news/~${encodeURIComponent(territory)}`
      : "https://stacker.news",

    "fc:frame:button:3": "🧑‍🚀 Unirme a SN",
    "fc:frame:button:3:action": "link",
    "fc:frame:button:3:target": `${base}/onboarding/sn`,
  };

  return new NextResponse(html(meta), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
