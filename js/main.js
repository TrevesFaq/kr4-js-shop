// Карусель популярных товаров.
const carousel = document.querySelector('.carousel');

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.carousel__slide'));
  const dots = Array.from(carousel.querySelectorAll('.carousel__dot'));
  let activeIndex = 0;
  let timer;
  let isPaused = false;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, itemIndex) => {
      const isActive = itemIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      dots[itemIndex].classList.toggle('is-active', isActive);
      dots[itemIndex].setAttribute('aria-current', String(isActive));
    });
  }

  function startTimer() {
    window.clearInterval(timer);
    if (isPaused) return;
    timer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
  }

  carousel.querySelector('.carousel__arrow--prev').addEventListener('click', () => {
    showSlide(activeIndex - 1);
    startTimer();
  });

  carousel.querySelector('.carousel__arrow--next').addEventListener('click', () => {
    showSlide(activeIndex + 1);
    startTimer();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startTimer();
    });
  });

  carousel.addEventListener('mouseenter', () => window.clearInterval(timer));
  carousel.addEventListener('mouseleave', startTimer);
  carousel.addEventListener('focusin', () => window.clearInterval(timer));
  carousel.addEventListener('focusout', startTimer);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    isPaused = true;
  } else {
    startTimer();
  }
}

// Мобильное меню.
const menuButton = document.querySelector('.site-nav__toggle');
const menu = document.querySelector('.site-nav__list');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Подставить товар из ссылки в форму заказа.
const productSelect = document.getElementById('order-product');

if (productSelect) {
  const requestedProduct = new URLSearchParams(window.location.search).get('product');
  if (requestedProduct) productSelect.value = requestedProduct;
}

// Демонстрационная отправка формы без сервера.
const orderForm = document.getElementById('page-order-form');

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!orderForm.reportValidity()) return;

    document.getElementById('form-success').hidden = false;
    orderForm.reset();
  });
}

console.log('Файл main.js подключён');
console.log(product);
console.table(product);

function formatPrice(price) {
  return `${price} руб.`;
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

function getProductStatus(product) {
  if (product.isAvailable) {
    return 'В наличии';
  }

  return 'Нет в наличии';
}

function createProductSummary(product) {
  const finalPrice = calculateFinalPrice(
    product.price,
    product.discountPercent
  );
  const status = getProductStatus(product);

  return `${product.title}: ${formatPrice(finalPrice)}. Статус: ${status}.`;
}

const productSummary = createProductSummary(product);
console.log(productSummary);

const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement && productOutputElement) {
  messageElement.textContent = 'JavaScript подключён корректно.';
  productOutputElement.textContent = productSummary;
}