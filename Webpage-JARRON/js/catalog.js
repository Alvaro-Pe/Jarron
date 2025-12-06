/* ----------  menú móvil ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuButton || !mobileMenu) return;

  let isMenuOpen = false;
  mobileMenu.addEventListener('click', (e) => e.stopPropagation());

  mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', () => { if (isMenuOpen) closeMenu(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) closeMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { closeMenu(); });
  });

  function openMenu() {
    mobileMenu.classList.remove('hidden', 'mobile-menu-exit');
    void mobileMenu.offsetWidth;
    mobileMenu.classList.add('mobile-menu-enter');
    mobileMenuButton.classList.add('hamburger-active');
    isMenuOpen = true;
  }

  function closeMenu() {
    mobileMenu.classList.remove('mobile-menu-enter');
    mobileMenu.classList.add('mobile-menu-exit');
    mobileMenuButton.classList.remove('hamburger-active');
    isMenuOpen = false;
    setTimeout(() => {
      if (!isMenuOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('mobile-menu-exit');
      }
    }, 250);
  }

  function toggleMenu() { isMenuOpen ? closeMenu() : openMenu(); }
});



/* --------- SISTEMA DE FILTROS --------- */

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const sortFilter = document.getElementById("sortFilter");
    const grid = document.getElementById("servicesGrid");

    if (!grid) return;

    // Guardaremos los productos originales UNA SOLA VEZ
    let originalCards = [];

    function getCards() {
      return Array.from(grid.querySelectorAll(':scope > div[data-name]'));
    }

    function getPriceNumber(card) {
      const dp = card.dataset.price;
      if (dp) return Number(dp);

      const el = card.querySelector(".text-green-400, .text-lg.font-bold");
      return el ? Number(el.textContent.replace(/\D/g, "")) : 0;
    }

    // Detecta cuando Firebase o tu backend agregue productos
    const observer = new MutationObserver(() => {
      if (originalCards.length === 0) {
        originalCards = getCards(); // 🟣 Se guarda lista inicial completa
        
        // ⭐ DESPUÉS de guardar las cards, verificar si hay categoría en URL
        const params = new URLSearchParams(window.location.search);
        const categoriaURL = params.get("category");
        
        if (categoriaURL && categoryFilter) {
          const categoriaNormalizada = categoriaURL.trim().toLowerCase();
          
          // Buscar la opción que coincida
          const options = Array.from(categoryFilter.options);
          const matchingOption = options.find(opt => 
            opt.value.toLowerCase() === categoriaNormalizada
          );
          
          if (matchingOption) {
            categoryFilter.value = matchingOption.value;
            // Aplicar filtros automáticamente
            setTimeout(() => applyFilters(), 50);
          }
        }
      }
    });
    observer.observe(grid, { childList: true });

     
    /* ------------- APLICAR FILTROS ------------- */
    function applyFilters() {

      // Si es primera vez, guardamos productos del DOM
      const cards = originalCards.length ? originalCards : getCards();

      const searchText = (searchInput?.value || "").trim().toLowerCase();
      const category = (categoryFilter?.value || "").trim().toLowerCase();
      const priceRange = (priceFilter?.value || "").trim();
      const sort = (sortFilter?.value || "").trim();

      let filtered = cards.filter((card) => {
        const name = (card.dataset.name || "").toLowerCase();
        const cat = (card.dataset.category || "").toLowerCase();
        const price = getPriceNumber(card);

        const matchesName = !searchText || name.includes(searchText);
        const matchesCategory = category === "" || cat === category;

        let matchesPrice = true;
        if (priceRange === "lt50000") matchesPrice = price < 50000;
        else if (priceRange === "50-100") matchesPrice = price >= 50000 && price <= 100000;
        else if (priceRange === "gt100000") matchesPrice = price > 100000;

        return matchesName && matchesCategory && matchesPrice;
      });

      // ORDENAMIENTO
      if (sort === "az") filtered.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
      if (sort === "za") filtered.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
      if (sort === "price-asc") filtered.sort((a, b) => getPriceNumber(a) - getPriceNumber(b));
      if (sort === "price-desc") filtered.sort((a, b) => getPriceNumber(b) - getPriceNumber(a));

      // RECONSTRUIR GRID SIN PERDER NINGÚN PRODUCTO
      grid.innerHTML = "";
      filtered.length === 0
        ? grid.innerHTML = "<div class='col-span-full text-center text-white/60 py-8'>No se encontraron productos.</div>"
        : filtered.forEach(card => grid.appendChild(card));
    }


    [searchInput, categoryFilter, priceFilter, sortFilter].forEach(el => {
      if (!el) return;
      el.addEventListener(el.tagName.toLowerCase() === "input" ? "input" : "change", applyFilters);
    });

    window.applyFilters = applyFilters;
  });
})();





