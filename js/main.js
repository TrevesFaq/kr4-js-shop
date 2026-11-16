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

console.log('Файл main.js подключён');
console.log(products);
console.table(products);

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

const productSummary = createProductSummary(products[0]);
console.log(productSummary);

const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

if (messageElement) {
  messageElement.textContent =
    'Массив товаров и функции обработки данных подключены.';
}

if (productOutputElement) {
  productOutputElement.textContent = [
    `Всего товаров: ${products.length}`,
    `Товаров в наличии: ${countAvailableProducts(products)}`,
    `Средняя цена: ${calculateAveragePrice(products)} руб.`,
    `Результатов поиска "playstation": ${searchProducts(products, 'playstation').length}`
  ].join('\n');
}

function getProductTitles(products) {
  return products.map(function(product) {
    return product.title;
  });
}

function getAvailableProducts(products) {
  return products.filter(function(product) {
    return product.isAvailable === true;
  });
}

console.log(getProductTitles(products));
console.table(getAvailableProducts(products));

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return products;
  }

  return products.filter(function(product) {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

const searchResult = searchProducts(products, 'playstation');
console.table(searchResult);

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }

  return products.filter(function(product) {
    return product.category === category;
  });
}

const accessoryProducts = filterProductsByCategory(products, 'accessories');
console.table(accessoryProducts);

function sortProductsByPrice(products, direction = 'asc') {
  const productsCopy = [...products];

  if (direction === 'desc') {
    return productsCopy.sort(function(a, b) {
      return b.price - a.price;
    });
  }

  return productsCopy.sort(function(a, b) {
    return a.price - b.price;
  });
}

const productsSortedByPrice = sortProductsByPrice(products, 'asc');
console.table(productsSortedByPrice);

function findProductById(products, id) {
  return products.find(function(product) {
    return product.id === id;
  });
}

const selectedProduct = findProductById(products, 3);

if (selectedProduct) {
  console.log(`Найден товар: ${selectedProduct.title}`);
} else {
  console.log('Товар не найден');
}

function calculateTotalPrice(products) {
  return products.reduce(function(sum, product) {
    return sum + product.price;
  }, 0);
}

function countAvailableProducts(products) {
  return products.filter(function(product) {
    return product.isAvailable === true;
  }).length;
}

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }

  const totalPrice = calculateTotalPrice(products);
  return Math.round(totalPrice / products.length);
}

console.log('Общая стоимость:', calculateTotalPrice(products));
console.log('Товаров в наличии:', countAvailableProducts(products));
console.log('Средняя цена:', calculateAveragePrice(products));

function getPreparedProducts(products, query, category, sortDirection) {
  let result = [...products];

  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);

  return result;
}

const preparedProducts = getPreparedProducts(
  products,
  'playstation',
  'consoles',
  'asc'
);

console.table(preparedProducts);