let currentModalProduct = null;
let selectedProductSize = "";
let selectedProductColor = "";
let selectedProductImage = 0;
let currentModalImages = [];

const productDetailsModal = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("productDetailsModal"),
);

function openProductDetails(productId) {
  const product = products.find(
    (item) => String(item.id) === String(productId),
  );
  if (!product) return;

  currentModalProduct = product;
  selectedProductSize = "";
  selectedProductColor = "";
  selectedProductImage = 0;

  // استخدم صور المنتج المحددة، أو صور منتجات أخرى من نفس القسم كصور إضافية مؤقتة.
  const sameCategoryImages = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id,
    )
    .map((item) => item.image);
  const images =
    product.images && product.images.length
      ? product.images
      : [product.image, ...sameCategoryImages].filter(Boolean).slice(0, 4);
  currentModalImages = images;

  document.getElementById("productDetailsTitle").textContent = product.name;
  document.getElementById("modalProductPrice").textContent = formatPrice(
    product.price,
  );
  document.getElementById("modalProductDescription").textContent =
    product.description || "اكتشف تفاصيل هذا المنتج من مجموعة DANZO.";
  document.getElementById("modalProductQuantity").value = 1;

  // مقاسات الأحذية والشربات تختلف عن الشنط والإكسسوارات.
  const defaultSizes = [
    "sneakers",
    "classic",
    "mirror",
    "high-copy",
    "sherbat",
  ].includes(product.category)
    ? ["39", "40", "41", "42", "43", "44"]
    : ["مقاس واحد"];

  const defaultColors = [
    { name: "أسود", value: "#171717" },
    { name: "أبيض", value: "#ffffff" },
    { name: "بيج", value: "#c8b69b" },
    { name: "كحلي", value: "#172b4d" },
  ];

  renderModalImages(images);
  renderModalSizes(product.sizes || defaultSizes);
  renderModalColors(product.colors || defaultColors);

  document.getElementById("selectedSizeText").textContent = "اختر المقاس";
  document.getElementById("selectedColorText").textContent = "اختر اللون";
  productDetailsModal.show();
}

function renderModalImages(images) {
  const mainImage = document.getElementById("modalMainImage");
  const thumbnails = document.getElementById("modalProductThumbnails");
  thumbnails.innerHTML = "";

  const validImages = [...new Set((images || []).filter(Boolean))];
  if (!validImages.length) {
    mainImage.removeAttribute("src");
    return;
  }

  mainImage.src = validImages[0];
  mainImage.alt = currentModalProduct
    ? currentModalProduct.name
    : "صورة المنتج";

  validImages.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `product-thumbnail ${index === 0 ? "active" : ""}`;
    button.setAttribute("aria-label", `عرض الصورة ${index + 1}`);

    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = image;
    thumbnailImage.alt = `صورة ${index + 1}`;
    thumbnailImage.loading = "lazy";
    button.appendChild(thumbnailImage);

    button.addEventListener("click", () => {
      selectedProductImage = index;
      mainImage.src = image;
      thumbnails
        .querySelectorAll(".product-thumbnail")
        .forEach((item, itemIndex) => {
          item.classList.toggle("active", itemIndex === index);
        });
    });

    thumbnails.appendChild(button);
  });
}

function renderModalSizes(sizes) {
  const container = document.getElementById("modalSizeOptions");
  container.innerHTML = "";

  sizes.forEach((size) => {
    const value = typeof size === "object" ? size.value : size;
    const label = typeof size === "object" ? size.label : size;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "size-option";
    button.textContent = label;

    button.addEventListener("click", () => {
      selectedProductSize = String(value);
      container
        .querySelectorAll(".size-option")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      document.getElementById("selectedSizeText").textContent =
        `المقاس: ${label}`;
    });

    container.appendChild(button);
  });
}

function renderModalColors(colors) {
  const container = document.getElementById("modalColorOptions");
  container.innerHTML = "";

  colors.forEach((color) => {
    const name = typeof color === "object" ? color.name : color;
    const value = typeof color === "object" ? color.value : color;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-option";
    button.title = name;
    button.setAttribute("aria-label", name);

    const swatch = document.createElement("span");
    swatch.style.backgroundColor = value;
    button.appendChild(swatch);

    button.addEventListener("click", () => {
      selectedProductColor = String(name);
      container
        .querySelectorAll(".color-option")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      document.getElementById("selectedColorText").textContent =
        `اللون: ${name}`;
    });

    container.appendChild(button);
  });
}

