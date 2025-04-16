if (!localStorage.getItem("token") && window.location.pathname.includes("cart.html")) {
    alert("Please log in first.");
    window.location.href = "login.html";
  }
  
// ✅ Load Cart & Wishlist from Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let discount = 0;

// ✅ PRODUCTS DATA (Ensure Image Paths Are Correct)
let products = [
  { name: "Rice - 10kg", price: 12.99, category: 'groceries', image: "images/rice.jpg", description: "High-quality basmati rice.", discount: 10, stock: 100 },
  { name: "Flour - 5kg", price: 8.99, category: 'groceries', image: "images/flour.jpg", description: "Premium wheat flour.", discount: 5, stock: 50 },
  { name: "ANCHOR BUTTER - 500G", price: 3.99, category: 'groceries', image: "images/anchorbutter.jpg", description: "Premium ANCHOR BUTTER.", discount: 4, stock: 50 },
  { name: "RAISING flour - 500G", price: 3.99, category: 'groceries', image: "images/raisingflour.jpg", description: "Premium ANCHOR BUTTER.", discount: 4, stock: 50 },
  { name: "COCA COLA - 250ML", price: 5.99, category: 'groceries', image: "images/cocacola.jpg", description: "Premium COCA COLA.", discount: 5, stock: 50 },
  { name: "WHOLE MILK - 1LTR", price: 7.99, category: 'groceries', image: "images/wholemilk.jpg", description: "Premium WHOLE MILK.", discount: 5, stock: 50 },
  { name: "YOGURT - 1kg", price: 1.99, category: 'groceries', image: "images/yogurt.jpg", description: "Premium YOGURT.", discount: 5, stock: 50 },
  { name: "EGGS - 12", price: 2.99, category: 'groceries', image: "images/eggs.jpg", description: "Premium EGGS.", discount: 5, stock: 50 },
  { name: "BREAD - 100G", price: 6.99, category: 'groceries', image: "images/bread.jpg", description: "Premium BREAD.", discount: 5, stock: 50 },
  { name: "SOAP - 12", price: 2.99, category: 'groceries', image: "images/soap.jpg", description: "Dove Soap.", discount: 5, stock: 50 },
 
];
// ✅ RENDER PRODUCTS FUNCTION (ONLY FOR `products.html`)
function renderProducts() {
  const productList = document.getElementById("productList");
  if (!productList) return;
  productList.innerHTML = '';

  products.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>Price: $${(product.price - (product.price * (product.discount / 100))).toFixed(2)}</strong></p>
      ${product.discount > 0 ? `<span class="discount-label">${product.discount}% Off</span>` : ''}
      <p>Stock: ${product.stock > 0 ? product.stock : "Out of Stock"}</p>
      <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
      <button onclick="addToWishlist('${product.name}', ${product.price}, '${product.image}')">❤️ Wishlist</button>
    `;
    productList.appendChild(productCard);
  });
}

// ✅ UPDATE CART & WISHLIST COUNTS IN NAVBAR
function updateCartCount() {
  const cartCountElement = document.querySelector("nav ul li a[href='cart.html']");
  if (cartCountElement) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.innerText = `Cart (${totalItems})`;
  }
}

function updateWishlistCount() {
  const wishlistCountElement = document.querySelector("nav ul li a[href='wishlist.html']");
  if (wishlistCountElement) {
    wishlistCountElement.innerText = `Wishlist (${wishlist.length})`;
  }
}

// ✅ ADD PRODUCT TO CART (Prevents Duplicates & Updates Quantity)
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
  updateCartCount();
}

// ✅ Load Cart Items in `cart.html`
function loadCartItems() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");
  const totalItemsElement = document.getElementById("totalItems");
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  let totalPrice = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalElement.textContent = "0.00";
    totalItemsElement.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    totalItems += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <p>${item.name} - $${item.price.toFixed(2)}</p>
      <div class="quantity-controls">
        <button onclick="decreaseQuantity(${index})">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseQuantity(${index})">+</button>
      </div>
      <button onclick="removeFromCart(${index})" class="remove-btn">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  totalPrice -= discount;
  cartTotalElement.textContent = totalPrice.toFixed(2);
  totalItemsElement.textContent = totalItems;

  updateCartCount();
}

function increaseQuantity(index) {
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    removeFromCart(index);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}

function applyCoupon() {
  const couponCode = document.getElementById("couponCode").value.trim();
  const couponMessage = document.getElementById("couponMessage");

  if (couponCode === "DISCOUNT10") {
    discount = 10;
    couponMessage.textContent = "10% Discount Applied!";
    couponMessage.style.color = "green";
  } else {
    discount = 0;
    couponMessage.textContent = "Invalid Coupon Code.";
    couponMessage.style.color = "red";
  }

  loadCartItems();
}

function proceedToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add items before checkout.");
    return;
  }
  alert("Redirecting to checkout...");
}

function displayGreeting() {
  const greetingElement = document.getElementById("greetingMessage");
  if (!greetingElement) return;
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) greeting = "Good Morning! Start Your Day with Great Deals!";
  else if (currentHour < 18) greeting = "Good Afternoon! Check Out Our Latest Discounts!";
  else greeting = "Good Evening! Don't Miss Our Nighttime Offers!";
  greetingElement.innerText = greeting;
}

function showSlides() {
  const slides = document.querySelectorAll(".slide");
  slides.forEach(slide => (slide.style.display = "none"));
  slideIndex = (slideIndex + 1) % slides.length;
  if (slides[slideIndex]) slides[slideIndex].style.display = "block";
}

function liveSearch() {
  const query = document.getElementById("searchBar").value.toLowerCase();
  const productElements = document.querySelectorAll(".product-card");
  productElements.forEach(product => {
    const productName = product.querySelector("h3").innerText.toLowerCase();
    product.style.display = productName.includes(query) ? "block" : "none";
  });
}

function startCountdown() {
  const deadline = new Date().getTime() + (12 * 60 * 60 * 1000);
  const timer = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = deadline - now;
    if (timeLeft < 0) {
      clearInterval(timer);
      document.getElementById("dealTimer").innerText = "Deal Ended!";
      return;
    }
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    document.getElementById("dealTimer").innerText = `Time Left: ${hours}:${minutes}:${seconds}`;
  }, 1000);
}

function loadFeaturedProducts() {
  const featuredProducts = document.getElementById("featuredProducts");
  if (!featuredProducts) return;
  featuredProducts.innerHTML = `
    <div class="product-card">Product 1</div>
    <div class="product-card">Product 2</div>
    <div class="product-card">Product 3</div>
  `;
}

// ✅ Initialize Features
let slideIndex = 0;
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  updateWishlistCount();
  if (document.getElementById("productList")) renderProducts();
  if (document.getElementById("cartItems")) loadCartItems();
  if (document.getElementById("orderHistory")) loadOrderHistory();
  displayGreeting();
  loadFeaturedProducts();
  setInterval(showSlides, 3000);
});

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
    async function saveOrderToHistory() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add items before checkout.");
    return;
  }

  try {
    const res = await fetch("https://metaco-backend.onrender.com/api/order", {

      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ items: cart })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message || "Order placed successfully and stock updated!");

      // Save to local order history
      const order = {
        id: Date.now(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toLocaleString()
      };

      orderHistory.push(order);
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      loadCartItems();
    } else {
      alert("Order failed: " + data.message);
    }
  } catch (err) {
    console.error("Error placing order:", err);
    alert("Something went wrong!");
  }
}

