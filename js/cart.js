// ============================
// SHOPPING CART FUNCTIONALITY
// ============================

function getCartItems() {
  return getStoredArray(STORAGE_KEYS.cart);
}

function addToCart(id) {
  const next = toggleStoredItem(STORAGE_KEYS.cart, String(id));
  updateCartCount();
  renderCart();
  showToast('Added to cart');
}

function updateCartCount() {
  const counts = document.querySelectorAll('.cart-count');
  counts.forEach((element) => {
    element.textContent = getCartItems().length;
  });
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const subtotal = document.getElementById('subtotal');
  const total = document.getElementById('total');
  if (!cartItems) return;

  const cartIds = getCartItems();
  const selectedProducts = products.filter((product) => cartIds.includes(String(product.id)));

  cartItems.innerHTML = '';
  if (!selectedProducts.length) {
    cartItems.innerHTML = '<p class="empty-state">Your cart is empty. Start by adding a few favorites.</p>';
    if (subtotal) subtotal.textContent = '$0';
    if (total) total.textContent = '$0';
    return;
  }

  let amount = 0;
  selectedProducts.forEach((product) => {
    amount += product.salePrice || product.price;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <div class="cart-item-info">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <h3>${product.name}</h3>
          <p>${product.collection}</p>
          <p>${formatPrice(product.salePrice || product.price)}</p>
        </div>
      </div>
      <button class="btn btn-secondary">Remove</button>
    `;
    cartItems.appendChild(item);
  });

  if (subtotal) subtotal.textContent = formatPrice(amount);
  if (total) total.textContent = formatPrice(amount);

  const checkoutButton = document.querySelector('.btn-primary.btn-block');
  if (checkoutButton) {
    checkoutButton.dataset.orderTotal = amount;
  }
}

document.addEventListener('click', (event) => {
  const inline = event.target.closest('.add-to-cart-inline');
  if (inline) {
    const card = inline.closest('.product-card');
    const id = card.querySelector('.wishlist-toggle').getAttribute('data-id');
    addToCart(id);
  }

  const cartButton = event.target.closest('.add-to-cart-btn');
  if (cartButton) {
    const id = new URLSearchParams(window.location.search).get('id') || 1;
    addToCart(id);
  }
});
