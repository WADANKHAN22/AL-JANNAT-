// ==========================================
// PURE FRONTEND BROWSER STORAGE (LOCALSTORAGE ONLY)
// No Backend, No External API, No Database Server
// ==========================================

const STORAGE_KEYS = {
  wishlist: 'aljannat_wishlist',
  cart: 'aljannat_cart',
  theme: 'aljannat_theme',
  session: 'aljannat_session_id'
};

function getStoredArray(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

function saveStoredArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
}

function getCartItemsFromStorage() {
  return getStoredArray(STORAGE_KEYS.cart);
}

function addCartItem(id) {
  const items = getStoredArray(STORAGE_KEYS.cart);
  const next = items.includes(String(id)) ? items : [...items, String(id)];
  saveStoredArray(STORAGE_KEYS.cart, next);
  return next;
}

function removeCartItem(id) {
  const items = getStoredArray(STORAGE_KEYS.cart);
  const next = items.filter((item) => String(item) !== String(id));
  saveStoredArray(STORAGE_KEYS.cart, next);
  return next;
}

function getWishlistItemsFromStorage() {
  return getStoredArray(STORAGE_KEYS.wishlist);
}

function toggleWishlistItem(id) {
  const items = getStoredArray(STORAGE_KEYS.wishlist);
  const exists = items.includes(String(id));
  const next = exists ? items.filter((item) => item !== String(id)) : [...items, String(id)];
  saveStoredArray(STORAGE_KEYS.wishlist, next);
  return next;
}

function isStored(key, id) {
  return getStoredArray(key).includes(String(id));
}
