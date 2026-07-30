# 🎀 ALJANNAT - Static Frontend E-Commerce Template

**Luxury Women's Fashion Boutique**

*Elegance in Every Dress*

---

## 📋 Project Overview

This repository is a frontend-only ALJANNAT storefront built with static HTML, CSS, and JavaScript.

- **Backend:** None
- **Database:** None
- **Server:** None
- **Payment:** Local confirmation only
- **APIs:** None

### Key Features

- Product catalog with search and filtering
- Shopping cart with live totals
- Wishlist support
- Local order confirmation flow
- Responsive design for desktop and mobile

---

## 📁 Project Structure

```
aljannat/
├── about.html
├── cart.html
├── collections.html
├── contact.html
├── index.html
├── product.html
├── search.html
├── wishlist.html
├── css/
│   ├── animations.css
│   ├── responsive.css
│   └── style.css
├── js/
│   ├── app.js
│   ├── cart.js
│   ├── filters.js
│   ├── payment.js
│   ├── products.js
│   ├── search.js
│   ├── storage.js
│   └── wishlist.js
└── assets/
    ├── fonts/
    ├── icons/
    ├── images/
    └── videos/
```

---

## 🚀 Getting Started

Open `index.html` in a browser to run the storefront locally. No installation, backend server, or database setup is required.

If you want to use a local static server, you can run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## Notes

- All checkout and order activity is simulated in the browser.
- No persistence beyond the current browser session is provided.
- This template is ideal for showcasing a static e-commerce UI without backend integration.
