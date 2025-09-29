'use client';

import { getStrings } from '../lib/i18n';

interface TerritoryPickerProps {
  onSelect: (territory: string | null) => void;
  currentTerritory: string | null;
}

const territories = [
  'art', 'Contruction_and_Engineering', 'dotnet', 'ideasfromtheedge', 'mempool', 'openagents', 'bitdevs', 'DIY', 'Animal_World', 'aliens_and_UFOs', 'bitcoin_Mining', 'lol', 'science', 'lightning', 'food_and_drinks', 'bitcoin', 'nostr', 'tech', 'Design', 'devs', 'Memes', 'news', 'BooksAndArticles', 'HealthAndFitness', 'Photography', 'Stacker_Sports', 'Politics_And_law', 'bitcoin_beginners', 'spirituality', 'econ', 'alter_nat', 'AskSN', 'Cartalk', 'crypto', 'Education', 'events', 'gaming', 'movies', 'music', 'oracle', 'podcasts', 'security', 'Video', 'charts_and_numbers', 'AGORA', 'meta', 'culture', 'tutorials', 'FiresidePhilosophy', 'mostly_harmless', 'privacy', 'AMA', 'builders', 'jobs'
];

export default function TerritoryPicker({ onSelect, currentTerritory }: TerritoryPickerProps) {
  const strings = getStrings('es');

  return (
    <div style={{ marginBottom: 16 }}>
      <select
        value={currentTerritory || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        style={{
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: 4,
          width: 250,
        }}
      >
        <option value="">{strings.homepage}</option>
        {territories.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}