import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCards } from '../api';

const RARITIES = ['All', 'Common', 'Uncommon', 'Rare', 'Holo Rare', 'Ultra Rare', 'Secret Rare'];
const CONDITIONS = ['All', 'Mint', 'Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'];

export default function CardBrowser() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [rarity, setRarity] = useState('All');
  const [condition, setCondition] = useState('All');

  useEffect(() => {
    getCards()
      .then(setCards)
      .finally(() => setLoading(false));
  }, []);

  const filtered = cards.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesRarity = rarity === 'All' || c.rarity === rarity;
    const matchesCondition = condition === 'All' || c.condition === condition;
    return matchesSearch && matchesRarity && matchesCondition;
  });

  return (
    <div className="page">
      <h1 className="page-title">Card Listings</h1>

      <div className="filters">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-select" value={rarity} onChange={(e) => setRarity(e.target.value)}>
          {RARITIES.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select className="filter-select" value={condition} onChange={(e) => setCondition(e.target.value)}>
          {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {loading && <p className="status-msg">Loading cards...</p>}
      {!loading && filtered.length === 0 && <p className="status-msg">No cards found.</p>}

      <div className="card-grid">
        {filtered.map((card) => (
          <Link to={`/cards/${card.id}`} key={card.id} className="card-tile">
            <div className="card-tile-rarity">{card.rarity}</div>
            <h2 className="card-tile-name">{card.name}</h2>
            <p className="card-tile-set">{card.setName}</p>
            <div className="card-tile-footer">
              <span className="card-tile-condition">{card.condition}</span>
              <span className="card-tile-price">${Number(card.price).toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
