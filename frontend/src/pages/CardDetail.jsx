import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCard } from '../api';

export default function CardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCard(id)
      .then(setCard)
      .catch(() => setError(true));
  }, [id]);

  if (error) return (
    <div className="page center-content">
      <p className="status-msg">Card not found.</p>
      <button className="btn" onClick={() => navigate('/')}>Back to Browse</button>
    </div>
  );

  if (!card) return <div className="page center-content"><p className="status-msg">Loading...</p></div>;

  return (
    <div className="page center-content">
      <div className="detail-card">
        <button className="btn btn-secondary detail-back" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="detail-rarity">{card.rarity}</div>
        <h1 className="detail-name">{card.name}</h1>
        <p className="detail-set">{card.setName}</p>

        <div className="detail-attrs">
          <div className="detail-attr">
            <span className="attr-label">Condition</span>
            <span className="attr-value">{card.condition}</span>
          </div>
          <div className="detail-attr">
            <span className="attr-label">Stock</span>
            <span className="attr-value">{card.stock}</span>
          </div>
        </div>

        <div className="detail-price">${Number(card.price).toFixed(2)}</div>
      </div>
    </div>
  );
}
