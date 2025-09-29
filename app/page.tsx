'use client';

import { useState, useEffect } from 'react';
import TerritoryPicker from '../components/TerritoryPicker';
import PostCard from '../components/PostCard';
import PostDetail from '../components/PostDetail';
import { fetchRSS, RSSItem } from '../lib/rss';
import { ready } from '../lib/miniapp';
import { getStrings } from '../lib/i18n';

export default function Page() {
  const [territory, setTerritory] = useState<string | null>(null);
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<RSSItem | null>(null);
  const strings = getStrings('en');

  useEffect(() => {
    loadFeed();
  }, [territory]);

  useEffect(() => {
    if (!loading && items.length > 0) {
      ready();
    }
  }, [loading, items]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const data = await fetchRSS(territory || undefined);
      setItems(data.items);
    } catch (error) {
      console.error('Failed to load feed:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (selectedItem) {
    return <PostDetail item={selectedItem} onBack={() => setSelectedItem(null)} />;
  }

  return (
    <main style={{ padding: 16, maxWidth: 424, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>{strings.title}</h1>
      <TerritoryPicker onSelect={setTerritory} currentTerritory={territory} />
      {loading ? (
        <p>{strings.loading}</p>
      ) : items.length === 0 ? (
        <p>{strings.noPosts}</p>
      ) : (
        <div>
          {items.map((item) => (
            <PostCard key={item.id} item={item} onClick={setSelectedItem} />
          ))}
        </div>
      )}
    </main>
  );
}