// ==========================================
// PURE FRONTEND SHOPPING CART LOGIC
// ==========================================

function getCartItems() {
  return getCartItemsFromStorage();
}

function addToCart(id) {
  addCartItem(id);
  updateCartCount();
  renderCart();
  if (typeof showToast === 'function') showToast('Piece added to your bag');
}

function updateCartCount() {
  const counts = document.querySelectorAll('.cart-count');
  const cartItems = getCartItems();
  counts.forEach((element) => {
    element.textContent = cartItems.length;
  });
}

function renderCart() {
  const cartItemsNode = document.getElementById('cart-items');
  const subtotal = document.getElementById('subtotal');
  const total = document.getElementById('total');
  if (!cartItemsNode) return;

  const productIds = getCartItems();
  const selectedProducts = products.filter((product) => productIds.includes(String(product.id)));

  cartItemsNode.innerHTML = '';
  if (!selectedProducts.length) {
    cartItemsNode.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem;"></i>
        <h2>Your shopping bag is empty</h2>
        <p style="margin: 0.5rem 0 1.5rem;">Explore our couture collections to add luxury dresses to your bag.</p>
        <a href="collections.html" class="btn btn-primary">Discover Collection</a>
      </div>
    `;
    if (subtotal) subtotal.textContent = '$0';
    if (total) total.textContent = '$0';
    return;
  }

  let amount = 0;
  selectedProducts.forEach((product) => {
    const itemPrice = product.salePrice || product.price;
    amount += itemPrice;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <div class="cart-item-info">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <span class="eyebrow">${product.badge}</span>
          <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${product.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${product.collection} · Size: M</p>
          <p class="current-price" style="margin-top: 0.5rem;">${formatPrice(itemPrice)}</p>
        </div>
      </div>
      <button class="btn btn-secondary remove-cart-item" data-id="${product.id}">
        <i class="fa-solid fa-trash-can"></i> Remove
      </button>
    `;
    cartItemsNode.appendChild(item);
  });

  if (subtotal) subtotal.textContent = formatPrice(amount);
  if (total) total.textContent = formatPrice(amount);

  const checkoutButton = document.querySelector('.btn-primary.btn-block');
  if (checkoutButton) {
    checkoutButton.dataset.orderTotal = amount;
  }
}

function removeCartItemHandler(id) {
  removeCartItem(id);
  updateCartCount();
  renderCart();
  if (typeof showToast === 'function') showToast('Piece removed from bag');
}

document.addEventListener('click', (event) => {
  const inline = event.target.closest('.add-to-cart-inline');
  if (inline) {
    const id = inline.getAttribute('data-id');
    if (id) addToCart(id);
  }

  const cartButton = event.target.closest('.add-to-cart-btn');
  if (cartButton) {
    const id = new URLSearchParams(window.location.search).get('id') || 1;
    addToCart(id);
  }

  const removeButton = event.target.closest('.remove-cart-item');
  if (removeButton) {
    const id = removeButton.dataset.id;
    removeCartItemHandler(id);
  }
});
