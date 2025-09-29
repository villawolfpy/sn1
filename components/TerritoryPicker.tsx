'use client';

import { useState } from 'react';
import { getStrings } from '../lib/i18n';

interface TerritoryPickerProps {
  onSelect: (territory: string | null) => void;
  currentTerritory: string | null;
}

const commonTerritories = ['bitcoin', 'tech', 'nostr', 'meta', 'jobs'];

export default function TerritoryPicker({ onSelect, currentTerritory }: TerritoryPickerProps) {
  const [input, setInput] = useState(currentTerritory || '');
  const strings = getStrings('en'); // or detect language

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(input.trim() || null);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => onSelect(null)}
        style={{
          marginRight: 8,
          padding: '8px 16px',
          backgroundColor: currentTerritory ? '#f0f0f0' : '#007bff',
          color: currentTerritory ? '#000' : '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        {strings.homepage}
      </button>
      <form onSubmit={handleSubmit} style={{ display: 'inline' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={strings.enterTerritory}
          list="territories"
          style={{
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: 4,
            width: 200,
          }}
        />
        <datalist id="territories">
          {commonTerritories.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <button
          type="submit"
          style={{
            marginLeft: 8,
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Go
        </button>
      </form>
    </div>
  );
}