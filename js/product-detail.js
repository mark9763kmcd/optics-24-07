// Product Detail Page JS
// Loads optical product info by ID, handles cart, tabs, and related products

// Uses the optical products data from products-data.js

document.addEventListener("DOMContentLoaded", () => {
  
if (typeof products === 'undefined') {
    console.error('Products data not loaded. Make sure products-data.js is included before this script.');
    return;
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

function renderProductDetail(product) {
  document.getElementById('detail-image').src = product.image;
  document.getElementById('detail-image').alt = product.name;
  document.getElementById('detail-name').textContent = product.name;
  document.getElementById('detail-price').innerHTML = `
    Rs. ${product.price}
    <span class="original-price">Rs. ${product.originalPrice}</span>
    <span class="discount-badge">-${product.discount}%</span>
  `;
  document.getElementById('detail-desc').textContent = product.desc;
  document.getElementById('detail-sku').textContent = 'SKU' + (1000 + product.id);
  // Categories/tags
  const tags = document.getElementById('detail-categories');
  tags.innerHTML = `<span>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>`;
}

function renderRelatedProducts(product) {
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const container = document.getElementById('related-products');
  container.innerHTML = '';
  related.forEach(p => {
    container.innerHTML += `
      <article class="product-card">
        <a href="product-detail.html?id=${p.id}" class="product-link">
          <img src="${p.image}" alt="${p.name}">
        </a>
        <h3>${p.name}</h3>
        <div class="product-desc">${p.desc}</div>
        <p>Rs. ${p.price}</p>
        <button class="btn add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
      </article>
    `;
  });
}

function setupQuantitySelector() {
  const minus = document.getElementById('qty-minus');
  const plus = document.getElementById('qty-plus');
  const input = document.getElementById('qty-input');
  minus.onclick = () => { if (input.value > 1) input.value--; };
  plus.onclick = () => { input.value++; };
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.product-tab-content');
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabContents.forEach(tc => tc.style.display = 'none');
      document.getElementById('tab-' + btn.dataset.tab).style.display = '';
    };
  });
}

function setupAddToCart(product) {
  document.getElementById('add-to-cart').onclick = () => {
    const qty = parseInt(document.getElementById('qty-input').value);
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart successfully!');
  };
}

// Main
const productId = getProductIdFromUrl();
const product = products.find(p => p.id === productId) || products[0];
renderProductDetail(product);
renderRelatedProducts(product);
setupQuantitySelector();
setupTabs();
setupAddToCart(product); 
});