document.getElementById("quantityMinus").addEventListener("click", () => {
  const input = document.getElementById("modalProductQuantity");
  input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
});

document.getElementById("quantityPlus").addEventListener("click", () => {
  const input = document.getElementById("modalProductQuantity");
  input.value = Math.min(99, (parseInt(input.value, 10) || 1) + 1);
});

document
  .getElementById("modalProductQuantity")
  .addEventListener("change", (event) => {
    const quantity = parseInt(event.target.value, 10) || 1;
    event.target.value = Math.min(99, Math.max(1, quantity));
  });

document.getElementById("modalAddToCart").addEventListener("click", () => {
  if (!currentModalProduct) return;

  if (!selectedProductSize) {
    showToast("من فضلك اختر المقاس أولاً");
    return;
  }
  if (!selectedProductColor) {
    showToast("من فضلك اختر اللون أولاً");
    return;
  }

  const quantity = Math.min(
    99,
    Math.max(
      1,
      parseInt(document.getElementById("modalProductQuantity").value, 10) || 1,
    ),
  );

  addToCartWithOptions({
    productId: currentModalProduct.id,
    name: currentModalProduct.name,
    price: Number(currentModalProduct.price) || 0,
    image:
      currentModalImages[selectedProductImage] || currentModalProduct.image,
    size: selectedProductSize,
    color: selectedProductColor,
    quantity,
  });

  productDetailsModal.hide();
});

/* عدّل رقم واتساب المتجر إلى الرقم الحقيقي */
const DANZO_WHATSAPP_NUMBER = "201065975524";
const CURRENCY = "ج.م";

const cart = [];
const favorites = new Set();
let activeCategory = "all";
let searchTerm = "";
let productsPerPage = 8;
let currentProductPage = 1;
const shopSections = [
  "home",
  "categories",
  "products",
  "offers",
  "about",
  "contact",
];

document.getElementById("currentYear").textContent = new Date().getFullYear();

function formatPrice(price) {
  return (
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(price) +
    " " +
    CURRENCY
  );
}
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
}
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("danzoToast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* رسم الأقسام */
function renderCategories() {
  document.getElementById("categoriesGrid").innerHTML = categories
    .map(
      (category, index) => `
        <div class="col-6 col-lg-3">
            <a href="#products" class="category-card" data-category-link="${category.id}">
                <img src="${escapeHTML(category.image)}" alt="${escapeHTML(category.name)}" loading="lazy"
                     onerror="this.onerror=null;this.src='https://placehold.co/700x800/101827/72b4ff?text=${encodeURIComponent(category.name)}'">
                <div class="category-info">
                    <small>${String(index + 1).padStart(2, "0")} / COLLECTION</small>
                    <h4>${escapeHTML(category.name)}</h4>
                    <span>${escapeHTML(category.description)}</span>
                </div>
                <i class="fa-solid fa-arrow-left category-arrow"></i>
            </a>
        </div>
    `,
    )
    .join("");

  document.getElementById("footerCategories").innerHTML = categories
    .map(
      (category) => `
        <li><a href="#products" data-footer-filter="${category.id}">${escapeHTML(category.name)}</a></li>
    `,
    )
    .join("");
}

document
  .getElementById("categoriesListToggle")
  .addEventListener("click", (event) => {
    const button = event.currentTarget;
    const categoryList = document.getElementById("categoriesGrid");
    const expanded = button.getAttribute("aria-expanded") === "true";
    categoryList.hidden = expanded;
    button.setAttribute("aria-expanded", String(!expanded));
    button.innerHTML = expanded
      ? '<i class="fa-solid fa-chevron-down" aria-hidden="true"></i> إظهار الأقسام'
      : '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i> إخفاء الأقسام';
  });

/* رسم أزرار الفلترة */
function renderFilters() {
  const all = [{ id: "all", name: "كل المنتجات" }, ...categories];
  document.getElementById("productFilters").innerHTML = all
    .map(
      (category) => `
        <button class="filter-btn ${category.id === activeCategory ? "active" : ""}" data-filter="${category.id}">
            ${escapeHTML(category.name)}
        </button>
    `,
    )
    .join("");

  const mobileFilterMenu = document.getElementById("mobileCategoryFilterMenu");
  mobileFilterMenu.innerHTML = all
    .map(
      (category) =>
        `<button type="button" class="mobile-category-option" role="option" aria-selected="${category.id === activeCategory}" data-mobile-filter="${escapeHTML(category.id)}">
          <span>${escapeHTML(category.name)}</span>
          <i class="fa-solid fa-check" aria-hidden="true"></i>
        </button>`,
    )
    .join("");
  const selectedCategory = all.find(
    (category) => category.id === activeCategory,
  );
  document.getElementById("mobileCategoryFilterLabel").textContent =
    selectedCategory ? selectedCategory.name : all[0].name;
}

const mobileCategoryFilterControl = document.getElementById(
  "mobileCategoryFilterControl",
);
const mobileCategoryFilterButton = document.getElementById(
  "mobileCategoryFilterButton",
);
const mobileCategoryFilterMenu = document.getElementById(
  "mobileCategoryFilterMenu",
);

function setMobileCategoryFilterOpen(open, focusSelected = false) {
  mobileCategoryFilterMenu.hidden = !open;
  mobileCategoryFilterButton.setAttribute("aria-expanded", String(open));
  document
    .querySelector(".mobile-filter-chevron")
    .classList.toggle("fa-chevron-up", open);
  document
    .querySelector(".mobile-filter-chevron")
    .classList.toggle("fa-chevron-down", !open);
  if (open && focusSelected) {
    mobileCategoryFilterMenu
      .querySelector('[aria-selected="true"]')
      .focus();
  }
}

document
  .getElementById("mobileCategoryFilterButton")
  .addEventListener("click", () => {
    const isOpen =
      mobileCategoryFilterButton.getAttribute("aria-expanded") === "true";
    setMobileCategoryFilterOpen(!isOpen, !isOpen);
  });

mobileCategoryFilterButton.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    setMobileCategoryFilterOpen(true, true);
  }
});

