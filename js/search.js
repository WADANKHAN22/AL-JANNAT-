// ============================
// SEARCH FUNCTIONALITY
// ============================

function searchProducts(query = '') {
  const normalized = query.trim().toLowerCase();
  return products.filter((product) => {
    return [product.name, product.category, product.collection, product.description]
      .join(' ')
      .toLowerCase()
      .includes(normalized);
  });
}

function renderSearchResults(container, query = '') {
  if (!container) return;
  const results = searchProducts(query);
  container.innerHTML = '';
  if (!results.length) {
    container.innerHTML = '<p class="empty-state">No dresses match your search yet.</p>';
    return;
  }
  results.forEach((product) => {
    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <p>${product.description}</p>
      </div>
      <a href="product.html?id=${product.id}" class="text-link">View</a>
    `;
    container.appendChild(item);
  });
}

function bindSearchUI() {
  const overlay = document.getElementById('search-overlay');
  const trigger = document.querySelector('.search-toggle');
  const close = document.querySelector('.close-search');
  const globalInput = document.getElementById('global-search');
  const results = document.getElementById('search-results');
  const pageInput = document.getElementById('search-page-input');
  const pageResults = document.getElementById('search-page-results');

  if (trigger) {
    trigger.addEventListener('click', () => {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      globalInput?.focus();
    });
  }

  if (close) {
    close.addEventListener('click', () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    });
  }

  if (globalInput && results) {
    globalInput.addEventListener('input', (event) => {
      renderSearchResults(results, event.target.value);
    });
  }

  if (pageInput && pageResults) {
    pageInput.addEventListener('input', (event) => {
      renderSearchResults(pageResults, event.target.value);
    });
  }
}

bindSearchUI();
