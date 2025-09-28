import { NextResponse } from 'next/server';

async function getItems(territory?: string) {
  const url = territory
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/sn/rss?territory=${encodeURIComponent(territory)}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}/api/sn/rss`;
  const r = await fetch(url, { cache: 'no-store' });
  const j = await r.json();
  return j.items as Array<{ title: string; url: string; pubDate?: string; sats?: number; comments?: number }>;
}

function html(meta: Record<string, string>) {
  const tags = Object.entries(meta)
    .map(([k, v]) => `<meta property="${k}" content="${v}" />`)
    .join('\n');
  return `<!doctype html><html><head>${tags}</head><body></body></html>`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const territory = searchParams.get('territory') || undefined;

  const items = await getItems(territory);
  const first = items?.[0] || {
    title: 'No posts found',
    url: 'https://stacker.news',
    pubDate: '',
  };

  const og = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og?t=${encodeURIComponent(first.title)}&s=${encodeURIComponent(
    territory ? `~${territory}` : 'home'
  )}`;

  // Farcaster Frame vNext with LINK buttons only
  const meta = {
    'og:title': 'SN → Farcaster',
    'og:description': territory ? `Territory ~${territory}` : 'Home feed',
    'og:image': og,
    'fc:frame': 'vNext',

    // Button 1: Open the post on SN
    'fc:frame:button:1': '🔗 Abrir post',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': first.url,

    // Button 2: Open the territory or home
    'fc:frame:button:2': territory ? `🧭 Ver ~${territory}` : '🧭 Ver home SN',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': territory
      ? `https://stacker.news/~${encodeURIComponent(territory)}`
      : 'https://stacker.news',

    // Button 3: Onboarding (your referral landing)
    'fc:frame:button:3': '🧑‍🚀 Unirme a SN',
    'fc:frame:button:3:action': 'link',
    'fc:frame:button:3:target': `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/sn`,

    // Image for the frame
    'fc:frame:image': og,
  } as const;

  return new NextResponse(html(meta), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}