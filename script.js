let currentCategory = "Rice";

const menuContainer = document.getElementById("menu-container");
const categoryButtons = document.querySelectorAll(".category-btn");
const searchInput = document.querySelector(".search-input");
const cartOverlay = document.getElementById("cart-overlay");
const cartSidebar = document.querySelector(".cart-sidebar");
const toggleBtn = document.getElementById("togglebtn");

const cartList = document.getElementById("cart-items");
const totalBox = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");
const badgeFab = document.getElementById("cart-fab-badge");
const cartFab = document.getElementById("cart-fab");


let savedCart = localStorage.getItem("cart");
let cart = JSON.parse(localStorage.getItem("cart") || "[]");


function formatPrice(n) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(Number(n) || 0);
}

function renderMenu() {
  menuContainer.innerHTML = "";

  const currentProducts = myDishes[currentCategory];
  if (!currentProducts || currentProducts.length === 0) {
    menuContainer.innerHTML = '<p>Keine Produkte gefunden.</p>';
    return;
  }

  for (let i = 0; i < currentProducts.length; i++) {
    menuContainer.innerHTML += getProductTemplateFromCategory(currentCategory, i);
  }
}

function handleSearch(term) {
  const query = term.trim().toLowerCase();
  if (query.length < 3) return renderMenu();

  let results = [];

  for (let category in myDishes) {
    results = results.concat(
      myDishes[category].filter(dish =>
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query)
      )
    );
  }

  menuContainer.innerHTML = results.length
    ? results.map(createProductHTML).join("")
    : "<p>Keine Treffer gefunden.</p>";
}


function handleCategoryClick(button) {
  categoryButtons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
  currentCategory = button.dataset.category;
  renderMenu();
}

function addProductById(id) {
  for (let category in myDishes) {
    const dish = myDishes[category].find(d => d.id === id);
    if (dish) {
      addToCart(dish);
      return;
    }
  }
}

function addToCart(dish) {
  let index = cart.findIndex(item => item.id === dish.id);
  if (index > -1) {
    cart[index].quantity++;
  } else {
    cart.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1
    });
  }
  updateCart();
}

function increaseQuantity(index) {
  cart[index].quantity++;
  updateCart();
}

function decreaseQuantity(index) {
  cart[index].quantity--;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function updateCart() {
  renderCartItems();
  calculatePrices();
  updateBadges();
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCartItems() {
  if (!cartList) return;
  cartList.innerHTML = cart.length === 0
    ? "<li class='empty-cart-message'>Warenkorb ist leer</li>"
    : cart.map((_, i) => getCartItemTemplate(i)).join("");
}

function calculatePrices() {
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (totalBox) totalBox.textContent = formatPrice(total);

  if (checkoutBtn) {
    if (total > 0) {
      checkoutBtn.textContent = `Bezahlen (${formatPrice(total)})`;
      checkoutBtn.disabled = false;
      checkoutBtn.style.opacity = "1";
      checkoutBtn.style.cursor = "pointer";
    } else {
      checkoutBtn.textContent = "Warenkorb ist leer";
      checkoutBtn.disabled = true;
      checkoutBtn.style.opacity = "0.6";
      checkoutBtn.style.cursor = "not-allowed";
    }
  }
}

function updateBadges() {
  let quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badgeFab) {
    badgeFab.textContent = quantity;
    badgeFab.hidden = quantity === 0;
  }
  if (cartFab) {
    cartFab.style.visibility = quantity > 0 ? "visible" : "hidden";
    cartFab.style.opacity = quantity > 0 ? "1" : "0";
  }
}

function toggleCart() {
  cartSidebar?.classList.toggle("open");
  cartOverlay?.classList.toggle("visible");
}

function toggleDesktopCart() {
  cartSidebar.classList.toggle("desktop-hidden");
}

function closeMobileCart() {
  cartSidebar.classList.remove("mobile-visible");
  cartOverlay?.classList.remove("active");
}

function closeDesktopCart() {
  cartSidebar.classList.add("desktop-hidden");
}

function closeCart() {
  if (window.innerWidth <= 768) {
    closeMobileCart();
  } else {
    closeDesktopCart();
  }
}

function hidePopup() {
  const popup = document.getElementById("popup");
  if (popup) {
    popup.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

window.onload = function () {
  renderMenu();
  updateCart();
};

function openCart() {
  document.querySelector('.cart-sidebar').classList.add('open');
  document.body.classList.add('cart-open'); 
}

function closeCart() {
  document.querySelector('.cart-sidebar').classList.remove('open');
  document.body.classList.remove('cart-open'); 
}



window.addProductById = addProductById;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.handleCategoryClick = handleCategoryClick;
window.closeCart = closeCart;
window.hidePopup = hidePopup;
