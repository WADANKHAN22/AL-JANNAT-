// ============================
// WISHLIST FUNCTIONALITY
// ============================

function renderWishlist() {
  const wishlistGrid = document.getElementById('wishlist-grid');
  if (!wishlistGrid) return;
  const wishlistIds = getStoredArray(STORAGE_KEYS.wishlist);
  const wishlistProducts = products.filter((product) => wishlistIds.includes(String(product.id)));

  wishlistGrid.innerHTML = '';
  if (!wishlistProducts.length) {
    wishlistGrid.innerHTML = '<p class="empty-state">Your wishlist is empty. Start by saving a few favorites.</p>';
    return;
  }

  wishlistProducts.forEach((product) => {
    wishlistGrid.appendChild(createProductCard(product));
  });
}

function toggleWishlist(id) {
  const next = toggleStoredItem(STORAGE_KEYS.wishlist, String(id));
  updateWishlistCount();
  renderWishlist();
  showToast(next.includes(String(id)) ? 'Added to wishlist' : 'Removed from wishlist');
}

function updateWishlistCount() {
  const counts = document.querySelectorAll('.wishlist-count');
  counts.forEach((element) => {
    element.textContent = getStoredArray(STORAGE_KEYS.wishlist).length;
  });
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('.wishlist-toggle');
  if (!button) return;
  const id = button.getAttribute('data-id');
  toggleWishlist(id);
});
