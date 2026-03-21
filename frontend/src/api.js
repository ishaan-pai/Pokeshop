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

export const createCard = (card) =>
  authFetch(`${BASE}/cards`, { method: 'POST', body: JSON.stringify(card) }).then((r) => r.json());

export const updateCard = (id, card) =>
  authFetch(`${BASE}/cards/${id}`, { method: 'PUT', body: JSON.stringify(card) }).then((r) => r.json());

export const deleteCard = (id) =>
  authFetch(`${BASE}/cards/${id}`, { method: 'DELETE' });

export const markSold = (id) =>
  authFetch(`${BASE}/cards/${id}/sold`, { method: 'PATCH' }).then((r) => r.json());
