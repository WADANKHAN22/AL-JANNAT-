// ============================
// PRODUCT DATA
// ============================

const products = [
  {
    id: 1,
    name: 'Aurora Silk Dress',
    category: 'party',
    collection: 'luxury',
    price: 620,
    salePrice: 540,
    rating: 4.9,
    colors: ['Gold', 'Black'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    badge: 'Limited Edition',
    description: 'A sculpted silk dress designed for evening soirées and elegant celebrations.'
  },
  {
    id: 2,
    name: 'Velvet Moon Midi',
    category: 'midi',
    collection: 'bridal',
    price: 480,
    salePrice: 430,
    rating: 4.8,
    colors: ['Ivory', 'Champagne'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    badge: 'Bridal',
    description: 'A graceful midi dress with luxe velvet texture and a flowing silhouette.'
  },
  {
    id: 3,
    name: 'Elysian Maxi',
    category: 'maxi',
    collection: 'summer',
    price: 360,
    salePrice: 310,
    rating: 4.7,
    colors: ['Emerald', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    badge: 'New',
    description: 'An airy maxi dress with a refined drape and polished finish.'
  },
  {
    id: 4,
    name: 'Celine Formal Gown',
    category: 'formal',
    collection: 'luxury',
    price: 760,
    salePrice: 690,
    rating: 5.0,
    colors: ['Platinum', 'Black'],
    sizes: ['S', 'M', 'L'],
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    badge: 'Luxury',
    description: 'A formal gown with graceful pleats and refined detailing for high-impact evenings.'
  },
  {
    id: 5,
    name: 'Rosette Mini Dress',
    category: 'mini',
    collection: 'party',
    price: 290,
    salePrice: 245,
    rating: 4.6,
    colors: ['Rose', 'Silver'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    badge: 'Sale',
    description: 'A playful mini dress with sculptural rosette detailing and effortless shimmer.'
  },
  {
    id: 6,
    name: 'Noor Bridal Dress',
    category: 'bridal',
    collection: 'bridal',
    price: 950,
    salePrice: 890,
    rating: 5.0,
    colors: ['Ivory', 'Pearl'],
    sizes: ['M', 'L', 'XL'],
    stock: 'Pre-Order',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    badge: 'Bridal',
    description: 'A statement bridal masterpiece with delicate embroidery and a graceful train.'
  }
];

function formatPrice(value) {
  return `$${value}`;
}

function createProductCard(product, extraClass = '') {
  const card = document.createElement('article');
  card.className = `product-card ${extraClass}`.trim();
  card.innerHTML = `
    <div class="product-media">
      <span class="badge">${product.badge}</span>
      <div class="product-actions">
        <button class="action-btn wishlist-toggle" data-id="${product.id}" aria-label="Add to wishlist">
          <i class="fa-regular fa-heart"></i>
        </button>
        <button class="action-btn quick-view-btn" data-id="${product.id}" aria-label="Quick view">
          <i class="fa-regular fa-eye"></i>
        </button>
      </div>
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <img class="hover-image" src="${product.hoverImage}" alt="${product.name} hover" loading="lazy" />
    </div>
    <div class="product-body">
      <h3 class="product-title">${product.name}</h3>
      <div class="price-row">
        <span class="current-price">${formatPrice(product.salePrice || product.price)}</span>
        <span class="old-price">${formatPrice(product.price)}</span>
      </div>
      <div class="rating-row">★★★★★ <span>${product.rating}</span></div>
      <div class="meta-list">
        ${product.colors.slice(0, 3).map((color) => `<span class="meta-pill">${color}</span>`).join('')}
      </div>
      <div class="meta-list">
        ${product.sizes.slice(0, 4).map((size) => `<span class="meta-pill">${size}</span>`).join('')}
      </div>
      <p class="stock-status">${product.stock}</p>
      <div class="quick-add">
        <div class="size-row">
          ${product.sizes.map((size) => `<button>${size}</button>`).join('')}
        </div>
        <div class="color-row">
          ${product.colors.map((color) => `<button>${color}</button>`).join('')}
        </div>
        <div class="qty-row">
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <button class="btn btn-primary add-to-cart-inline">Add</button>
        </div>
      </div>
    </div>
  `;
  return card;
}

function renderProducts(container, filterFn = () => true) {
  if (!container) return;
  const filtered = products.filter(filterFn);
  container.innerHTML = '';
  filtered.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
}