mobileCategoryFilterMenu.addEventListener("click", (event) => {
  const option = event.target.closest("[data-mobile-filter]");
  if (!option) return;
  activeCategory = option.dataset.mobileFilter;
  searchTerm = "";
  currentProductPage = 1;
  renderFilters();
  renderProducts();
  setMobileCategoryFilterOpen(false);
  mobileCategoryFilterButton.focus();
});

mobileCategoryFilterMenu.addEventListener("keydown", (event) => {
  const options = [...mobileCategoryFilterMenu.querySelectorAll("[role='option']")];
  const currentIndex = options.indexOf(document.activeElement);
  let nextIndex = currentIndex;

  if (event.key === "Escape") {
    event.preventDefault();
    setMobileCategoryFilterOpen(false);
    mobileCategoryFilterButton.focus();
    return;
  }
  if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % options.length;
  else if (event.key === "ArrowUp")
    nextIndex = (currentIndex - 1 + options.length) % options.length;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = options.length - 1;
  else return;

  event.preventDefault();
  options[nextIndex].focus();
});

document.addEventListener("click", (event) => {
  if (!mobileCategoryFilterControl.contains(event.target)) {
    setMobileCategoryFilterOpen(false);
  }
});

/* بطاقة المنتج */
function productCard(product, options = {}) {
  const isFavorite = favorites.has(product.id);
  const isInCart = cart.some(
    (item) => String(item.productId) === String(product.id),
  );
  const showRemove = options.showRemove === true;
  return `
    <div class="col-6 col-lg-3 product-item" data-product-id="${escapeHTML(product.id)}">
        <div class="product-card">
            <div class="product-image">
                <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy"
                     onerror="this.onerror=null;this.src='https://placehold.co/700x700/101827/72b4ff?text=${encodeURIComponent(product.name)}'">
                ${product.badge ? `<span class="product-badge">${escapeHTML(product.badge)}</span>` : ""}
                <button type="button" class="product-favorite ${isFavorite ? "liked" : ""}" data-favorite-id="${escapeHTML(product.id)}" aria-label="إضافة للمفضلة" title="إضافة للمفضلة">
                    <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>
                ${
                  !showRemove
                    ? `
               `
                    : ""
                }
            </div>
            <div class="product-info">
                <div class="product-category">${escapeHTML(product.categoryName)}</div>
                <h5 class="product-name">${escapeHTML(product.name)}</h5>
                <p class="product-description">${escapeHTML(product.description || "اختيار مميز من مجموعة DANZO.")}</p>
                <div class="product-rating"><i class="fa-solid fa-star"></i> ${escapeHTML(product.rating || "4.8")}</div>
                <div class="product-bottom">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="product-old-price">${formatPrice(product.oldPrice)}</span>` : ""}
                </div>
                <div class="product-card-actions">
                    ${
                      showRemove
                        ? `
                    <button type="button" class="btn-view-product" data-view-product="${escapeHTML(product.id)}">
                        <i class="fa-regular fa-eye"></i> عرض المنتج
                    </button>
                    <button type="button" class="btn-remove-favorite" data-remove-favorite="${escapeHTML(product.id)}">
                        <i class="fa-solid fa-heart-crack"></i> إزالة
                    </button>`
                        : `
                        <button type="button" class="btn-add-cart ${isInCart ? "in-cart" : ""}" data-add-cart="${escapeHTML(product.id)}" data-cart-action="${isInCart ? "remove" : "add"}" aria-label="${isInCart ? "إزالة من السلة" : "إضافة للسلة"}">
                            <i class="fa-solid ${isInCart ? "fa-trash-can" : "fa-bag-shopping"}"></i> ${isInCart ? "إزالة من السلة" : "إضافة للسلة"}
                    </button>
                    <button type="button" class="btn-view-product" data-view-product="${escapeHTML(product.id)}">
                        <i class="fa-regular fa-eye"></i> عرض المنتج
                    </button>`
                    }
                </div>
            </div>
        </div>
    </div>`;
}

/* عرض المنتجات وتطبيق البحث والفلتر */
function renderProducts() {
  const filtered = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const text = (
      product.name +
      " " +
      product.categoryName +
      " " +
      product.description
    ).toLowerCase();
    return matchesCategory && text.includes(searchTerm);
  });

  const pageCount = Math.ceil(filtered.length / productsPerPage);
  currentProductPage = Math.min(currentProductPage, Math.max(pageCount, 1));
  const start = (currentProductPage - 1) * productsPerPage;
  const pageProducts = filtered.slice(start, start + productsPerPage);

  document.getElementById("productsGrid").innerHTML = pageProducts
    .map((product) => productCard(product))
    .join("");
  document.getElementById("noProducts").style.display = filtered.length
    ? "none"
    : "block";
  const shownFrom = filtered.length ? start + 1 : 0;
  const shownTo = Math.min(start + productsPerPage, filtered.length);
  document.getElementById("productsCount").textContent =
    `عرض ${shownFrom} - ${shownTo} من ${filtered.length} منتج`;
  renderProductPagination(pageCount);
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === activeCategory);
  });
}

function renderProductPagination(pageCount) {
  const pagination = document.getElementById("productsPagination");
  if (pageCount <= 1) {
    pagination.innerHTML = "";
    return;
  }

  const pageButton = (page, label, disabled = false, current = false) => `
          <button type="button" class="page-btn ${current ? "active" : ""}"
            data-product-page="${page}" ${disabled ? "disabled" : ""}
            ${current ? 'aria-current="page"' : ""}>${label}</button>`;

  pagination.innerHTML = [
    pageButton(currentProductPage - 1, "السابق", currentProductPage === 1),
    ...Array.from({ length: pageCount }, (_, index) => {
      const page = index + 1;
      return pageButton(page, page, false, page === currentProductPage);
    }),
    pageButton(
      currentProductPage + 1,
      "التالي",
      currentProductPage === pageCount,
    ),
  ].join("");
}

/* صفحة المفضلة */
function renderFavorites() {
  const list = products.filter((product) => favorites.has(product.id));
  document.getElementById("favoritesGrid").innerHTML = list
    .map((product) => productCard(product, { showRemove: true }))
    .join("");
  document.getElementById("favoritesEmpty").style.display = list.length
    ? "none"
    : "block";
  document.getElementById("favoritesSummary").textContent =
    `عدد المنتجات في المفضلة: ${list.length}`;
  document.getElementById("favoriteCount").textContent = favorites.size;
}

/* فتح وإغلاق صفحة المفضلة */
function showFavoritesPage() {
  document.getElementById("favoritesPage").style.display = "block";
  shopSections.forEach((id) => {
    document.getElementById(id).style.display = "none";
  });
  document.querySelector(".ticker").style.display = "none";
  document.querySelectorAll(".navbar .nav-link").forEach((link) => {
    link.classList.remove("active");
  });
  renderFavorites();
  window.scrollTo({ top: 0, behavior: "smooth" });
  const navbar = document.getElementById("mainNavbar");
  if (navbar.classList.contains("show"))
    bootstrap.Collapse.getOrCreateInstance(navbar).hide();
}
function showShop({ scrollToTop = true } = {}) {
  document.getElementById("favoritesPage").style.display = "none";
  shopSections.forEach((id) => {
    document.getElementById(id).style.display = "";
  });
  document.querySelector(".ticker").style.display = "";
  if (scrollToTop) window.scrollTo({ top: 0, behavior: "smooth" });
  updateActiveNav();
}
document
  .getElementById("favoritesBtn")
  .addEventListener("click", showFavoritesPage);
document.getElementById("backToShop").addEventListener("click", showShop);
document.getElementById("browseProducts").addEventListener("click", () => {
  showShop();
  setTimeout(
    () =>
      document
        .getElementById("products")
        .scrollIntoView({ behavior: "smooth" }),
    100,
  );
});
document.getElementById("brandHome").addEventListener("click", showShop);
document
  .getElementById("footerFavoritesLink")
  .addEventListener("click", (event) => {
    event.preventDefault();
    showFavoritesPage();
  });

/* الفلاتر وروابط الأقسام */
document.addEventListener("click", (event) => {
  // الضغط على كارت القسم ينقل لقسم المنتجات ويعرض منتجات القسم المختار
  const categoryLink = event.target.closest("[data-category-link]");
  if (categoryLink) {
    event.preventDefault();
    const categoryId = categoryLink.getAttribute("data-category-link");
    showShop();
    activeCategory = categoryId;
    searchTerm = "";
    currentProductPage = 1;
    renderFilters();
    renderProducts();
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.style.display = "";
      requestAnimationFrame(() =>
        productsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      );
    }
    return;
  }

  // الضغط على فلتر القسم داخل المنتجات
  const filter = event.target.closest("[data-filter]");
  if (filter) {
    event.preventDefault();
    activeCategory = filter.dataset.filter;
    searchTerm = "";
    currentProductPage = 1;
    renderFilters();
    renderProducts();
    return;
  }

  // روابط الأقسام الموجودة في الفوتر
  const footerFilter = event.target.closest("[data-footer-filter]");
  if (footerFilter) {
    event.preventDefault();
    activeCategory = footerFilter.dataset.footerFilter;
    searchTerm = "";
    currentProductPage = 1;
    showShop();
    renderFilters();
    renderProducts();
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.style.display = "";
      requestAnimationFrame(() =>
        productsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      );
    }
  }
});

/* البحث */
const searchModalElement = document.getElementById("searchModal");
const searchModal = bootstrap.Modal.getOrCreateInstance(searchModalElement);
const productSearchInput = document.getElementById("productSearchInput");
const clearSearchButton = document.getElementById("clearSearch");

searchModalElement.addEventListener("shown.bs.modal", () => {
  productSearchInput.focus();
});
productSearchInput.addEventListener("input", () => {
  clearSearchButton.hidden = !productSearchInput.value;
});
clearSearchButton.addEventListener("click", () => {
  productSearchInput.value = "";
  clearSearchButton.hidden = true;
  productSearchInput.focus();
});

document.getElementById("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  searchTerm = productSearchInput.value.trim().toLowerCase();
  activeCategory = "all";
  currentProductPage = 1;
  showShop({ scrollToTop: false });
  renderFilters();
  renderProducts();

  searchModalElement.addEventListener(
    "hidden.bs.modal",
    () =>
      document
        .getElementById("products")
        .scrollIntoView({ behavior: "smooth", block: "start" }),
    { once: true },
  );
  searchModal.hide();

  const count = products.filter((product) =>
    (product.name + " " + product.categoryName + " " + product.description)
      .toLowerCase()
      .includes(searchTerm),
  ).length;
  showToast(
    searchTerm
      ? count
        ? `عدد المنتجات المطابقة: ${count}`
        : "لم يتم العثور على منتجات مطابقة"
      : "يتم عرض كل المنتجات",
  );
});

/* تحديث حالة القلب في كل بطاقات المنتج */
function updateFavoriteButtons() {
  document.querySelectorAll("[data-favorite-id]").forEach((button) => {
    const liked = favorites.has(button.dataset.favoriteId);
    button.classList.toggle("liked", liked);
    const icon = button.querySelector("i");
    icon.classList.toggle("fa-solid", liked);
    icon.classList.toggle("fa-regular", !liked);
  });
  document.getElementById("favoriteCount").textContent = favorites.size;
}

/* سلة المشتريات */
const cartModal = bootstrap.Modal.getOrCreateInstance(
  document.getElementById("danzoCartModal"),
);
const cartCountElement = document.getElementById("cartCount");
const cartEmpty = document.getElementById("cartEmpty");
const cartContent = document.getElementById("cartContent");
const cartItemsElement = document.getElementById("cartItems");
const cartTotalElement = document.getElementById("cartTotal");

function getCartItem(key) {
  return cart.find(
    (item) => item.cartKey === String(key) || item.id === String(key),
  );
}
function getCartQuantity() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
function updateCartCount() {
  cartCountElement.textContent = getCartQuantity();
}

function addToCart(id) {
  const product = products.find((item) => item.id === String(id));
  if (!product) return;

  const cartKey = `${product.id}||`;
  const existing = cart.find((item) => item.cartKey === cartKey);
  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + 1);
  } else {
    cart.push({
      cartKey,
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image,
      size: "",
      color: "",
      quantity: 1,
    });
  }

  updateCartCount();
  renderCart();
  renderProducts();
  showToast("تمت إضافة " + product.name + " للسلة");
}

function addToCartWithOptions(selectedItem) {
  const cartKey = `${selectedItem.productId}|${selectedItem.size}|${selectedItem.color}`;
  const existing = cart.find((item) => item.cartKey === cartKey);

  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + selectedItem.quantity);
  } else {
    cart.push({
      cartKey,
      id: String(selectedItem.productId),
      productId: String(selectedItem.productId),
      name: selectedItem.name,
      price: Number(selectedItem.price) || 0,
      image: selectedItem.image,
      size: selectedItem.size,
      color: selectedItem.color,
      quantity: selectedItem.quantity,
    });
  }

  renderCart();
  renderProducts();
  showToast(
    `تمت إضافة ${selectedItem.name} للسلة (${selectedItem.size} - ${selectedItem.color})`,
  );
}

function changeQuantity(key, change) {
  const item = getCartItem(key);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    const index = cart.findIndex((row) => row.cartKey === item.cartKey);
    if (index >= 0) cart.splice(index, 1);
  } else {
    item.quantity = Math.min(99, item.quantity);
  }
  renderCart();
  renderProducts();
}

function removeCartItem(key) {
  const index = cart.findIndex(
    (item) => item.cartKey === String(key) || item.id === String(key),
  );
  if (index < 0) return;
  const removed = cart[index];
  cart.splice(index, 1);
  renderCart();
  renderProducts();
  showToast("تم حذف " + removed.name + " من السلة");
}

function removeProductFromCart(productId) {
  const product = products.find(
    (item) => String(item.id) === String(productId),
  );
  if (!product) return;

  for (let index = cart.length - 1; index >= 0; index -= 1) {
    if (String(cart[index].productId) === String(productId)) {
      cart.splice(index, 1);
    }
  }
  renderCart();
  renderProducts();
  showToast("تمت إزالة " + product.name + " من السلة");
}

function renderCart() {
  updateCartCount();
  const empty = cart.length === 0;
  cartEmpty.style.display = empty ? "block" : "none";
  cartContent.style.display = empty ? "none" : "block";
  if (empty) {
    cartItemsElement.innerHTML = "";
    cartTotalElement.textContent = formatPrice(0);
    return;
  }

  cartItemsElement.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
            <img class="cart-item-image" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}"
                 onerror="this.onerror=null;this.src='https://placehold.co/150x150/101827/72b4ff?text=DANZO'">
            <div class="cart-item-info">
                <div class="cart-item-heading">
                    <h6>${escapeHTML(item.name)}</h6>
                    <button type="button" class="remove-cart-item" data-remove-id="${escapeHTML(item.cartKey || item.id)}" aria-label="حذف ${escapeHTML(item.name)} من السلة"><i class="fa-solid fa-trash-can"></i></button>
                </div>
                <div class="cart-item-meta">
                    <span class="cart-item-unit-price">سعر الوحدة: ${formatPrice(item.price)}</span>
                    ${item.size || item.color ? `<span class="cart-item-variant"><i class="fa-solid fa-ruler"></i> ${escapeHTML(item.size || "مقاس واحد")}</span><span class="cart-item-variant"><i class="fa-solid fa-palette"></i> ${escapeHTML(item.color || "لون غير محدد")}</span>` : ""}
                </div>
                <div class="cart-item-footer">
                  <div class="cart-item-subtotal">
                    <small>إجمالي المنتج</small>
                    <strong class="cart-item-price">${formatPrice(item.price * item.quantity)}</strong>
                  </div>
                  <div class="quantity-control cart-item-quantity">
                    <button type="button" data-quantity-id="${escapeHTML(item.cartKey || item.id)}" data-change="-1" aria-label="تقليل كمية ${escapeHTML(item.name)}">
                      <i class="fa-solid fa-minus" aria-hidden="true"></i>
                    </button>
                    <span class="cart-item-quantity-value" aria-live="polite" aria-atomic="true">${item.quantity}</span>
                    <button type="button" data-quantity-id="${escapeHTML(item.cartKey || item.id)}" data-change="1" aria-label="زيادة كمية ${escapeHTML(item.name)}">
                      <i class="fa-solid fa-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
            </div>
        </article>`,
    )
    .join("");
  cartTotalElement.textContent = formatPrice(getCartTotal());
}

