// ==========================================
// ALJANNAT LUXURY CHECKOUT & PAYMENT ENGINE
// ==========================================

const paymentState = {
  orderTotal: 0,
  orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  paymentDate: null,
  paymentAmount: 0,
  selectedMethod: 'card'
};

const formatCurrency = (value) => {
  return `$${Number(value).toLocaleString()}`;
};

const getPaymentMethodFields = () => {
  return `
    <div class="payment-method-fields">
      <label>
        <span>Cardholder Name</span>
        <input type="text" name="cardName" placeholder="Name on card" required />
      </label>
      <label>
        <span>Card Number</span>
        <input type="text" name="cardNumber" placeholder="4532 •••• •••• 8910" maxlength="19" required />
      </label>
      <div class="payment-row">
        <label>
          <span>Expiry</span>
          <input type="text" name="expiryMonth" placeholder="MM/YY" maxlength="5" required />
        </label>
        <label>
          <span>CVC</span>
          <input type="password" name="cvc" placeholder="123" maxlength="4" required />
        </label>
      </div>
    </div>
  `;
};

const createPaymentModal = () => {
  const modal = document.createElement('div');
  modal.className = 'payment-modal';
  modal.innerHTML = `
    <div class="payment-modal-backdrop" aria-hidden="true"></div>
    <div class="payment-modal-card" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
      <button class="payment-modal-close" aria-label="Close checkout modal"><i class="fa-solid fa-xmark"></i></button>
      <div class="payment-modal-header">
        <span class="eyebrow">Secure Checkout</span>
        <h2 id="payment-modal-title">Complete Your Order</h2>
        <p style="color: var(--text-muted); font-size: 0.88rem;">Encrypted & secure checkout powered by ALJANNAT Concierge.</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1.5rem;" class="checkout-modal-split">
        <div>
          <h3 style="font-size: 1rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.08em;">Shipping Details</h3>
          <div style="display: flex; flex-direction: column; gap: 0.85rem;" class="shipping-fields">
            <input type="text" name="shippingName" placeholder="Full Name" style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm);" required />
            <input type="email" name="shippingEmail" placeholder="Email Address" style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm);" required />
            <input type="text" name="shippingAddress" placeholder="Delivery Address" style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm);" required />
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <input type="text" name="shippingCity" placeholder="City" style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm);" required />
              <input type="text" name="shippingPhone" placeholder="Phone Number" style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: var(--radius-sm);" required />
            </div>
          </div>
        </div>

        <div>
          <h3 style="font-size: 1rem; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.08em;">Order Summary</h3>
          <div class="payment-summary-details">
            <div class="summary-row"><span>Order Reference</span><strong>#${paymentState.orderNumber}</strong></div>
            <div class="summary-row"><span>Subtotal</span><strong id="checkout-subtotal">$0</strong></div>
            <div class="summary-row"><span>Express Courier Shipping</span><strong style="color: #27ae60;">COMPLIMENTARY</strong></div>
            <div class="summary-row total"><span>Order Total</span><strong id="checkout-total">$0</strong></div>
          </div>

          <h3 style="font-size: 1rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em;">Payment Method</h3>
          <div class="payment-method-grid">
            <div class="payment-card selected" data-method="card">
              <div class="payment-card-top">
                <i class="fa-solid fa-credit-card payment-card-icon"></i>
                <div>
                  <h4 style="font-size: 0.9rem;">Card Payment</h4>
                  <p style="font-size: 0.75rem; color: var(--text-muted);">Visa, MasterCard, Amex</p>
                </div>
              </div>
            </div>
            <div class="payment-card" data-method="cod">
              <div class="payment-card-top">
                <i class="fa-solid fa-truck-ramp-box payment-card-icon"></i>
                <div>
                  <h4 style="font-size: 0.9rem;">Cash on Delivery</h4>
                  <p style="font-size: 0.75rem; color: var(--text-muted);">Pay upon delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="payment-method-form">
        ${getPaymentMethodFields()}
      </div>

      <div class="payment-modal-footer" style="margin-top: 1.5rem;">
        <button class="btn btn-primary btn-block payment-continue-btn">Place Order & Pay</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
};

const openPaymentModal = () => {
  let modal = document.querySelector('.payment-modal');
  if (!modal) {
    modal = createPaymentModal();
    bindPaymentModalEvents(modal);
  }

  const checkoutTotal = modal.querySelector('#checkout-total');
  const checkoutSubtotal = modal.querySelector('#checkout-subtotal');
  if (checkoutTotal) checkoutTotal.textContent = formatCurrency(paymentState.orderTotal);
  if (checkoutSubtotal) checkoutSubtotal.textContent = formatCurrency(paymentState.orderTotal);

  updatePaymentFields(modal);
  modal.classList.add('open');
  document.body.classList.add('modal-open');
};

const closePaymentModal = (modal) => {
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
};

const updatePaymentFields = (modal) => {
  const fields = modal.querySelector('.payment-method-fields');
  if (!fields) return;
  fields.style.display = paymentState.selectedMethod === 'card' ? 'block' : 'none';
};

const getFormValues = (modal) => {
  const form = {};
  modal.querySelectorAll('input').forEach((input) => {
    form[input.name] = input.value.trim();
  });
  return form;
};

const showError = (message) => {
  if (typeof showToast === 'function') {
    showToast(message);
  } else {
    alert(message);
  }
};

const handlePaymentSubmit = async (modal) => {
  const method = paymentState.selectedMethod;
  const orderId = paymentState.orderNumber;
  const amount = paymentState.orderTotal;

  if (!amount || amount <= 0) {
    showError('Please add items to your cart before proceeding to checkout.');
    return;
  }

  const formValues = getFormValues(modal);
  if (!formValues.shippingName || !formValues.shippingAddress) {
    showError('Please complete your shipping details before continuing.');
    return;
  }

  if (method === 'card') {
    if (!formValues.cardNumber || !formValues.expiryMonth || !formValues.cvc) {
      showError('Please complete card details before confirming payment.');
      return;
    }
  }

  const continueBtn = modal.querySelector('.payment-continue-btn');
  continueBtn.disabled = true;
  continueBtn.textContent = 'Processing Order...';

  setTimeout(() => {
    closePaymentModal(modal);
    renderOrderConfirmation({
      orderId,
      amount,
      transactionId: `TXN-${Date.now().toString().slice(-8)}`,
      paymentMethod: method === 'cod' ? 'Cash on Delivery' : 'Credit Card'
    });
    
    // Clear cart in local storage
    saveStoredArray(STORAGE_KEYS.cart, []);
    updateCartCount();
    renderCart();
  }, 1200);
};

const bindPaymentModalEvents = (modal) => {
  if (modal.dataset.paymentEventsBound === 'true') return;

  modal.addEventListener('click', (event) => {
    const cardButton = event.target.closest('.payment-card');
    if (!cardButton) return;

    modal.querySelectorAll('.payment-card').forEach((card) => card.classList.remove('selected'));
    cardButton.classList.add('selected');
    paymentState.selectedMethod = cardButton.dataset.method;
    updatePaymentFields(modal);
  });

  const continueBtn = modal.querySelector('.payment-continue-btn');
  continueBtn.addEventListener('click', (event) => {
    event.preventDefault();
    handlePaymentSubmit(modal);
  });

  const closeButton = modal.querySelector('.payment-modal-close');
  closeButton.addEventListener('click', () => closePaymentModal(modal));
  modal.querySelector('.payment-modal-backdrop').addEventListener('click', () => closePaymentModal(modal));

  modal.dataset.paymentEventsBound = 'true';
};

const renderOrderConfirmation = (paymentData = {}) => {
  const resultScreen = document.createElement('div');
  resultScreen.className = 'payment-result-screen open';
  paymentState.paymentAmount = paymentState.orderTotal;
  paymentState.paymentDate = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  resultScreen.innerHTML = `
    <div class="payment-result-card success">
      <div class="payment-result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h2>Order Confirmed</h2>
      <p style="color: var(--text-muted); margin-top: 0.5rem;">Thank you for shopping with ALJANNAT. Your luxury order has been received and is being prepared.</p>
      <div class="payment-result-summary">
        <div><span>Order Reference</span><strong>#${paymentData.orderId}</strong></div>
        <div><span>Transaction ID</span><strong>${paymentData.transactionId}</strong></div>
        <div><span>Payment Method</span><strong>${paymentData.paymentMethod}</strong></div>
        <div><span>Total Paid</span><strong style="color: var(--accent);">${formatCurrency(paymentState.paymentAmount)}</strong></div>
        <div><span>Order Date</span><strong>${paymentState.paymentDate}</strong></div>
      </div>
      <div class="payment-result-actions">
        <button class="btn btn-primary btn-block" type="button">Continue Shopping</button>
      </div>
    </div>
  `;

  document.body.appendChild(resultScreen);
  resultScreen.addEventListener('click', (event) => {
    if (event.target.closest('.btn-primary')) {
      resultScreen.remove();
      window.location.href = 'index.html';
    }
  });
};

const initializePaymentFlow = () => {
  const checkoutButton = document.querySelector('.btn-primary.btn-block');
  if (!checkoutButton || checkoutButton.classList.contains('payment-continue-btn')) return;

  checkoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    const totalText = document.getElementById('total')?.textContent || '$0';
    paymentState.orderTotal = parseInt(totalText.replace(/[^0-9]/g, ''), 10) || 0;
    paymentState.orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    openPaymentModal();
  });
};

window.initializePaymentFlow = initializePaymentFlow;
