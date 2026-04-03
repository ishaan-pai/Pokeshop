import { useEffect, useState } from 'react';
import {
  getCards, createCard, updateCard, deleteCard, markSold,
  getRarities, getSets, createRarity, createSet,
} from '../api';

const EMPTY_FORM = { name: '', condition: '', price: '', stock: '' };

export default function AdminDashboard() {
  const [cards, setCards] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [rarityId, setRarityId] = useState('');
  const [expansionSetIds, setExpansionSetIds] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Inline add-new state
  const [addingRarity, setAddingRarity] = useState(false);
  const [newRarityName, setNewRarityName] = useState('');
  const [rarityAddError, setRarityAddError] = useState('');
  const [addingSet, setAddingSet] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [setAddError, setSetAddError] = useState('');

  const fetchCards = () => {
    setLoading(true);
    getCards().then(setCards).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCards();
    getRarities().then(setRarities);
    getSets().then(setSets);
  }, []);

  const openCreate = () => {
    setEditingCard(null);
    setForm(EMPTY_FORM);
    setRarityId('');
    setExpansionSetIds([]);
    setImageFiles([]);
    setFormError('');
    setAddingRarity(false);
    setNewRarityName('');
    setAddingSet(false);
    setNewSetName('');
    setModalOpen(true);
  };

  const openEdit = (card) => {
    setEditingCard(card);
    setForm({
      name: card.name,
      condition: card.condition,
      price: String(card.price),
      stock: String(card.stock),
    });
    setRarityId(card.rarity ? String(card.rarity.id) : '');
    setExpansionSetIds(card.expansionSets ? card.expansionSets.map((s) => s.id) : []);
    setImageFiles([]);
    setFormError('');
    setAddingRarity(false);
    setNewRarityName('');
    setAddingSet(false);
    setNewSetName('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleSet = (id) => {
    setExpansionSetIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleAddRarity = async () => {
    if (!newRarityName.trim()) return;
    setRarityAddError('');
    try {
      const created = await createRarity(newRarityName.trim());
      setRarities((prev) => [...prev, created]);
      setRarityId(String(created.id));
      setAddingRarity(false);
      setNewRarityName('');
    } catch {
      setRarityAddError('Failed to add rarity.');
    }
  };

  const handleAddSet = async () => {
    if (!newSetName.trim()) return;
    setSetAddError('');
    try {
      const created = await createSet(newSetName.trim());
      setSets((prev) => [...prev, created]);
      setExpansionSetIds((prev) => [...prev, created.id]);
      setAddingSet(false);
      setNewSetName('');
    } catch {
      setSetAddError('Failed to add set.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!editingCard && imageFiles.length === 0) {
      setFormError('At least one image is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingCard) {
        await updateCard(editingCard.id, {
          name: form.name,
          condition: form.condition,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
          rarityId: rarityId ? Number(rarityId) : null,
          expansionSetIds,
        });
      } else {
        const cardData = {
          name: form.name,
          condition: form.condition,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
          ...(rarityId && { rarityId }),
          expansionSetIds,
        };
        const result = await createCard(cardData, imageFiles);
        if (result.status === 400 || result.error) {
          setFormError(result.message || result.error || 'Failed to save card.');
          setSaving(false);
          return;
        }
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
                <th>Rarity</th>
                <th>Sets</th>
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
                  <td>{card.rarity?.name ?? '—'}</td>
                  <td>{card.expansionSets?.map((s) => s.name).join(', ') || '—'}</td>
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
                { label: 'Condition', name: 'condition', type: 'text' },
                { label: 'Price', name: 'price', type: 'number' },
                { label: 'Stock', name: 'stock', type: 'number' },
              ].map(({ label, name, type }) => (
                <label key={name} className="form-label">
                  {label}
                  <input
                    className={`form-input${name === 'price' ? ' no-spinner' : ''}`}
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

              {/* Rarity */}
              <label className="form-label">
                Rarity
                <select
                  className="form-input"
                  value={rarityId}
                  onChange={(e) => setRarityId(e.target.value)}
                >
                  <option value="">— None —</option>
                  {rarities.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </label>
              {addingRarity ? (
                <div className="inline-add">
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Rarity name"
                    value={newRarityName}
                    onChange={(e) => setNewRarityName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRarity())}
                    autoFocus
                  />
                  {rarityAddError && <span className="form-error">{rarityAddError}</span>}
                  <div className="inline-add-actions">
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddRarity}>Add</button>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => { setAddingRarity(false); setNewRarityName(''); setRarityAddError(''); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" className="btn-add-new" onClick={() => setAddingRarity(true)}>
                  + Add new rarity
                </button>
              )}

              {/* Expansion Sets */}
              <div className="form-label form-label--section-gap">
                Expansion Sets
                {sets.length === 0 && !addingSet && (
                  <span className="form-label-hint"> No sets available</span>
                )}
                {sets.length > 0 && (
                  <div className="checkbox-list">
                    {sets.map((s) => (
                      <label key={s.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={expansionSetIds.includes(s.id)}
                          onChange={() => toggleSet(s.id)}
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {addingSet ? (
                <div className="inline-add">
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Set name"
                    value={newSetName}
                    onChange={(e) => setNewSetName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSet())}
                    autoFocus
                  />
                  {setAddError && <span className="form-error">{setAddError}</span>}
                  <div className="inline-add-actions">
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleAddSet}>Add</button>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => { setAddingSet(false); setNewSetName(''); setSetAddError(''); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" className="btn-add-new" onClick={() => setAddingSet(true)}>
                  + Add new expansion set
                </button>
              )}

              {!editingCard && (
                <label className="form-label form-label--section-gap">
                  Images <span className="form-label-hint">(126×176px, at least one required)</span>
                  <input
                    className="form-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    required
                  />
                  {imageFiles.length > 0 && (
                    <span className="form-label-hint">{imageFiles.length} file{imageFiles.length > 1 ? 's' : ''} selected</span>
                  )}
                </label>
              )}

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