// ===== CARRITO DE COMPRAS CON CONTROL DE INVENTARIO =====

let cart = [];
let selectedProduct = null;

// 🔥 INVENTARIO LOCAL (se sincroniza con Firebase)
let localInventory = {};

const cartButton = document.getElementById("cart-button");
const cartPanel = document.getElementById("cart-panel");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const optionsModal = document.getElementById("options-modal");
const productColor = document.getElementById("product-color");
const productSize = document.getElementById("product-size");
const cancelOptions = document.getElementById("cancel-options");
const confirmOptions = document.getElementById("confirm-options");

cartButton.addEventListener("click", () => cartPanel.classList.toggle("hidden"));
cancelOptions.addEventListener("click", () => { 
  optionsModal.classList.add("hidden"); 
  selectedProduct = null; 
});

// 🔥 ACTUALIZAR OPCIONES DE TALLA CON STOCK
function updateSizeOptions() {
  if (!selectedProduct) return;
  
  const productId = selectedProduct.dataset.id;
  const productStock = localInventory[productId];
  
  productSize.innerHTML = "";
  
  if (!productStock) {
    // Si no hay inventario local, usar las tallas del dataset
    const tallasDisponibles = JSON.parse(selectedProduct.dataset.tallas || "[]");
    tallasDisponibles.forEach(size => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      productSize.appendChild(option);
    });
    return;
  }
  
  // Mostrar tallas con información de stock
  Object.entries(productStock).forEach(([size, stock]) => {
    const option = document.createElement("option");
    option.value = size;
    
    // Contar cuántos de esta talla ya están en el carrito
    const inCart = cart.filter(item => 
      item.productId === productId && item.size === size
    ).length;
    
    const availableStock = stock - inCart;
    
    if (availableStock === 0) {
      option.textContent = `${size} - AGOTADA`;
      option.disabled = true;
      option.style.color = "#ef4444";
    } else if (availableStock <= 3) {
      option.textContent = `${size} - Solo ${availableStock} disponibles`;
      option.style.color = "#f59e0b";
    } else {
      option.textContent = `${size} - ${availableStock} disponibles`;
    }
    
    productSize.appendChild(option);
  });
}

// 🔥 VALIDAR Y AGREGAR AL CARRITO
confirmOptions.addEventListener("click", async () => {
  if (!selectedProduct) return;

  const productId = selectedProduct.dataset.id;
  const name = selectedProduct.dataset.name;
  const price = parseInt(selectedProduct.dataset.price);
  const category = selectedProduct.dataset.category;
  const color = productColor.value;
  const size = productSize.value;
  
  // 🔥 VALIDAR STOCK DISPONIBLE
  const productStock = localInventory[productId];
  
  if (productStock && productStock[size] !== undefined) {
    const currentStock = productStock[size];
    
    // Contar cuántos de esta talla ya hay en el carrito
    const inCart = cart.filter(item => 
      item.productId === productId && item.size === size
    ).length;
    
    const availableStock = currentStock - inCart;
    
    if (availableStock === 0) {
      showNotification("❌ Esta talla está agotada", "error");
      return;
    }
    
    if (availableStock < 0) {
      showNotification(`⚠️ No hay más stock disponible de talla ${size}`, "warning");
      return;
    }
  }

  // Agregar al carrito
  const imagen = selectedProduct.querySelector("img").src;
  
  cart.push({
    productId,
    name,
    price,
    category,
    color,
    size,
    imagen,
    quantity: 1
  });

  updateCartUI();
  cartButton.classList.add("scale-125");
  setTimeout(() => cartButton.classList.remove("scale-125"), 200);
  optionsModal.classList.add("hidden");
  
  showNotification("✅ Producto agregado al carrito", "success");
  
  // Actualizar las opciones de talla para reflejar el nuevo stock
  updateSizeOptions();
});

// 🔥 AUMENTAR CANTIDAD
window.increaseQuantity = async function(productId, size, color) {
  // Verificar stock disponible
  const productStock = localInventory[productId];
  
  if (productStock && productStock[size] !== undefined) {
    const currentStock = productStock[size];
    const inCart = cart.filter(item => 
      item.productId === productId && item.size === size
    ).length;
    
    if (inCart >= currentStock) {
      showNotification(`⚠️ No hay más stock disponible de talla ${size}`, "warning");
      return;
    }
  }
  
  // Buscar el primer item que coincida para copiar sus datos
  const existingItem = cart.find(item => 
    item.productId === productId && 
    item.size === size && 
    item.color === color
  );
  
  if (existingItem) {
    cart.push({ ...existingItem });
    updateCartUI();
    showNotification("✅ Cantidad aumentada", "success");
  }
};