/* أحداث أزرار المنتج والمفضلة والسلة */
document.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-product-page]");
  if (pageButton && !pageButton.disabled) {
    currentProductPage = Number(pageButton.dataset.productPage);
    renderProducts();
    document
      .getElementById("products")
      .scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const viewButton = event.target.closest("[data-view-product]");
  if (viewButton) {
    openProductDetails(viewButton.dataset.viewProduct);
    return;
  }

  const addButton = event.target.closest("[data-add-cart]");
  if (addButton) {
    if (addButton.dataset.cartAction === "remove") {
      removeProductFromCart(addButton.dataset.addCart);
    } else {
      addToCart(addButton.dataset.addCart);
    }
    return;
  }

  const favoriteButton = event.target.closest("[data-favorite-id]");
  if (favoriteButton) {
    const id = favoriteButton.dataset.favoriteId;
    if (favorites.has(id)) {
      favorites.delete(id);
      showToast("تمت إزالة المنتج من المفضلة");
    } else {
      favorites.add(id);
      showToast("تمت إضافة المنتج للمفضلة");
    }
    renderProducts();
    renderFavorites();
    updateFavoriteButtons();
    return;
  }

  const removeFavorite = event.target.closest("[data-remove-favorite]");
  if (removeFavorite) {
    favorites.delete(removeFavorite.dataset.removeFavorite);
    renderFavorites();
    renderProducts();
    updateFavoriteButtons();
    showToast("تمت إزالة المنتج من المفضلة");
    return;
  }

  const quantityButton = event.target.closest("[data-quantity-id]");
  if (quantityButton) {
    changeQuantity(
      quantityButton.dataset.quantityId,
      Number(quantityButton.dataset.change),
    );
    return;
  }

  const removeButton = event.target.closest("[data-remove-id]");
  if (removeButton) removeCartItem(removeButton.dataset.removeId);
});

