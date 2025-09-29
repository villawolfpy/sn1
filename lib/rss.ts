export interface RSSItem {
  id: string;
  title: string;
  link: string;
  creator: string;
  pubDate: string;
  contentSnippet: string;
  territory: string | null;
  commentsLink: string;
  isExternal: boolean;
}

export interface RSSResponse {
  items: RSSItem[];
  nextPage: number | null;
}

export async function fetchRSS(territory?: string, page: number = 1): Promise<RSSResponse> {
  const params = new URLSearchParams();
  if (territory) params.set('territory', territory);
  params.set('page', page.toString());
  const res = await fetch(`/api/rss?${params}`);
  if (!res.ok) throw new Error('Failed to fetch RSS');
  return res.json();
}