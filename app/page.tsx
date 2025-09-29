'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TerritoryPicker from '../components/TerritoryPicker';
import PostCard from '../components/PostCard';
import PostDetail from '../components/PostDetail';
import { fetchRSS, RSSItem } from '../lib/rss';
import { ready } from '../lib/miniapp';
import { getStrings } from '../lib/i18n';

export const dynamic = 'force-dynamic';

export default function Page() {
  const router = useRouter();
  const [territory, setTerritory] = useState<string | null>(null);
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<RSSItem | null>(null);
  const strings = getStrings('es');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTerritory(params.get('t') || null);
  }, []);

  useEffect(() => {
    loadFeed();
  }, [territory]);

  useEffect(() => {
    if (!loading && items.length > 0) {
      ready();
    }
  }, [loading, items]);

  const handleTerritoryChange = (newTerritory: string | null) => {
    setTerritory(newTerritory);
    const params = new URLSearchParams(window.location.search);
    if (newTerritory) {
      params.set('t', newTerritory);
    } else {
      params.delete('t');
    }
    router.replace(`?${params}`, { scroll: false });
  };

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
      <TerritoryPicker onSelect={handleTerritoryChange} currentTerritory={territory} />
      {loading ? (
        <p>{strings.loading}</p>
      ) : items.length === 0 ? (
        <p>{strings.noPosts}</p>
      ) : (
        <div role="list">
          {items.map((item) => (
            <PostCard key={item.id} item={item} onClick={setSelectedItem} />
          ))}
        </div>
      )}
    </main>
  );
}