document.getElementById("cartBtn").addEventListener("click", () => {
  renderCart();
  cartModal.show();
});
document.getElementById("footerCartLink").addEventListener("click", (event) => {
  event.preventDefault();
  renderCart();
  cartModal.show();
});

/* التحقق من رقم واتساب */
function isValidStoreWhatsApp(number) {
  return /^20(10|11|12|15)\d{8}$/.test(number);
}
function normalizeEgyptianPhone(phone) {
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let number = String(phone).replace(/[٠-٩]/g, (digit) =>
    String(arabicDigits.indexOf(digit)),
  );
  number = number.replace(/[^\d]/g, "");
  if (number.startsWith("0020")) number = number.slice(2);
  if (number.startsWith("0")) number = "20" + number.slice(1);
  return number;
}

function setCheckoutFieldError(field, message) {
  const feedback = document.getElementById(`${field.id}Error`);
  field.classList.toggle("is-invalid", Boolean(message));
  if (message) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
  feedback.textContent = message;
}

function isCheckoutFieldValid(field) {
  const value = field.value.trim();
  if (!value) return false;
  if (field.id === "customerPhone") {
    return /^20(10|11|12|15)\d{8}$/.test(normalizeEgyptianPhone(value));
  }
  return true;
}

function showCheckoutError(message) {
  const error = document.getElementById("checkoutError");
  error.textContent = message;
  error.hidden = !message;
}

