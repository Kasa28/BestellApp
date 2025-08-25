function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCartItemTemplate(i) {
  return `
    <div class="cart-item">
      <div class="cart-item-name">${cart[i].name}</div>
      <div class="cart-item-price">${formatPrice(cart[i].price)}</div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="decreaseQuantity(${i})">−</button>
        <span class="qty-count">${cart[i].quantity}</span>
        <button class="product-add-btn" onclick="increaseQuantity(${i})">+</button>
      </div>
    </div>
  `;
}



function getProductTemplateFromCategory(category, index) {
  const dish = myDishes[category][index];
  return `
    <div class="product-card">
      <img src="${dish.image}" alt="${dish.name}" class="product-image">
      <div class="product-info">
        <div class="product-text">
          <strong>${dish.name}</strong>
          <p>${dish.description}</p>
          <span class="product-price">${formatPrice(dish.price)}</span>
        </div>
        <button class="product-add-btn" onclick="addProductById(${dish.id})">+</button>
      </div>
    </div>
  `;
}

function createProductHTML(dish) {
  return `
    <div class="product-card">
      <img src="${dish.image}" alt="${dish.name}" class="product-image">
      <div class="product-info">
        <div class="product-text">
          <strong>${dish.name}</strong>
          <p>${dish.description}</p>
          <span class="product-price">${formatPrice(dish.price)}</span>
        </div>
        <button class="product-add-btn" onclick="addProductById(${dish.id})">+</button>
      </div>
    </div>
  `;
}
