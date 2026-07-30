// ============================
// LOCAL STORAGE HELPERS
// ============================

const STORAGE_KEYS = {
  wishlist: 'aljannat_wishlist',
  cart: 'aljannat_cart',
  theme: 'aljannat_theme'
};

function getStoredArray(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.warn('Storage read failed:', error);
    return [];
  }
}

function saveStoredArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Storage save failed:', error);
  }
}

function toggleStoredItem(key, id) {
  const items = getStoredArray(key);
  const exists = items.includes(id);
  const next = exists ? items.filter((item) => item !== id) : [...items, id];
  saveStoredArray(key, next);
  return next;
}

function isStored(key, id) {
  return getStoredArray(key).includes(id);
}
