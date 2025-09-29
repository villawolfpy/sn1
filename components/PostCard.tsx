'use client';

import { RSSItem } from '../lib/rss';
import { formatRelativeTime } from '../lib/format';

interface PostCardProps {
  item: RSSItem;
  onClick: (item: RSSItem) => void;
}

export default function PostCard({ item, onClick }: PostCardProps) {
  return (
    <div
      onClick={() => onClick(item)}
      style={{
        padding: 16,
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        marginBottom: 8,
        cursor: 'pointer',
        backgroundColor: '#fff',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 'bold' }}>{item.title}</h3>
      <p style={{ margin: '4px 0', fontSize: 14, color: '#666' }}>
        by {item.creator} • {formatRelativeTime(item.pubDate)}
      </p>
      {item.contentSnippet && (
        <p style={{ margin: '8px 0', fontSize: 14, color: '#333' }}>
          {item.contentSnippet.length > 100
            ? `${item.contentSnippet.substring(0, 100)}...`
            : item.contentSnippet}
        </p>
      )}
    </div>
  );
}