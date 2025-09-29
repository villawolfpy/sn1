'use client';

import { RSSItem } from '../lib/rss';
import { timeAgo, stripTags, truncate } from '../lib/format';

interface PostCardProps {
  item: RSSItem;
  onClick: (item: RSSItem) => void;
}

export default function PostCard({ item, onClick }: PostCardProps) {
  return (
    <div
      onClick={() => onClick(item)}
      role="listitem"
      style={{
        padding: 12,
        border: '1px solid #ddd',
        borderRadius: 8,
        marginBottom: 10,
        cursor: 'pointer',
        backgroundColor: '#fff',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }} aria-label={item.title}>{item.title}</h2>
      <p style={{ margin: '4px 0', fontSize: '0.9em', color: '#555' }}>
        {timeAgo(item.pubDate)}
      </p>
      <p style={{ margin: '8px 0', fontSize: 14, color: '#333' }}>
        {item.contentSnippet ? truncate(stripTags(item.contentSnippet), 100) : 'No preview available'}
      </p>
    </div>
  );
}