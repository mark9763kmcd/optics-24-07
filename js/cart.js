// Cart Page JS
// Loads cart from localStorage, renders items, handles quantity, removal, and checkout

document.addEventListener("DOMContentLoaded", () => {
  // Check if products is available from products-data.js
  if (typeof products === 'undefined') {
    console.error('Products data not loaded. Make sure products-data.js is included before this script.');
    return;
  }

  // Use the same product array structure as products.js
  function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }
  
  function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  function findProduct(id) {
    return products.find(p => p.id === id);
  }
  
  function updateCartCountBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-count-badge');
    if (badge) badge.textContent = count > 0 ? count : '0';
  }
  
  function renderCart() {
    const cart = getCart();
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    let subtotal = 0, discount = 0, total = 0;
    
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Your cart is empty. <a href="products.html">Continue shopping</a></p>';
      document.getElementById('cart-subtotal').textContent = 'Rs. 0.00';
      document.getElementById('cart-discount').textContent = 'Rs. 0.00';
      document.getElementById('cart-total').textContent = 'Rs. 0.00';
      return;
    }
    
    cart.forEach(item => {
      const product = findProduct(item.id);
      if (!product) return;
      
      const itemSubtotal = parseInt(product.price.replace(/,/g, '')) * item.qty;
      const itemOriginal = parseInt(product.originalPrice.replace(/,/g, '')) * item.qty;
      subtotal += itemOriginal;
      discount += (itemOriginal - itemSubtotal);
      total += itemSubtotal;
      
      cartItemsDiv.innerHTML += `
        <div class="cart-item-card">
          <img src="${product.image}" alt="${product.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h4>${product.name}</h4>
            <div class="cart-item-pricing">
              <span>Rs. ${product.price}</span>
              <span class="original-price">Rs. ${product.originalPrice}</span>
              <span class="discount-badge">-${product.discount}%</span>
            </div>
            <div class="cart-item-qty">
              <button class="cart-item-qty-btn" data-id="${item.id}" data-action="minus">−</button>
              <input type="number" class="cart-item-qty-input" value="${item.qty}" min="1" data-id="${item.id}">
              <button class="cart-item-qty-btn" data-id="${item.id}" data-action="plus">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}">Remove</button>
        </div>
      `;
    });
    
    document.getElementById('cart-subtotal').textContent = `Rs. ${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('cart-discount').textContent = `Rs. ${discount.toLocaleString('en-IN')}`;
    document.getElementById('cart-total').textContent = `Rs. ${total.toLocaleString('en-IN')}`;
    updateCartCountBadge();
  }
  
  function setupCartEvents() {
    document.getElementById('cart-items').onclick = function(e) {
      if (e.target.classList.contains('cart-item-remove')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        let cart = getCart();
        cart = cart.filter(item => item.id !== id);
        setCart(cart);
        renderCart();
      } else if (e.target.classList.contains('cart-item-qty-btn')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return;
        
        if (e.target.getAttribute('data-action') === 'minus' && item.qty > 1) {
          item.qty--;
        }
        if (e.target.getAttribute('data-action') === 'plus') {
          item.qty++;
        }
        
        setCart(cart);
        renderCart();
      }
    };
    
    document.getElementById('cart-items').onchange = function(e) {
      if (e.target.classList.contains('cart-item-qty-input')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return;
        
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        item.qty = val;
        
        setCart(cart);
        renderCart();
      }
    };
  }
  
  function showCheckoutForm() {
    document.getElementById('proceed-checkout').style.display = 'none';
    document.getElementById('checkout-form').style.display = 'block';
  }
  
  function showOrderConfirmation(name, address, phone, email, total) {
    document.querySelector('.cart-container').scrollIntoView({behavior:'smooth'});
    document.getElementById('cart-items').style.display = 'none';
    document.querySelector('.cart-summary-card').style.display = 'block';
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('order-confirmation').style.display = 'block';
    document.getElementById('order-confirmation').innerHTML = `
      <h2>Thank you for your order!</h2>
      <p>Your eyewear order has been placed and will be delivered soon.</p>
      <div style="margin:1.2rem 0 0.7rem 0;">Order Total: <b>Rs. ${total}</b></div>
      <div style="margin-bottom:0.7rem;">Delivery to:</div>
      <div style="color:#444;">${name}<br>${address}<br>Phone: ${phone}<br>Email: ${email}</div>
      <div style="margin-top:2rem;">
        <a href="products.html" class="btn">Continue Shopping</a>
      </div>
    `;
  }
  
  // Event listeners
  document.getElementById('proceed-checkout').onclick = function() {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty. Please add some items before proceeding to checkout.');
      return;
    }
    showCheckoutForm();
  };
  
  document.getElementById('checkout-form').onsubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById('checkout-name').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const email = document.getElementById('checkout-email').value.trim();
    
    if (!name || !address || !phone || !email) {
      alert('Please fill in all fields.');
      return;
    }
    
    // Simple validation for phone and email
    if (!/^\d{10,}$/.test(phone)) {
      alert('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Get total
    const total = document.getElementById('cart-total').textContent.replace('Rs. ', '');
    
    // Clear cart
    localStorage.removeItem('cart');
    
    showOrderConfirmation(name, address, phone, email, total);
  };
  
  // Initialize cart page
  renderCart();
  setupCartEvents();
  updateCartCountBadge();
}); 