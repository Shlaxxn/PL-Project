import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'savedDecks';

function loadDecks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDecks(decks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

function Home() {
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState('');
  const [deckUrl, setDeckUrl] = useState('');

  useEffect(() => {
    setDecks(loadDecks());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = deckName.trim();
    const url = deckUrl.trim();
    if (!name || !url) {
      alert('Both deck name and URL are required.');
      return;
    }
    const current = loadDecks();
    current.push({ name, url });
    saveDecks(current);
    setDecks(current);
    setDeckName('');
    setDeckUrl('');
  };

  const removeDeck = (idx) => {
    const updated = decks.filter((_, i) => i !== idx);
    saveDecks(updated);
    setDecks(updated);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '2rem auto', lineHeight: '1.5', padding: '0 1rem' }}>
      <nav style={{ marginBottom: '1.2rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
        <a href="home.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem', borderBottom: '2px solid #1e3a8a' }}>Decks</a>
        <a href="game-stats.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem' }}>Game Stats</a>
        <a href="deck-stats.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem' }}>Deck Stats</a>
      </nav>

      <h1 style={{ color: '#1e3a8a' }}>Deck URL Tracker</h1>
      <p>Save and open deck URLs for later visualizations.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.2rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', background: '#f9fafb' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', gap: '0.25rem' }}>
          Deck Name
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="e.g. My Main Deck"
            required
            style={{ padding: '0.55rem', fontSize: '1rem', border: '1px solid #ccd0d5', borderRadius: '4px' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', gap: '0.25rem' }}>
          Deck URL
          <input
            type="url"
            value={deckUrl}
            onChange={(e) => setDeckUrl(e.target.value)}
            placeholder="https://example.com/deck"
            required
            style={{ padding: '0.55rem', fontSize: '1rem', border: '1px solid #ccd0d5', borderRadius: '4px' }}
          />
        </label>
        <button type="submit" style={{ width: '150px', padding: '0.65rem 0.8rem', borderRadius: '5px', border: 'none', background: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Deck</button>
      </form>

      <div style={{ marginTop: '0.8rem' }}>
        <h2>Saved Decks</h2>
        {decks.length === 0 ? (
          <p>No saved decks yet.</p>
        ) : (
          decks.map((deck, idx) => (
            <div key={idx} style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: '7px', marginBottom: '0.65rem', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '0.7rem' }}>
              <p style={{ margin: '0' }}>
                <strong>{deck.name}</strong><br />
                <a href={deck.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a' }}>{deck.url}</a>
              </p>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <a href={deck.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.86rem', textDecoration: 'none', border: '1px solid #94a3b8', borderRadius: '4px', color: '#1e3a8a', background: '#f1f5f9', padding: '0.28rem 0.6rem' }}>Open</a>
                <button onClick={() => removeDeck(idx)} style={{ fontSize: '0.86rem', border: '1px solid #94a3b8', borderRadius: '4px', color: '#1e3a8a', background: '#f1f5f9', padding: '0.28rem 0.6rem', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;