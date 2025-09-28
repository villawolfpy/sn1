import { NextResponse } from 'next/server';
import Parser from 'fast-xml-parser';

const HOME_RSS = 'https://stacker.news/rss';
const TERRITORY_RSS = (t: string) => `https://stacker.news/~${encodeURIComponent(t)}/rss`;

async function fetchText(url: string) {
  const res = await fetch(url, { next: { revalidate: 120 } }); // cache 120s
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  return res.text();
}

function normalizeItems(xml: string) {
  const parser = new Parser.XMLParser({ ignoreAttributes: false });
  const j = parser.parse(xml);
  const items = j?.rss?.channel?.item ?? [];
  return (Array.isArray(items) ? items : [items]).filter(Boolean).map((it: any) => {
    const title: string = it.title ?? '';
    const link: string = it.link ?? '';
    const pubDate: string = it.pubDate ?? '';
    const description: string = it.description ?? '';
    // best-effort: try to infer sats/comments from title/description (SN often embeds counts)
    const m = /([0-9]+)\ssats?.*?([0-9]+)\scomments?/i.exec(title + ' ' + description) || [];
    const sats = m[1] ? parseInt(m[1], 10) : undefined;
    const comments = m[2] ? parseInt(m[2], 10) : undefined;
    return { title, url: link, pubDate, sats, comments };
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const territory = searchParams.get('territory');
  try {
    const xml = await fetchText(territory ? TERRITORY_RSS(territory) : HOME_RSS);
    const items = normalizeItems(xml);
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}