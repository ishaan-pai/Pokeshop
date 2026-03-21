import { useEffect, useState } from 'react';
import { getCards, createCard, updateCard, deleteCard, markSold } from '../api';

const EMPTY_FORM = { name: '', setName: '', rarity: '', condition: '', price: '', stock: '' };

export default function AdminDashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCards = () => {
    setLoading(true);
    getCards()
      .then(setCards)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCards(); }, []);

  const openCreate = () => {
    setEditingCard(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (card) => {
    setEditingCard(card);
    setForm({
      name: card.name,
      setName: card.setName,
      rarity: card.rarity,
      condition: card.condition,
      price: String(card.price),
      stock: String(card.stock),
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10) };
    try {
      if (editingCard) {
        await updateCard(editingCard.id, payload);
      } else {
        await createCard(payload);
      }
      setModalOpen(false);
      fetchCards();
    } catch {
      setFormError('Failed to save card. Check your session and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this card?')) return;
    await deleteCard(id);
    fetchCards();
  };

  const handleMarkSold = async (id) => {
    await markSold(id);
    fetchCards();
  };

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1 className="page-title">Card Management</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Card</button>
      </div>

      {loading && <p className="status-msg">Loading...</p>}
      {!loading && cards.length === 0 && <p className="status-msg">No active listings.</p>}

      {!loading && cards.length > 0 && (
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Set</th>
                <th>Rarity</th>
                <th>Condition</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id}>
                  <td>{card.name}</td>
                  <td>{card.setName}</td>
                  <td>{card.rarity}</td>
                  <td>{card.condition}</td>
                  <td>${Number(card.price).toFixed(2)}</td>
                  <td>{card.stock}</td>
                  <td className="action-cell">
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(card)}>Edit</button>
                    <button className="btn btn-sm btn-sold" onClick={() => handleMarkSold(card.id)}>Mark Sold</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(card.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{editingCard ? 'Edit Card' : 'Add Card'}</h2>
            {formError && <p className="form-error">{formError}</p>}
            <form onSubmit={handleSave}>
              {[
                { label: 'Name', name: 'name', type: 'text' },
                { label: 'Set Name', name: 'setName', type: 'text' },
                { label: 'Rarity', name: 'rarity', type: 'text' },
                { label: 'Condition', name: 'condition', type: 'text' },
                { label: 'Price', name: 'price', type: 'number' },
                { label: 'Stock', name: 'stock', type: 'number' },
              ].map(({ label, name, type }) => (
                <label key={name} className="form-label">
                  {label}
                  <input
                    className="form-input"
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleFormChange}
                    required
                    step={name === 'price' ? '0.01' : undefined}
                    min={type === 'number' ? '0' : undefined}
                  />
                </label>
              ))}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
