import React, { useState, useEffect } from 'react';

const DECK_STORAGE_KEY = 'savedDecks';
const GAME_STORAGE_KEY = 'savedGameStats';

function loadJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function DeckStats() {
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState('');
  const [stats, setStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const loadedDecks = loadJSON(DECK_STORAGE_KEY);
    setDecks(loadedDecks);
  }, []);

  useEffect(() => {
    const loadedStats = loadJSON(GAME_STORAGE_KEY);
    setStats(loadedStats);
  }, []);

  useEffect(() => {
    if (selectedDeck) {
      const filtered = stats.filter(s => s.deckName === selectedDeck);
      setFilteredStats(filtered);

      if (filtered.length > 0) {
        const totals = { wins: 0, losses: 0, draws: 0, turnSum: 0 };
        const seatData = {
          '1': { games: 0, wins: 0 },
          '2': { games: 0, wins: 0 },
          '3': { games: 0, wins: 0 },
          '4': { games: 0, wins: 0 },
        };

        filtered.forEach((stat) => {
          const result = stat.result.toLowerCase();
          if (result === 'win') totals.wins += 1;
          else if (result === 'loss' || result === 'lose' || result === 'loses') totals.losses += 1;
          else if (result === 'draw') totals.draws += 1;

          const turnNum = Number(stat.turn) || 0;
          totals.turnSum += turnNum;

          const seat = String(stat.seats);
          if (seatData[seat]) {
            seatData[seat].games += 1;
            if (result === 'win') {
              seatData[seat].wins += 1;
            }
          }
        });

        const totalGames = filtered.length;
        const avgTurn = totalGames ? (totals.turnSum / totalGames).toFixed(2) : '0.00';

        const seatRows = Object.entries(seatData).map(([seat, info]) => {
          const pct = info.games ? ((info.wins / info.games) * 100).toFixed(1) : '0.0';
          return `Seat ${seat}: ${info.wins}/${info.games} wins (${pct}%)`;
        });

        setSummary({
          totalGames,
          wins: totals.wins,
          losses: totals.losses,
          draws: totals.draws,
          avgTurn,
          seatRows,
        });
      } else {
        setSummary(null);
      }
    } else {
      setFilteredStats([]);
      setSummary(null);
    }
  }, [selectedDeck, stats]);

  const handleDeckChange = (e) => {
    setSelectedDeck(e.target.value);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '2rem auto', lineHeight: '1.5', padding: '0 1rem' }}>
      <nav style={{ marginBottom: '1.2rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
        <a href="home.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem' }}>Decks</a>
        <a href="game-stats.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem' }}>Game Stats</a>
        <a href="deck-stats.html" style={{ color: '#1e40af', marginRight: '1rem', fontWeight: '700', textDecoration: 'none', paddingBottom: '0.1rem', borderBottom: '2px solid #1e3a8a' }}>Deck Stats</a>
      </nav>

      <h1 style={{ color: '#1e3a8a' }}>Deck Stats Viewer</h1>
      <p>Choose a saved deck to see all matching saved game stats.</p>

      <label style={{ display: 'flex', flexDirection: 'column', fontWeight: '600', marginBottom: '0.8rem' }}>
        Select Deck
        <select value={selectedDeck} onChange={handleDeckChange} style={{ padding: '0.55rem', fontSize: '1rem', border: '1px solid #ccd0d5', borderRadius: '4px' }}>
          <option value="">-- Select a deck --</option>
          {decks.map((deck, idx) => (
            <option key={idx} value={deck.name}>{deck.name}</option>
          ))}
        </select>
      </label>

      {decks.length === 0 && (
        <div style={{ color: '#b91c1c', fontWeight: '600', marginBottom: '0.75rem' }}>
          No decks saved yet. Please add decks on the Decks page.
        </div>
      )}

      <section style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', background: '#f9fafb' }}>
        <h2>Game Stats</h2>
        {summary && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.7rem', marginBottom: '0.6rem' }}>
            <p><strong>Total Games:</strong> {summary.totalGames}</p>
            <p><strong>Wins:</strong> {summary.wins}</p>
            <p><strong>Losses:</strong> {summary.losses}</p>
            <p><strong>Draws:</strong> {summary.draws}</p>
            <p><strong>Average Turn:</strong> {summary.avgTurn}</p>
            <p><strong>Seat win rates:</strong></p>
            {summary.seatRows.map((row, idx) => (
              <p key={idx}>{row}</p>
            ))}
          </div>
        )}
        {!selectedDeck && <p>Select a deck to view aggregated stats.</p>}
        {selectedDeck && filteredStats.length === 0 && <p>No stats for this deck yet. Log games on the Game Stats page.</p>}
        {filteredStats.map((stat, idx) => (
          <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '0.7rem', marginBottom: '0.6rem' }}>
            <p><strong>Game {idx + 1}</strong></p>
            <p><strong>Deck:</strong> {stat.deckName}</p>
            <p><strong>Seats:</strong> {stat.seats}</p>
            <p><strong>Result:</strong> {stat.result}</p>
            <p><strong>Turn:</strong> {stat.turn}</p>
            <p><strong>Notes:</strong> {stat.notes || 'No notes'}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default DeckStats;


