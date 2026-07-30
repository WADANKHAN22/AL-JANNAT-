// ===========================
// ALJANNAT Checkout Experience
// ===========================
// This is a frontend-only checkout flow with no backend or database dependencies.

const paymentState = {
  orderTotal: 0,
  orderNumber: 'ORD-2026-000145',
  invoiceNumber: 'INV-2026-000872',
  paymentDate: null,
  paymentAmount: 0
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(value);
};

const createPaymentModal = () => {
  const modal = document.createElement('div');
  modal.className = 'payment-modal';
  modal.innerHTML = `
    <div class="payment-modal-backdrop" aria-hidden="true"></div>
    <div class="payment-modal-card" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
      <button class="payment-modal-close" aria-label="Close checkout modal"><i class="fa-solid fa-xmark"></i></button>
      <div class="payment-modal-header">
        <span class="eyebrow">Checkout</span>
        <h2 id="payment-modal-title">Review Your Order</h2>
        <p>This is a local confirmation step for the checkout process.</p>
      </div>
      <div class="payment-summary-details">
        <div class="summary-row"><span>Order Total</span><strong id="checkout-total">PKR 0</strong></div>
        <div class="summary-row"><span>Order Number</span><strong>${paymentState.orderNumber}</strong></div>
        <div class="summary-row"><span>Invoice Number</span><strong>${paymentState.invoiceNumber}</strong></div>
      </div>
      <div class="payment-modal-footer">
        <button class="btn btn-primary payment-continue-btn">Confirm Order</button>
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
  checkoutTotal.textContent = formatCurrency(paymentState.orderTotal);

  modal.classList.add('open');
  document.body.classList.add('modal-open');
};

const closePaymentModal = (modal) => {
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
};

const bindPaymentModalEvents = (modal) => {
  if (modal.dataset.paymentEventsBound === 'true') return;

  const continueBtn = modal.querySelector('.payment-continue-btn');

  continueBtn.addEventListener('click', () => {
    closePaymentModal(modal);
    renderOrderConfirmation();
  });

  const closeButton = modal.querySelector('.payment-modal-close');
  closeButton.addEventListener('click', () => closePaymentModal(modal));
  modal.querySelector('.payment-modal-backdrop').addEventListener('click', () => closePaymentModal(modal));

  modal.dataset.paymentEventsBound = 'true';
};

const renderOrderConfirmation = () => {
  const resultScreen = document.createElement('div');
  resultScreen.className = 'payment-result-screen';
  paymentState.paymentAmount = paymentState.orderTotal;
  paymentState.paymentDate = new Date().toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' });

  resultScreen.innerHTML = `
    <div class="payment-result-card success">
      <div class="payment-result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h2>Order Confirmed</h2>
      <p>Your order has been placed successfully. Thank you for shopping with ALJANNAT.</p>
      <div class="payment-result-summary">
        <div><span>Order Number</span><strong>${paymentState.orderNumber}</strong></div>
        <div><span>Invoice Number</span><strong>${paymentState.invoiceNumber}</strong></div>
        <div><span>Order Total</span><strong>${formatCurrency(paymentState.paymentAmount)}</strong></div>
        <div><span>Confirmation Time</span><strong>${paymentState.paymentDate}</strong></div>
      </div>
      <div class="payment-result-actions">
        <button class="btn btn-primary">Download Receipt</button>
        <button class="btn btn-secondary">Print Receipt</button>
        <button class="btn btn-outline">Track Order</button>
        <button class="btn btn-outline">Continue Shopping</button>
      </div>
    </div>
  `;

  document.body.appendChild(resultScreen);
};

const initializePaymentFlow = () => {
  const checkoutButton = document.querySelector('.btn-primary.btn-block');
  if (!checkoutButton) return;

  checkoutButton.addEventListener('click', (event) => {
    event.preventDefault();
    paymentState.orderTotal = parseInt((document.getElementById('total')?.textContent || 'PKR 0').replace(/[^0-9]/g, ''), 10) || 0;
    openPaymentModal();
  });
};

window.initializePaymentFlow = initializePaymentFlow;

