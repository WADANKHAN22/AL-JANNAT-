// ============================
// FILTERING AND SORTING
// ============================

function getFilteredProducts() {
  const categoryChecks = Array.from(document.querySelectorAll('.filter-block input[type="checkbox"]'));
  const priceRadio = document.querySelector('.filter-block input[name="price"]:checked');
  const sortSelect = document.getElementById('sort-select');
  const container = document.getElementById('collection-products');
  const count = document.getElementById('product-count');
  const params = new URLSearchParams(window.location.search);
  const filterParam = params.get('filter');

  const selectedCategories = categoryChecks
    .filter((input) => input.checked)
    .map((input) => input.value);

  let filtered = [...products];

  // Handle "new" arrivals filter
  if (filterParam === 'new') {
    filtered = filtered.filter((product) => product.badge === 'New' || product.badge === 'Limited Edition');
  } else if (selectedCategories.length) {
    filtered = filtered.filter((product) => selectedCategories.includes(product.category) || selectedCategories.includes(product.collection));
  }

  if (priceRadio && priceRadio.value === 'under-300') {
    filtered = filtered.filter((product) => product.salePrice < 300 || product.price < 300);
  } else if (priceRadio && priceRadio.value === '300-700') {
    filtered = filtered.filter((product) => (product.salePrice >= 300 && product.salePrice <= 700) || (product.price >= 300 && product.price <= 700));
  } else if (priceRadio && priceRadio.value === '700-plus') {
    filtered = filtered.filter((product) => product.salePrice > 700 || product.price > 700);
  }

  if (sortSelect) {
    const sortValue = sortSelect.value;
    if (sortValue === 'price-low') {
      filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortValue === 'price-high') {
      filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortValue === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  if (container) {
    container.innerHTML = '';
    filtered.forEach((product) => {
      container.appendChild(createProductCard(product));
    });
  }

  if (count) {
    count.textContent = `${filtered.length} products`;
  }

  return filtered;
}

function applyURLFilters() {
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');
  const collectionParam = params.get('collection');
  const filterParam = params.get('filter');

  if (categoryParam) {
    const checkbox = document.querySelector(`.filter-block input[value="${categoryParam}"]`);
    if (checkbox) {
      checkbox.checked = true;
    }
  }

  if (collectionParam) {
    const checkbox = document.querySelector(`.filter-block input[value="${collectionParam}"]`);
    if (checkbox) {
      checkbox.checked = true;
    }
  }

  // Handle "new" filter by filtering for items with badge "New"
  if (filterParam === 'new') {
    // This will be handled in getFilteredProducts with special logic
  }
}

function initFilters() {
  const filterInputs = document.querySelectorAll('.filter-block input');
  const sortSelect = document.getElementById('sort-select');
  const toggleView = document.getElementById('toggle-view');

  filterInputs.forEach((input) => {
    input.addEventListener('change', getFilteredProducts);
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', getFilteredProducts);
  }

  if (toggleView) {
    toggleView.addEventListener('click', () => {
      const container = document.getElementById('collection-products');
      if (container) {
        container.classList.toggle('list-view');
      }
    });
  }
}

// Initialize filters when DOM is ready
function initializeCollectionFilters() {
  const container = document.getElementById('collection-products');
  if (container) {
    applyURLFilters();
    initFilters();
    getFilteredProducts();
  }
}

// Auto-initialize filters on collections page
(function() {
  console.log('[Filters] Auto-initialization starting...');
  
  // Check if we're on the collections page
  const collectionContainer = document.getElementById('collection-products');
  console.log('[Filters] Collection container found:', !!collectionContainer);
  
  if (collectionContainer) {
    try {
      // Apply URL filters immediately
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('category');
      const collectionParam = params.get('collection');
      
      console.log('[Filters] URL params:', { categoryParam, collectionParam });
      
      if (categoryParam) {
        const checkbox = document.querySelector(`.filter-block input[value="${categoryParam}"]`);
        console.log('[Filters] Checking category checkbox:', categoryParam, !!checkbox);
        if (checkbox) {
          checkbox.checked = true;
        }
      }
      
      if (collectionParam) {
        const checkbox = document.querySelector(`.filter-block input[value="${collectionParam}"]`);
        console.log('[Filters] Checking collection checkbox:', collectionParam, !!checkbox);
        if (checkbox) {
          checkbox.checked = true;
        }
      }
      
      // Set up filter listeners
      const filterInputs = document.querySelectorAll('.filter-block input');
      const sortSelect = document.getElementById('sort-select');
      const toggleView = document.getElementById('toggle-view');
      
      console.log('[Filters] Setting up listeners. Inputs found:', filterInputs.length);
      
      filterInputs.forEach((input) => {
        input.addEventListener('change', getFilteredProducts);
      });
      
      if (sortSelect) {
        sortSelect.addEventListener('change', getFilteredProducts);
      }
      
      if (toggleView) {
        toggleView.addEventListener('click', () => {
          if (collectionContainer) {
            collectionContainer.classList.toggle('list-view');
          }
        });
      }
      
      // Render the filtered products
      console.log('[Filters] Calling getFilteredProducts');
      getFilteredProducts();
      console.log('[Filters] Initialization complete');
    } catch (error) {
      console.error('[Filters] Error during initialization:', error);
    }
  }
})();