["customerName", "customerPhone", "customerAddress"].forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid") && isCheckoutFieldValid(field)) {
      setCheckoutFieldError(field, "");
    }
  });
});

/* إرسال الطلب */
document.getElementById("checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  showCheckoutError("");
  if (!cart.length) {
    showToast("سلة التسوق فارغة حالياً");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const customerPhoneField = document.getElementById("customerPhone");
  const customerPhoneRaw = customerPhoneField.value.trim();
  const customerAddress = document
    .getElementById("customerAddress")
    .value.trim();
  const customerNotes = document.getElementById("customerNotes").value.trim();

  const customerNameField = document.getElementById("customerName");
  const customerAddressField = document.getElementById("customerAddress");
  const fields = [
    {
      field: customerNameField,
      message: "من فضلك أدخل الاسم بالكامل.",
    },
    {
      field: customerPhoneField,
      message: customerPhoneRaw
        ? "أدخل رقم هاتف مصري صحيح مثل 01012345678."
        : "من فضلك أدخل رقم الهاتف.",
    },
    {
      field: customerAddressField,
      message: "من فضلك أدخل العنوان بالتفصيل.",
    },
  ];
  let firstInvalidField = null;
  fields.forEach(({ field, message }) => {
    const errorMessage = isCheckoutFieldValid(field) ? "" : message;
    setCheckoutFieldError(field, errorMessage);
    if (errorMessage && !firstInvalidField) firstInvalidField = field;
  });
  if (firstInvalidField) {
    firstInvalidField.focus();
    return;
  }

  const storeNumber = DANZO_WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!isValidStoreWhatsApp(storeNumber)) {
    showCheckoutError(
      "رقم واتساب المتجر غير مضبوط. يُرجى مراجعة إعدادات المتجر.",
    );
    return;
  }

  const orderNumber = "DZ-" + Date.now().toString().slice(-8);
  const productLines = cart.map((item, index) =>
    [
      `${index + 1}) ${item.name}`,
      `الكمية: ${item.quantity}`,
      `سعر الوحدة: ${formatPrice(item.price)}`,
      `إجمالي المنتج: ${formatPrice(item.price * item.quantity)}`,
    ].join("\n"),
  );

  const message = [
    "🛍️ *طلب جديد من DANZO*",
    "━━━━━━━━━━━━━━━━━━",
    `رقم الطلب: ${orderNumber}`,
    "",
    "*تفاصيل المنتجات:*",
    ...productLines,
    "",
    `*إجمالي الطلب: ${formatPrice(getCartTotal())}*`,
    "",
    "*بيانات العميل:*",
    `الاسم: ${customerName}`,
    `رقم الهاتف: ${customerPhoneRaw}`,
    `العنوان: ${customerAddress}`,
    ...(customerNotes ? [`ملاحظات: ${customerNotes}`] : []),
    "",
    "من فضلكم تأكيد توفر المنتجات وتفاصيل التوصيل.",
    "شكراً لاختياركم DANZO 💙",
  ].join("\n");

  const url =
    "https://wa.me/" + storeNumber + "?text=" + encodeURIComponent(message);
  const newWindow = window.open(url, "_blank");
  if (newWindow) newWindow.opener = null;
  else window.location.href = url;
});

