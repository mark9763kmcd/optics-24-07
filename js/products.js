
document.addEventListener("DOMContentLoaded", () => {
  // Check if products is available from products-data.js
  if (typeof products === 'undefined') {
    console.error('Products data not loaded. Make sure products-data.js is included before this script.');
    return;
  }

  const productGrid = document.getElementById("product-grid-main");
  const paginationContainer = document.getElementById("pagination");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const priceMin = document.getElementById("price-min");
  const priceMax = document.getElementById("price-max");
  const minPriceLabel = document.getElementById("min-price-label");
  const maxPriceLabel = document.getElementById("max-price-label");
  const applyPriceFilterBtn = document.getElementById("apply-price-filter");
  const PRODUCTS_PER_PAGE = 8;
  let currentPage = 1;
  let selectedCategory = "all";
  let priceRange = [parseInt(priceMin.min), parseInt(priceMax.max)];
  let filteredProducts = products;

  // Calculate and display product counts for each category
  function updateCategoryButtons() {
    categoryButtons.forEach((btn) => {
      const category = btn.getAttribute("data-category");
      let count = 0;
      
      if (category === "all") {
        count = products.length;
      } else {
        count = products.filter(p => p.category.toLowerCase() === category.toLowerCase()).length;
      }
      
      // Update button text with count
      const categoryName = btn.textContent.split(' (')[0]; // Remove existing count if any
      btn.innerHTML = `
        <span>${categoryName}</span>
        <span class="category-count">${count}</span>
      `;
    });
  }

  // Update price labels
  function updatePriceLabels() {
    minPriceLabel.textContent = `Rs. ${priceMin.value}`;
    maxPriceLabel.textContent = `Rs. ${priceMax.value}`;
  }
  priceMin.addEventListener("input", () => {
    if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
      priceMin.value = priceMax.value;
    }
    updatePriceLabels();
  });
  priceMax.addEventListener("input", () => {
    if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
      priceMax.value = priceMin.value;
    }
    updatePriceLabels();
  });

  // Category filter logic
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCategory = btn.getAttribute("data-category");
      currentPage = 1;
      filterProducts();
    });
  });
  // Set 'All' as active by default
  if (categoryButtons.length) categoryButtons[0].classList.add("active");

  // Price filter logic
  applyPriceFilterBtn.addEventListener("click", () => {
    priceRange = [parseInt(priceMin.value), parseInt(priceMax.value)];
    currentPage = 1;
    filterProducts();
  });

  function filterProducts() {
    filteredProducts = products.filter((p) => {
      const price = parseInt(p.price.replace(/,/g, ""));
      const inCategory =
        selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const inPrice = price >= priceRange[0] && price <= priceRange[1];
      return inCategory && inPrice;
    });
    renderProductsPage(currentPage);
    renderPagination();
  }

  function renderProductsPage(page = 1) {
    productGrid.innerHTML = "";
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const productsToRender = filteredProducts.slice(start, end);
    productsToRender.forEach((product) => {
      const productCard = `
                <article class="product-card">
                    <a href="product-detail.html?id=${product.id}" class="product-link">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <h3>${product.name}</h3>
                    <div class="product-desc">${product.desc}</div>
                    <div class="product-pricing">
                        <span>Rs. ${product.price}</span>
                        <span class="original-price">Rs. ${product.originalPrice}</span>
                        <span class="discount-badge">-${product.discount}%</span>
                    </div>
                    <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </article>
            `;
      productGrid.innerHTML += productCard;
    });
  }

  function renderPagination() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (totalPages <= 1) return;
    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.className = "pagination-btn";
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.className =
        "pagination-btn" + (i === currentPage ? " active" : "");
      pageBtn.textContent = i;
      pageBtn.onclick = () => changePage(i);
      paginationContainer.appendChild(pageBtn);
    }
    // Next button
    const nextBtn = document.createElement("button");
    nextBtn.className = "pagination-btn";
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
  }

  function changePage(page) {
    currentPage = page;
    renderProductsPage(currentPage);
    renderPagination();
  }

  function updateCartCountBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-count-badge');
    if (badge) badge.textContent = count > 0 ? count : '0';
  }
  function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.qty++;
    } else {
      cart.push({ id: productId, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCountBadge();
    alert('Added to cart!');
  }
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const card = e.target.closest('.product-card');
      const id = card ? parseInt(card.querySelector('a').href.split('id=')[1]) : null;
      if (id) addToCart(id);
    }
  });

  // Initial render
  updatePriceLabels();
  updateCategoryButtons();
  filterProducts();
  updateCartCountBadge();
});