// 🔥 DISMINUIR CANTIDAD
window.decreaseQuantity = function(productId, size, color) {
  const index = cart.findIndex(item => 
    item.productId === productId && 
    item.size === size && 
    item.color === color
  );
  
  if (index !== -1) {
    cart.splice(index, 1);
    updateCartUI();
    showNotification("➖ Cantidad disminuida", "info");
  }
};

// 🔥 ELIMINAR TODOS LOS ITEMS IGUALES
window.removeAllOfItem = function(productId, size, color) {
  const initialLength = cart.length;
  
  cart = cart.filter(item => 
    !(item.productId === productId && 
      item.size === size && 
      item.color === color)
  );
  
  const removed = initialLength - cart.length;
  
  updateCartUI();
  showNotification(`🗑️ ${removed} producto(s) eliminado(s)`, "info");
  
  // Si el modal está abierto, actualizar las opciones
  if (selectedProduct && !optionsModal.classList.contains("hidden")) {
    updateSizeOptions();
  }
};

// 🔥 ELIMINAR DEL CARRITO (mantener para compatibilidad)
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCartUI();
  showNotification("🗑️ Producto eliminado del carrito", "info");
  
  // Si el modal está abierto, actualizar las opciones
  if (selectedProduct && !optionsModal.classList.contains("hidden")) {
    updateSizeOptions();
  }
};

// 🔥 MOSTRAR NOTIFICACIONES
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `fixed top-24 right-4 z-[200] px-6 py-3 rounded-lg shadow-lg text-white font-medium animate-slide-in-right`;
  
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-600",
    info: "bg-blue-600"
  };
  
  notification.classList.add(colors[type] || colors.info);
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = "slide-out-right 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function updateCartUI() {
  cartCount.textContent = cart.length;
  cartItems.innerHTML = "";

  // Agrupar productos iguales (mismo ID, talla y color)
  const groupedCart = {};
  
  cart.forEach((item, originalIndex) => {
    const key = `${item.productId}-${item.size}-${item.color}`;
    if (!groupedCart[key]) {
      groupedCart[key] = {
        ...item,
        quantity: 0,
        indices: []
      };
    }
    groupedCart[key].quantity++;
    groupedCart[key].indices.push(originalIndex);
  });

  // Mostrar productos agrupados
  Object.values(groupedCart).forEach((item) => {
    const li = document.createElement("li");
    li.className = "bg-white/10 p-3 rounded-lg text-sm";
    li.innerHTML = `
      <div class="flex gap-3 items-start">
        <!-- Imagen pequeña del producto -->
        <img src="${item.imagen}" alt="${item.name}" 
             class="w-16 h-16 object-cover rounded-md flex-shrink-0">
        
        <!-- Información del producto -->
        <div class="flex-1 min-w-0">
          <div class="font-medium text-white truncate">${item.name}</div>
          <div class="text-xs text-gray-300 mb-1">${item.size} | ${item.color}</div>
          <div class="text-white font-semibold">${item.price.toLocaleString()}</div>
          
          <!-- Controles de cantidad -->
          <div class="flex items-center gap-2 mt-2">
            <button onclick="decreaseQuantity('${item.productId}', '${item.size}', '${item.color}')" 
                    class="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-white transition">
              −
            </button>
            <span class="text-white font-medium min-w-[20px] text-center">${item.quantity}</span>
            <button onclick="increaseQuantity('${item.productId}', '${item.size}', '${item.color}')" 
                    class="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-white transition">
              +
            </button>
            <button onclick="removeAllOfItem('${item.productId}', '${item.size}', '${item.color}')" 
                    class="ml-auto text-red-400 hover:text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    cartItems.appendChild(li);
  });

  // Calcular total
  const total = cart.reduce((s, i) => s + i.price, 0);
  cartTotal.textContent = "$" + total.toLocaleString();
}

// 🔥 FINALIZAR COMPRA - REDIRIGIR A CHECKOUT
async function finalizarCompra() {
  if (cart.length === 0) {
    showNotification("⚠️ Tu carrito está vacío", "warning");
    return;
  }
  
  try {
    // Guardar carrito en localStorage
    localStorage.setItem('jarron_cart', JSON.stringify(cart));
    
    // Redirigir a página de checkout
    window.location.href = "checkout.html";
    
  } catch (error) {
    console.error("Error al procesar el carrito:", error);
    showNotification("❌ Error al procesar el carrito", "error");
  }
}

// Conectar botón de pago con la función
document.addEventListener("DOMContentLoaded", () => {
  const payButton = document.querySelector('#cart-panel a[href*="wa.me"]');
  if (payButton) {
    payButton.addEventListener("click", (e) => {
      e.preventDefault();
      finalizarCompra();
    });
  }
});

// CSS para animaciones
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slide-out-right {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}