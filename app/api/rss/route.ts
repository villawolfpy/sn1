import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';
import { stripTags } from '../../../lib/format';

const HOME_RSS = 'https://stacker.news/rss';
const TERRITORY_RSS = (t: string) => `https://stacker.news/~${encodeURIComponent(t)}/rss`;

export const runtime = 'edge';

async function fetchRSS(url: string) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SN Reader Mini App' },
  });
  if (!res.ok) throw new Error(`Failed to fetch RSS: ${res.status}`);
  return res.text();
}

function parseRSS(xml: string, territory?: string) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  });
  const data = parser.parse(xml);
  const items = data?.rss?.channel?.item || [];
  const normalized = (Array.isArray(items) ? items : [items])
    .filter(Boolean)
    .map((item: any, index: number) => {
      const link = item.link || '';
      return {
        id: item.guid || item.link || `item-${index}`,
        title: item.title || '',
        link,
        creator: item['dc:creator'] || item.creator || '',
        pubDate: item.pubDate || '',
        contentSnippet: stripTags(item.description || item['content:encoded'] || ''),
        territory: territory || null,
        commentsLink: item.comments || '',
        isExternal: !link.includes('stacker.news'),
      };
    });
  return normalized;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const territory = searchParams.get('territory');
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    const url = territory ? TERRITORY_RSS(territory) : HOME_RSS;
    const xml = await fetchRSS(url);
    const items = parseRSS(xml, territory || undefined);

    // For pagination, assume no nextPage for simplicity in MVP
    const nextPage = null;

    return NextResponse.json(
      { items, nextPage },
      {
        headers: {
          'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}