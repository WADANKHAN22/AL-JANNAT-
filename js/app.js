// ==========================================
// ALJANNAT CORE APP & UI CONTROLLER
// ==========================================

const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const heroDots = document.querySelector('.hero-dots');
const categoryStrip = document.getElementById('category-strip');
const newArrivalsGrid = document.getElementById('new-arrivals-grid');
const bestSellersGrid = document.getElementById('best-sellers-grid');
const luxuryGrid = document.getElementById('luxury-grid');
const relatedGrid = document.getElementById('related-grid');
const detailImage = document.getElementById('detail-image');
const detailName = document.getElementById('detail-name');
const detailPrice = document.getElementById('detail-price');
const detailDescription = document.getElementById('detail-description');
const galleryThumbs = document.getElementById('gallery-thumbs');
const modal = document.getElementById('product-modal');
const toast = document.getElementById('toast');
const backToTop = document.querySelector('.back-to-top');
const loadingScreen = document.querySelector('.loading-screen');
const header = document.querySelector('.site-header');
const searchOverlay = document.getElementById('search-overlay');
const themeToggle = document.querySelector('.theme-toggle');

const categoryCards = [
  { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80', link: 'collections.html?filter=new' },
  { name: 'Maxi Dresses', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80', link: 'collections.html?category=maxi' },
  { name: 'Midi Dresses', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80', link: 'collections.html?category=midi' },
  { name: 'Formal Couture', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', link: 'collections.html?category=formal' },
  { name: 'Partywear', image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=800&q=80', link: 'collections.html?category=party' },
  { name: 'Bridal Edit', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80', link: 'collections.html?collection=bridal' }
];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2200);
}

function setupHeroSlider() {
  if (!heroSlides.length) return;
  let current = 0;

  if (heroDots) {
    heroDots.innerHTML = '';
    heroSlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        current = index;
        updateHero();
      });
      heroDots.appendChild(dot);
    });
  }

  const updateHero = () => {
    heroSlides.forEach((slide, index) => slide.classList.toggle('active', index === current));
    const dots = heroDots?.querySelectorAll('button') || [];
    dots.forEach((dot, index) => dot.classList.toggle('active', index === current));
  };

  updateHero();

  setInterval(() => {
    current = (current + 1) % heroSlides.length;
    updateHero();
  }, 6500);
}

function renderCategoryStrip() {
  if (!categoryStrip) return;
  categoryStrip.innerHTML = '';
  categoryCards.forEach((card) => {
    const item = document.createElement('a');
    item.href = card.link || 'collections.html';
    item.className = 'category-card reveal';
    item.innerHTML = `
      <img src="${card.image}" alt="${card.name}" loading="lazy" />
      <h4>${card.name}</h4>
    `;
    categoryStrip.appendChild(item);
  });
}

function renderHomeSections() {
  if (newArrivalsGrid) {
    renderProducts(newArrivalsGrid, (product) => product.badge.includes('New') || product.badge.includes('Limited'));
  }
  if (bestSellersGrid) {
    renderProducts(bestSellersGrid, (product) => product.rating >= 4.8);
  }
  if (luxuryGrid) {
    renderProducts(luxuryGrid, (product) => product.collection === 'luxury' || product.collection === 'bridal');
  }
}

function renderProductPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id')) || 1;
  const product = products.find((item) => item.id === productId) || products[0];

  if (detailImage) detailImage.src = product.image;
  if (detailName) detailName.textContent = product.name;
  if (detailPrice) detailPrice.textContent = formatPrice(product.salePrice || product.price);
  if (detailDescription) detailDescription.textContent = product.description;
  
  if (galleryThumbs) {
    galleryThumbs.innerHTML = '';
    [product.image, product.hoverImage].forEach((src, idx) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = product.name;
      if (idx === 0) thumb.classList.add('active');
      thumb.addEventListener('click', () => {
        if (detailImage) detailImage.src = src;
        galleryThumbs.querySelectorAll('img').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
      });
      galleryThumbs.appendChild(thumb);
    });
  }

  if (relatedGrid) {
    renderProducts(relatedGrid, (item) => item.id !== product.id && item.collection === product.collection);
  }
}

function handleTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === 'dark') {
    document.body.classList.add('dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem(STORAGE_KEYS.theme, document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }
}

function handleStickyHeader() {
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    backToTop?.classList.toggle('show', window.scrollY > 500);
  });
}

function handleHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  if (!hamburger || !mainNav) return;
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mainNav.classList.toggle('open-mobile');
    hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
  });
}

function handleReveal() {
  const items = Array.from(document.querySelectorAll('.reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  items.forEach((item) => observer.observe(item));
}

function handleNewsletter() {
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  if (!form || !emailInput) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const valid = /\S+@\S+\.\S+/.test(email);
    if (!valid) {
      showToast('Please enter a valid email address');
      return;
    }
    showToast('Welcome to the ALJANNAT Private List');
    form.reset();
  });
}

function handleModal() {
  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('.quick-view-btn');
    if (!viewButton) return;
    const id = viewButton.getAttribute('data-id');
    const product = products.find((item) => String(item.id) === id);
    if (!product || !modal) return;

    modal.innerHTML = `
      <div class="payment-modal-backdrop close-modal"></div>
      <div class="payment-modal-card">
        <button class="payment-modal-close close-modal"><i class="fa-solid fa-xmark"></i></button>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
          <img src="${product.image}" alt="${product.name}" style="border-radius: var(--radius); aspect-ratio: 3/4; object-fit: cover;" />
          <div>
            <span class="eyebrow">${product.badge}</span>
            <h2>${product.name}</h2>
            <div class="price-row" style="margin: 1rem 0;">
              <span class="current-price" style="font-size: 1.5rem; color: var(--accent);">${formatPrice(product.salePrice || product.price)}</span>
              ${product.salePrice ? `<span class="old-price">${formatPrice(product.price)}</span>` : ''}
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">${product.description}</p>
            <div class="detail-actions">
              <a href="product.html?id=${product.id}" class="btn btn-primary">View Full Details</a>
              <button class="btn btn-secondary add-to-cart-inline" data-id="${product.id}">Add to Bag</button>
            </div>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('open');
  });

  modal?.addEventListener('click', (event) => {
    if (event.target.classList.contains('close-modal') || event.target.closest('.close-modal')) {
      modal.innerHTML = '';
      modal.classList.remove('open');
    }
  });
}

function setupBackToTop() {
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function init() {
  updateWishlistCount();
  updateCartCount();
  handleTheme();
  handleStickyHeader();
  handleHamburger();
  setupHeroSlider();
  renderCategoryStrip();
  renderHomeSections();
  renderProductPage();
  handleNewsletter();
  handleModal();
  setupBackToTop();
  renderWishlist();
  renderCart();
  handleReveal();
  if (typeof initializePaymentFlow === 'function') {
    initializePaymentFlow();
  }

  // Remove loading screen smoothly
  setTimeout(() => {
    loadingScreen?.classList.add('hidden');
  }, 300);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
