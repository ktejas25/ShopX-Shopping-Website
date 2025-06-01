// scart.js

// Helper function to format price as currency
function formatPrice(price) {
  return `Rs ${price.toFixed(2)}`;
}

// Load cart from localStorage or return empty array
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count badge in header
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElem = document.querySelector('.cart-count');
  if (countElem) {
    countElem.textContent = count;
  }
}

// Render cart items inside .listCart container
function renderCart() {
  const cart = getCart();
  const listCart = document.querySelector('.listCart');
  const totalValueElem = document.querySelector('.cart-total-value');
  if (!listCart || !totalValueElem) return;

  listCart.innerHTML = '';

  if (cart.length === 0) {
    listCart.innerHTML = '<p>Your cart is empty.</p>';
    totalValueElem.textContent = formatPrice(0);
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-name">${item.name}</div>
      <div class="item-price">${formatPrice(item.price)}</div>
      <div class="quantity">
        <button class="qty-btn decrease" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn increase" data-id="${item.id}">+</button>
      </div>
    `;

    listCart.appendChild(itemEl);
  });

  totalValueElem.textContent = formatPrice(total);

  // Add event listeners for quantity buttons
  document.querySelectorAll('.qty-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'));
      const isIncrease = button.classList.contains('increase');
      changeQuantity(id, isIncrease);
    });
  });
}

// Change quantity of a cart item
function changeQuantity(id, increase) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === id);
  if (idx === -1) return;

  if (increase) {
    cart[idx].quantity += 1;
  } else {
    cart[idx].quantity -= 1;
    if (cart[idx].quantity <= 0) {
      // Remove item if quantity zero or less
      cart.splice(idx, 1);
    }
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

// On page load, render cart and update count
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();
});

// Close button toggle example (if you want to toggle cart visibility)
const closeBtn = document.querySelector('.close');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    // If you have some UI toggle for cart visibility, toggle here
    // For example: document.body.classList.toggle('showCart');
    alert('Close cart or implement your close logic.');
  });
}



// Submit cart to backend
function checkoutCart() {
    const cartItems = getCartFromLocalStorage();
    fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, items: cartItems })  // Example user ID
    });
}


function addToCart(productId) {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    alert('Please login first to buy products.');
    window.location.href = 'login.html';
    return; // Stop execution if not logged in
  }

  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  alert(`${product.name} added to cart!`);
}
