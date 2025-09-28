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

  let currentIndex = 0;
  if (itemId) {
    const found = items.findIndex((it) => it.url?.includes(`/items/${itemId}`));
    if (found !== -1) currentIndex = found;
  }

  const first = items[currentIndex] || { title: "No posts found", url: "https://stacker.news" };

  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const subtitle = territory ? `~${territory}` : `item #${currentIndex + 1}`;
  const og = `${base}/api/og?t=${encodeURIComponent(first.title)}&s=${encodeURIComponent(subtitle)}`;

  const state = JSON.stringify({ index: currentIndex, territory: territory || null });

  const meta: Record<string, string> = {
    "og:title": "SN → Farcaster",
    "og:description": `Stacker News • ${subtitle}`,
    "og:image": og,

    "fc:frame": "vNext",
    "fc:frame:image": og,
    "fc:frame:post_url": `${base}/frame`,
    "fc:frame:state": state,

    "fc:frame:button:1": "🔗 Abrir post",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": first.url,

    "fc:frame:button:2": "▶️ Siguiente",
    "fc:frame:button:2:action": "post",

    "fc:frame:button:3": "◀️ Anterior",
    "fc:frame:button:3:action": "post",

    "fc:frame:button:4": "🏠 Home",
    "fc:frame:button:4:action": "post",
  };

  return new NextResponse(html(meta), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { untrustedData } = body;
  const buttonIndex = untrustedData.buttonIndex;
  const state = JSON.parse(untrustedData.state || '{}');
  let { index = 0, territory = null } = state;

  const items = await getItems(territory);

  if (buttonIndex === 2) { // Next
    index = (index + 1) % items.length;
  } else if (buttonIndex === 3) { // Prev
    index = index - 1;
    if (index < 0) index = items.length - 1;
  } else if (buttonIndex === 4) { // Home
    index = 0;
    territory = null;
    // Refetch items without territory
    const newItems = await getItems(territory);
    // But since index 0, use newItems[0]
  }

  // If territory changed, refetch
  const finalItems = territory !== state.territory ? await getItems(territory) : items;
  const first = finalItems[index] || { title: "No posts found", url: "https://stacker.news" };

  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const subtitle = territory ? `~${territory}` : `item #${index + 1}`;
  const og = `${base}/api/og?t=${encodeURIComponent(first.title)}&s=${encodeURIComponent(subtitle)}`;

  const newState = JSON.stringify({ index, territory });

  const meta: Record<string, string> = {
    "og:title": "SN → Farcaster",
    "og:description": `Stacker News • ${subtitle}`,
    "og:image": og,

    "fc:frame": "vNext",
    "fc:frame:image": og,
    "fc:frame:post_url": `${base}/frame`,
    "fc:frame:state": newState,

    "fc:frame:button:1": "🔗 Abrir post",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": first.url,

    "fc:frame:button:2": "▶️ Siguiente",
    "fc:frame:button:2:action": "post",

    "fc:frame:button:3": "◀️ Anterior",
    "fc:frame:button:3:action": "post",

    "fc:frame:button:4": "🏠 Home",
    "fc:frame:button:4:action": "post",
  };

  return new NextResponse(html(meta), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
