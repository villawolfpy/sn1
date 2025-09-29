'use client';

import { RSSItem } from '../lib/rss';
import { formatRelativeTime } from '../lib/format';
import { getStrings } from '../lib/i18n';

interface PostDetailProps {
  item: RSSItem;
  onBack: () => void;
}

export default function PostDetail({ item, onBack }: PostDetailProps) {
  const strings = getStrings('en');

  return (
    <div style={{ padding: 16 }}>
      <button
        onClick={onBack}
        style={{
          padding: '8px 16px',
          backgroundColor: '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        {strings.back}
      </button>
      <h2 style={{ marginTop: 0 }}>{item.title}</h2>
      <p style={{ color: '#666' }}>
        by {item.creator} • {formatRelativeTime(item.pubDate)}
      </p>
      {item.contentSnippet && (
        <p style={{ lineHeight: 1.6 }}>{item.contentSnippet}</p>
      )}
      <div style={{ marginTop: 16 }}>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 4,
            display: 'inline-block',
          }}
        >
          {strings.openInSN}
        </a>
      </div>
    </div>
  );
}