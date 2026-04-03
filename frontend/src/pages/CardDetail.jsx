import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCard } from '../api';

export default function CardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [error, setError] = useState(false);
  const [activeImageId, setActiveImageId] = useState(null);

  useEffect(() => {
    getCard(id)
      .then((data) => {
        setCard(data);
        if (data.images && data.images.length > 0) {
          setActiveImageId(data.images[0].id);
        }
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) return (
    <div className="page center-content">
      <p className="status-msg">Card not found.</p>
      <button className="btn" onClick={() => navigate('/')}>Back to Browse</button>
    </div>
  );

  if (!card) return <div className="page center-content"><p className="status-msg">Loading...</p></div>;

  const images = card.images || [];

  return (
    <div className="page center-content">
      <div className="detail-card">
        <button className="btn btn-secondary detail-back" onClick={() => navigate('/')}>
          ← Back
        </button>

        <div className="detail-body">
          <div className="detail-image-section">
            {images.length > 1 && (
              <div className="detail-thumb-rail">
                {images.map((img) => (
                  <button
                    key={img.id}
                    className={`detail-thumb${activeImageId === img.id ? ' detail-thumb--active' : ''}`}
                    onClick={() => setActiveImageId(img.id)}
                  >
                    <img src={`/api/images/${img.id}`} alt="" />
                  </button>
                ))}
              </div>
            )}
            <div className="detail-main-image">
              {activeImageId ? (
                <img src={`/api/images/${activeImageId}`} alt={card.name} />
              ) : (
                <div className="detail-main-image-placeholder" />
              )}
            </div>
          </div>

          <div className="detail-info">
            <div className="detail-rarity">{card.rarity?.name}</div>
            <h1 className="detail-name">{card.name}</h1>
            <p className="detail-set">{card.expansionSets?.map((s) => s.name).join(', ')}</p>

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
      </div>
    </div>
  );
}
