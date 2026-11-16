const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');

const catalogState = {
  query: '',
  category: 'all',
  sort: 'default'
};

function getCatalogProducts() {
  let result = searchProducts(products, catalogState.query);

  result = filterProductsByCategory(result, catalogState.category);

  if (catalogState.sort === 'price-asc') {
    result = sortProductsByPrice(result, 'asc');
  } else if (catalogState.sort === 'price-desc') {
    result = sortProductsByPrice(result, 'desc');
  } else if (catalogState.sort === 'title-asc') {
    result = [...result];

    result.sort(function(a, b) {
      return a.title.localeCompare(b.title);
    });
  }

  return result;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');

  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = product.image;
  image.alt = product.title;
  image.loading = 'lazy';

  const body = document.createElement('div');
  body.classList.add('product-card__body');

  if (product.discountPercent > 0) {
    const discount = document.createElement('span');
    discount.classList.add('tag');
    discount.textContent = `Скидка ${product.discountPercent}%`;
    body.append(discount);
  }

  const category = document.createElement('p');
  category.classList.add('product-card__category');

  if (product.category === 'consoles') {
    category.textContent = 'Консоли';
  } else {
    category.textContent = 'Комплектующие';
  }

  const title = document.createElement('h3');
  title.textContent = product.title;

  const description = document.createElement('p');
  description.textContent = product.description;

  const price = document.createElement('strong');
  const finalPrice = calculateFinalPrice(
    product.price,
    product.discountPercent
  );
  price.textContent = formatPrice(finalPrice);

  const status = document.createElement('p');
  status.textContent = getProductStatus(product);

  const actions = document.createElement('div');
  actions.classList.add('product-card__actions');

  const detailsLink = document.createElement('a');
  detailsLink.classList.add('button', 'button--outline');
  detailsLink.href = `product.html#${product.slug}`;
  detailsLink.textContent = 'Подробнее';

  const button = document.createElement('button');
  button.classList.add('button');
  button.type = 'button';
  button.textContent = 'В корзину';
  button.dataset.action = 'add-to-cart';
  button.dataset.productId = String(product.id);

  if (!product.isAvailable) {
    button.disabled = true;
    button.textContent = 'Недоступно';
  }

  actions.append(detailsLink, button);
  body.append(category, title, description, price, status, actions);
  card.append(image, body);

  return card;
}

function renderProducts(productsToRender) {
  if (!productsContainer) {
    return;
  }

  productsContainer.textContent = '';

  if (catalogCount) {
    catalogCount.textContent = `Найдено товаров: ${productsToRender.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = productsToRender.length > 0;
  }

  productsToRender.forEach(function(product) {
    const card = createProductCard(product);
    productsContainer.append(card);
  });
}

function updateCatalog() {
  const productsToRender = getCatalogProducts();
  renderProducts(productsToRender);
}

if (searchInput) {
  searchInput.addEventListener('input', function(event) {
    catalogState.query = event.target.value;
    updateCatalog();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', function(event) {
    catalogState.category = event.target.value;
    updateCatalog();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', function(event) {
    catalogState.sort = event.target.value;
    updateCatalog();
  });
}

if (productsContainer) {
  productsContainer.addEventListener('click', function(event) {
    const button = event.target.closest('[data-action="add-to-cart"]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.productId);
    const selectedProduct = products.find(function(product) {
      return product.id === productId;
    });

    if (selectedProduct) {
      console.log(`Товар добавлен в корзину: ${selectedProduct.title}`);
    }
  });

  updateCatalog();
}