/* Newsletter */
document
  .getElementById("newsletterForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    showToast(
      "شكراً لاهتمامك بـ DANZO! اربط النموذج بخدمة بريد لاستقبال الاشتراكات.",
    );
    event.target.reset();
  });

/* واتساب الفوتر */
function openStoreWhatsApp() {
  const number = DANZO_WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!isValidStoreWhatsApp(number)) {
    alert("من فضلك أضف رقم واتساب المتجر الصحيح داخل الكود.");
    return;
  }
  window.open(
    "https://wa.me/" +
      number +
      "?text=" +
      encodeURIComponent("مرحباً، أريد الاستفسار عن منتجات DANZO."),
    "_blank",
    "noopener,noreferrer",
  );
}
["footerWhatsapp", "footerWhatsappText"].forEach((id) => {
  const element = document.getElementById(id);
  element.addEventListener("click", (event) => {
    event.preventDefault();
    openStoreWhatsApp();
  });
});

/* إغلاق قائمة الموبايل بعد الضغط على رابط */
document.querySelectorAll(".navbar .nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (document.getElementById("favoritesPage").style.display !== "none") {
      showShop({ scrollToTop: false });
    }
    history.replaceState(null, "", link.hash);
    link.classList.add("active");
    requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
    const navbar = document.getElementById("mainNavbar");
    if (navbar.classList.contains("show"))
      bootstrap.Collapse.getOrCreateInstance(navbar).hide();
  });
});

function updateActiveNav() {
  if (document.getElementById("favoritesPage").style.display !== "none") {
    document.querySelectorAll(".navbar .nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    return;
  }

  const activationPoint =
    window.scrollY + document.querySelector(".navbar").offsetHeight + 40;
  let currentSection = shopSections[0];
  shopSections.forEach((id) => {
    const section = document.getElementById(id);
    if (section.offsetTop <= activationPoint) currentSection = id;
  });
  document.querySelectorAll(".navbar .nav-link").forEach((link) => {
    link.classList.toggle("active", link.hash === `#${currentSection}`);
  });
}
window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("resize", updateActiveNav);
document
  .getElementById("productsPerPage")
  .addEventListener("change", (event) => {
    productsPerPage = Number(event.target.value);
    currentProductPage = 1;
    renderProducts();
  });

/* تشغيل أولي */
renderCategories();
renderFilters();
renderProducts();
renderFavorites();
renderCart();
