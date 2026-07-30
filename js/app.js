// ============================
// APP INITIALIZATION
// ============================

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
const megaMenu = document.querySelector('.mega-menu');
const navItems = Array.from(document.querySelectorAll('.nav-item, .main-nav a'));
const searchOverlay = document.getElementById('search-overlay');
const themeToggle = document.querySelector('.theme-toggle');

const categoryCards = [
  { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Maxi Dresses', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Midi Dresses', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mini Dresses', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Party Dresses', image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Formal Dresses', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Bridal', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Luxury', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Casual', image: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Summer', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Winter', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sale', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80' }
];

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 1800);
}

function setupHeroSlider() {
  if (!heroSlides.length) return;
  let current = 0;

  const createDots = () => {
    heroSlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        current = index;
        updateHero();
      });
      heroDots.appendChild(dot);
    });
  };

  const updateHero = () => {
    heroSlides.forEach((slide, index) => slide.classList.toggle('active', index === current));
    const dots = heroDots?.querySelectorAll('button') || [];
    dots.forEach((dot, index) => dot.classList.toggle('active', index === current));
  };

  createDots();
  updateHero();

  setInterval(() => {
    current = (current + 1) % heroSlides.length;
    updateHero();
  }, 6000);
}

function renderCategoryStrip() {
  if (!categoryStrip) return;
  categoryStrip.innerHTML = '';
  categoryCards.forEach((card) => {
    const item = document.createElement('article');
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
    renderProducts(newArrivalsGrid, (product) => product.badge === 'New' || product.badge === 'Limited Edition');
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
    [product.image, product.hoverImage].forEach((src) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = product.name;
      thumb.addEventListener('click', () => {
        if (detailImage) detailImage.src = src;
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
    backToTop?.classList.toggle('show', window.scrollY > 600);
  });
}

function handleMegaMenu() {
  navItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      megaMenu?.classList.add('open');
    });
  });
  document.querySelector('.site-header').addEventListener('mouseleave', () => {
    megaMenu?.classList.remove('open');
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
  }, { threshold: 0.15 });
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
    showToast('You are subscribed to ALJANNAT');
    form.reset();
  });
}

function handleModal() {
  document.addEventListener('click', (event) => {
    const viewButton = event.target.closest('.quick-view-btn');
    if (!viewButton) return;
    const id = viewButton.getAttribute('data-id');
    const product = products.find((item) => String(item.id) === id);
    if (!product) return;
    modal.innerHTML = `
      <div class="search-panel">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="detail-actions">
          <a href="product.html?id=${product.id}" class="btn btn-primary">View Details</a>
          <button class="btn btn-secondary close-modal">Close</button>
        </div>
      </div>
    `;
    modal.classList.add('open');
  });

  modal?.addEventListener('click', (event) => {
    if (event.target.classList.contains('close-modal')) {
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
  handleMegaMenu();
  handleHamburger();
  handleReveal();
  setupHeroSlider();
  renderCategoryStrip();
  renderHomeSections();
  renderProductPage();
  handleNewsletter();
  handleModal();
  setupBackToTop();
  renderWishlist();
  renderCart();
  if (typeof initializePaymentFlow === 'function') {
    initializePaymentFlow();
  }
  
  // Initialize collection filters if on collections page
  const collectionContainer = document.getElementById('collection-products');
  if (collectionContainer) {
    try {
      // Apply URL filters
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category');
      const collectionParam = params.get('collection');
      const filterParam = params.get('filter');
      
      // Check category checkbox
      if (categoryParam) {
        const checkbox = document.querySelector(`.filter-block input[value="${categoryParam}"]`);
        if (checkbox) {
          checkbox.checked = true;
        }
      }
      
      // Check collection checkbox
      if (collectionParam) {
        const checkbox = document.querySelector(`.filter-block input[value="${collectionParam}"]`);
        if (checkbox) {
          checkbox.checked = true;
        }
      }
      
      // Set up filter change listeners
      const filterInputs = document.querySelectorAll('.filter-block input');
      const sortSelect = document.getElementById('sort-select');
      const toggleView = document.getElementById('toggle-view');
      
      filterInputs.forEach((input) => {
        input.addEventListener('change', () => {
          if (typeof getFilteredProducts === 'function') {
            getFilteredProducts();
          }
        });
      });
      
      if (sortSelect) {
        sortSelect.addEventListener('change', () => {
          if (typeof getFilteredProducts === 'function') {
            getFilteredProducts();
          }
        });
      }
      
      if (toggleView) {
        toggleView.addEventListener('click', () => {
          collectionContainer.classList.toggle('list-view');
        });
      }
      
      // Render filtered products
      if (typeof getFilteredProducts === 'function') {
        getFilteredProducts();
      }
    } catch (e) {
      console.error('Error initializing collection filters:', e);
    }
  }

  loadingScreen?.classList.add('hidden');
}

// Try to call init immediately if DOM is ready (scripts are at end of body)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already loaded, call init now
  init();
}

// Ensure loading screen is always hidden after a timeout
const hideLoadingScreen = () => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
};

// Hide loading screen on multiple events to ensure it works
window.addEventListener('load', hideLoadingScreen);
document.addEventListener('DOMContentLoaded', hideLoadingScreen);

// Also hide it after a delay as a fallback
setTimeout(hideLoadingScreen, 500);
