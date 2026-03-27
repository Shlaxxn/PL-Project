import React, { useState, useEffect } from 'react';

const GAME_STORAGE_KEY = 'savedGameStats';
const DECK_STORAGE_KEY = 'savedDecks';

function loadData() {
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function loadDecks() {
  try {
    const raw = localStorage.getItem(DECK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveData(items) {
  localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(items));
}

function GameStats() {
  const [stats, setStats] = useState([]);
  const [decks, setDecks] = useState([]);
  const [deckName, setDeckName] = useState('');
  const [seats, setSeats] = useState('');
  const [result, setResult] = useState('');
  const [turn, setTurn] = useState('');
  const [notes, setNotes] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setStats(loadData());
    const loadedDecks = loadDecks();
    setDecks(loadedDecks);
    setShowWarning(loadedDecks.length === 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (decks.length === 0) {
      alert('Please add at least one deck before saving game stats.');
      return;
    }
    if (!deckName || !seats || !result || !turn) {
      alert('Deck name, seats, result, and turn are required.');
      return;
    }
    const newStats = [...stats, { deckName, seats, result, turn, notes }];
    saveData(newStats);
    setStats(newStats);
    setDeckName('');
    setSeats('');
    setResult('');
    setTurn('');
    setNotes('');
  };

  const removeStat = (idx) => {
    const updated = stats.filter((_, i) => i !== idx);
    saveData(updated);
    setStats(updated);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '2rem auto', lineHeight: '1.5', padding: '0 1rem' }}>
      <nav style={{ marginBottom: '1.2rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
        <a href="home.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem' }}>Decks</a>
        <a href="game-stats.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem', borderBottom: '2px solid #1e3a8a' }}>Game Stats</a>
        <a href="deck-stats.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem' }}>Deck Stats</a>
      </nav>

      <h1 style={{ color: '#1e3a8a' }}>Game Stats Tracker</h1>
      <p>Log games with deck name, seats, result, turn, and notes.</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.2rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', background: '#f9fafb' }}>
        {showWarning && (
          <div style={{ color: '#b91c1c', fontWeight: '600', marginBottom: '0.5rem' }}>
            Please add at least one deck on the Decks page before saving game stats.
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.8rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', gap: '0.25rem' }}>
            Deck Name
            <select value={deckName} onChange={(e) => setDeckName(e.target.value)} required style={{ padding: '0.55rem', fontSize: '1rem', border: '1px solid #ccd0d5', borderRadius: '4px' }}>
              <option value="">Select a deck name</option>
              {decks.map((deck, idx) => (
                <option key={idx} value={deck.name}>{deck.name}</option>
              ))}
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', gap: '0.25rem' }}>
            Seats
            <select value={seats} onChange={(e) => setSeats(e.target.value)} required style={{ padding: '0.55rem', fontSize: '1rem', border: '1px solid #ccd0d5', borderRadius: '4px' }}>
              <option value="">Select seats</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.8rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', gap: '0.25rem' }}>
            Game Result
            <select value={result} onChange={(e) => setResult(e.target.value)} required style={{ padding: '0.55rem', fontSize: '1rem', border: '1px solid #ccd0d5', borderRadius: '4px' }}>
              <option value="">Select result</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="Draw">Draw</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', gap: '0.25rem' }}>
            Turn
            <input type="number" min="1" placeholder="Turn count" value={turn} onChange={(e) => setTurn(e.target.value)} required style={{ padding: '0.55rem', fontSize: '1rem', border: '1px solid #ccd0d5', borderRadius: '4px' }} />
          </label>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', gap: '0.25rem', gridColumn: 'span 2' }}>
          Notes
          <textarea placeholder="Optional notes" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ padding: '0.55rem', fontSize: '1rem', border: '1px solid #ccd0d5', borderRadius: '4px', minHeight: '80px', resize: 'vertical' }} />
        </label>
        <button type="submit" disabled={decks.length === 0} style={{ width: '150px', padding: '0.65rem 0.8rem', borderRadius: '5px', border: 'none', background: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Save Game</button>
      </form>

      <div style={{ marginTop: '0.8rem' }}>
        <h2>Saved Game Stats</h2>
        {stats.length === 0 ? (
          <p>No game stats saved yet.</p>
        ) : (
          stats.map((stat, idx) => (
            <div key={idx} style={{ border: '1px solid #e5e7eb', padding: '0.75rem', borderRadius: '7px', marginBottom: '0.65rem', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'start', gap: '0.7rem' }}>
              <div>
                <p style={{ margin: '0.05rem 0' }}><strong>{stat.deckName}</strong> | Seats: {stat.seats} | Result: {stat.result} | Turn: {stat.turn}</p>
                <p style={{ margin: '0.05rem 0' }}>{stat.notes || '<em>No notes</em>'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'start' }}>
                <button onClick={() => removeStat(idx)} style={{ fontSize: '0.86rem', border: '1px solid #94a3b8', borderRadius: '4px', color: '#1e3a8a', background: '#f1f5f9', padding: '0.28rem 0.6rem', cursor: 'pointer' }}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}