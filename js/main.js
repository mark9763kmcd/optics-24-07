// Flower Shop Main JS
// Author: Your Name
// Description: Handles carousel functionality

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
    let id = null;
    if (card) {
      // Try to get id from product-detail link or data-id
      const link = card.querySelector('a');
      if (link && link.href.includes('id=')) {
        id = parseInt(link.href.split('id=')[1]);
      } else if (e.target.dataset.id) {
        id = parseInt(e.target.dataset.id);
      }
    }
    if (id) addToCart(id);
  }
});
document.addEventListener('DOMContentLoaded', function() {
  updateCartCountBadge();
});

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel-slide");
  if (carousel) {
    const slides = document.querySelectorAll(".carousel-item");
    const totalSlides = slides.length;
    let index = 0;
    const intervalTime = 2000; // 4 seconds
    let slideInterval;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(${-index * 100}%)`;
    };

    const nextSlide = () => {
      index = (index + 1) % totalSlides;
      updateCarousel();
    };

    const startSlideShow = () => {
      slideInterval = setInterval(nextSlide, intervalTime);
    };

    const stopSlideShow = () => {
      clearInterval(slideInterval);
    };

    // Start slideshow
    startSlideShow();

    // Optional: Pause on hover
    document.querySelector('.carousel-container').addEventListener('mouseenter', stopSlideShow);
    document.querySelector('.carousel-container').addEventListener('mouseleave', startSlideShow);
  }
}); 