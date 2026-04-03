const BASE = '/api';

const authFetch = (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
};

export const getCards = () =>
  fetch(`${BASE}/cards`).then((r) => r.json());

export const getCard = (id) =>
  fetch(`${BASE}/cards/${id}`).then((r) => {
    if (!r.ok) throw new Error('Card not found');
    return r.json();
  });

export const login = (credentials) =>
  fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }).then((r) => r.json());

export const getRarities = () =>
  fetch(`${BASE}/rarities`).then((r) => r.json());

export const getSets = () =>
  fetch(`${BASE}/sets`).then((r) => r.json());

export const createRarity = (name) =>
  authFetch(`${BASE}/rarities`, { method: 'POST', body: JSON.stringify({ name }) }).then((r) => r.json());

export const createSet = (name) =>
  authFetch(`${BASE}/sets`, { method: 'POST', body: JSON.stringify({ name }) }).then((r) => r.json());

export const createCard = (cardData, imageFiles) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  Object.entries(cardData).forEach(([key, val]) => {
    if (Array.isArray(val)) {
      val.forEach((v) => formData.append(key, v));
    } else {
      formData.append(key, val);
    }
  });
  imageFiles.forEach((file) => formData.append('images', file));
  return fetch(`${BASE}/cards`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then((r) => r.json());
};

export const updateCard = (id, card) =>
  authFetch(`${BASE}/cards/${id}`, { method: 'PUT', body: JSON.stringify(card) }).then((r) => r.json());

export const deleteCard = (id) =>
  authFetch(`${BASE}/cards/${id}`, { method: 'DELETE' });

export const markSold = (id) =>
  authFetch(`${BASE}/cards/${id}/sold`, { method: 'PATCH' }).then((r) => r.json());
