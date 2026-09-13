// ==========================================
// ALJANNAT PRODUCT DATA & RENDER ENGINE
// ==========================================

const products = [
  {
    id: 1,
    name: 'Aurora Silk Evening Gown',
    category: 'party',
    collection: 'luxury',
    price: 620,
    salePrice: 540,
    rating: 4.9,
    colors: ['Gold', 'Black', 'Emerald'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    badge: 'Limited Edition',
    description: 'A sculpted silk dress featuring hand-draped Italian satin, an alluring neckline, and a graceful floor-sweeping train designed for candlelit soirées.'
  },
  {
    id: 2,
    name: 'Velvet Moon Midi Dress',
    category: 'midi',
    collection: 'bridal',
    price: 480,
    salePrice: 430,
    rating: 4.8,
    colors: ['Ivory', 'Champagne', 'Rose'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 'Low Stock',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    badge: 'Bridal Edit',
    description: 'A graceful midi dress with delicate plush velvet texture, detailed corset stitching, and a fluid silhouette for engagement & luxury events.'
  },
  {
    id: 3,
    name: 'Elysian Chiffon Maxi',
    category: 'maxi',
    collection: 'summer',
    price: 360,
    salePrice: 310,
    rating: 4.7,
    colors: ['Emerald', 'Navy', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    badge: 'New Arrival',
    description: 'An airy chiffon maxi dress with a refined drape, gold-tone accent belt, and polished couture-inspired sleeve detailing.'
  },
  {
    id: 4,
    name: 'Celine Formal Sculpted Gown',
    category: 'formal',
    collection: 'luxury',
    price: 760,
    salePrice: 690,
    rating: 5.0,
    colors: ['Platinum', 'Black', 'Onyx'],
    sizes: ['S', 'M', 'L'],
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    badge: 'Luxury Couture',
    description: 'A formal gown with graceful pleats, metallic thread embroidery, and structured shoulder tailoring for high-impact galas.'
  },
  {
    id: 5,
    name: 'Rosette Cocktail Mini Dress',
    category: 'mini',
    collection: 'party',
    price: 290,
    salePrice: 245,
    rating: 4.6,
    colors: ['Rose', 'Silver', 'Pearl'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 'In Stock',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    badge: 'Special Offer',
    description: 'A vibrant cocktail mini dress featuring hand-crafted rosette applications and an asymmetric shoulder line.'
  },
  {
    id: 6,
    name: 'Noor Royal Bridal Gown',
    category: 'bridal',
    collection: 'bridal',
    price: 950,
    salePrice: 890,
    rating: 5.0,
    colors: ['Ivory', 'Pearl White'],
    sizes: ['M', 'L', 'XL'],
    stock: 'Pre-Order',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    badge: 'Bridal Masterpiece',
    description: 'A regal bridal masterpiece crafted with zari embroidery, Swarovski embellishments, and a voluminous cathedral train.'
  }
];

function formatPrice(value) {
  return `$${Number(value).toLocaleString()}`;
}

function createProductCard(product, extraClass = '') {
  const card = document.createElement('article');
  card.className = `product-card ${extraClass}`.trim();

  const isWishlisted = typeof isStored === 'function' ? isStored(STORAGE_KEYS.wishlist, String(product.id)) : false;

  card.innerHTML = `
    <div class="product-media">
      <span class="badge">${product.badge}</span>
      <div class="product-actions">
        <button class="action-btn wishlist-toggle ${isWishlisted ? 'active' : ''}" data-id="${product.id}" aria-label="Add to wishlist">
          <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
        <button class="action-btn quick-view-btn" data-id="${product.id}" aria-label="Quick view">
          <i class="fa-regular fa-eye"></i>
        </button>
      </div>
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <img class="hover-image" src="${product.hoverImage}" alt="${product.name} hover view" loading="lazy" />
      </a>
    </div>
    <div class="product-body">
      <div class="rating-row">
        <span class="stars">★★★★★</span>
        <span>${product.rating}</span>
      </div>
      <h3 class="product-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <div class="price-row">
        <span class="current-price">${formatPrice(product.salePrice || product.price)}</span>
        ${product.salePrice ? `<span class="old-price">${formatPrice(product.price)}</span>` : ''}
      </div>
      <div class="meta-list">
        ${product.sizes.slice(0, 4).map((size) => `<span class="meta-pill">${size}</span>`).join('')}
      </div>
      <div class="quick-add">
        <button class="btn btn-primary btn-block add-to-cart-inline" data-id="${product.id}">
          <i class="fa-solid fa-bag-shopping"></i> Add to Bag
        </button>
      </div>
    </div>
  `;

  return card;
}

function renderProducts(container, filterFn = () => true) {
  if (!container) return;
  const filtered = products.filter(filterFn);
  container.innerHTML = '';
  if (!filtered.length) {
    container.innerHTML = '<div class="empty-state">No products found matching your selection.</div>';
    return;
  }
  filtered.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
}
