'use client';

import { useState, useEffect } from 'react';
import { RSSItem } from '../lib/rss';
import { timeAgo, stripTags, truncate, getDomain } from '../lib/format';
import { getStrings } from '../lib/i18n';

interface PostDetailProps {
  item: RSSItem;
  onBack: () => void;
}

interface PreviewData {
  ok: boolean;
  domain?: string;
  description?: string;
  reason?: string;
}

export default function PostDetail({ item, onBack }: PostDetailProps) {
  const strings = getStrings('es');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (item.isExternal) {
      setLoadingPreview(true);
      fetch(`/api/preview?url=${encodeURIComponent(item.link)}`)
        .then(res => res.json())
        .then(setPreview)
        .catch(() => setPreview({ ok: false, reason: 'fetch_error' }))
        .finally(() => setLoadingPreview(false));
    }
  }, [item]);

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
      <h1 style={{ marginTop: 0, fontSize: 18, fontWeight: 600 }}>{item.title}</h1>
      <p style={{ color: '#666', fontSize: '0.9em' }}>
        {timeAgo(item.pubDate)}
      </p>
      {item.isExternal ? (
        loadingPreview ? (
          <p>Cargando vista previa...</p>
        ) : preview?.ok ? (
          <div>
            <p style={{ color: '#666' }}>{preview.domain}</p>
            <p style={{ lineHeight: 1.6 }}>{truncate(preview.description || '', 400)}</p>
          </div>
        ) : (
          <p>No pudimos cargar la vista previa.</p>
        )
      ) : (
        item.contentSnippet && (
          <p style={{ lineHeight: 1.6 }}>{stripTags(item.contentSnippet)}</p>
        )
      )}
      <div style={{ marginTop: 16 }}>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.6rem 1rem',
            backgroundColor: '#1677ff',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            display: 'inline-block',
          }}
        >
          {item.isExternal ? 'Abrir enlace' : strings.openInSN}
        </a>
      </div>
    </div>
  );
}