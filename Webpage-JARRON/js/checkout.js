// ========== CARGAR CARRITO DESDE LOCALSTORAGE ==========
let cart = [];
const COSTO_ENVIO = 10000; // $10.000 COP

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    renderOrderSummary();
    setupFormHandlers();
});

// Cargar carrito del localStorage
function loadCart() {
    const cartData = localStorage.getItem('jarron_cart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }

    // Si el carrito está vacío, redirigir al catálogo
    if (cart.length === 0) {
        alert("Tu carrito está vacío");
        window.location.href = "catalogo.html";
    }
}

// Renderizar resumen del pedido
function renderOrderSummary() {
    const summaryContainer = document.getElementById("order-summary");
    const subtotalElement = document.getElementById("subtotal");
    const envioElement = document.getElementById("envio");
    const totalElement = document.getElementById("total");

    // Agrupar productos idénticos
    const groupedCart = {};
    
    cart.forEach(item => {
        const key = `${item.productId}-${item.size}-${item.color}`;
        if (!groupedCart[key]) {
            groupedCart[key] = { ...item, quantity: 0 };
        }
        groupedCart[key].quantity++;
    });

    // Renderizar productos
    summaryContainer.innerHTML = "";
    Object.values(groupedCart).forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "flex gap-3 pb-4 border-b border-gray-800";
        itemDiv.innerHTML = `
            <img src="${item.imagen}" alt="${item.name}" 
                 class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
                <h3 class="font-semibold text-white">${item.name}</h3>
                <p class="text-sm text-gray-400">${item.size} | ${item.color}</p>
                <p class="text-sm text-gray-400">Cantidad: ${item.quantity}</p>
                <p class="font-bold text-white">$${(item.price * item.quantity).toLocaleString()}</p>
            </div>
        `;
        summaryContainer.appendChild(itemDiv);
    });

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tipoEntrega = document.getElementById("tipo-entrega").value;
    const envio = tipoEntrega === "domicilio" ? COSTO_ENVIO : 0;
    const total = subtotal + envio;

    subtotalElement.textContent = "$" + subtotal.toLocaleString();
    envioElement.textContent = envio > 0 ? "$" + envio.toLocaleString() : "Gratis";
    totalElement.textContent = "$" + total.toLocaleString();
}

// Configurar manejadores del formulario
function setupFormHandlers() {
    const tipoEntrega = document.getElementById("tipo-entrega");
    const direccionContainer = document.getElementById("direccion-container");
    const form = document.getElementById("checkout-form");
    const cardForm = document.getElementById("card-form");
    const radioTarjeta = document.getElementById("radio-tarjeta");

    // Mostrar/ocultar campos de dirección
    tipoEntrega.addEventListener("change", () => {
        if (tipoEntrega.value === "punto") {
            direccionContainer.style.display = "none";
            document.getElementById("direccion").required = false;
            document.getElementById("ciudad").required = false;
        } else {
            direccionContainer.style.display = "block";
            document.getElementById("direccion").required = true;
            document.getElementById("ciudad").required = true;
        }
        renderOrderSummary(); // Actualizar costos de envío
    });

    // Mostrar/ocultar formulario de tarjeta
    document.querySelectorAll('input[name="metodo-pago"]').forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "tarjeta") {
                cardForm.classList.remove("hidden");
                // Hacer campos de tarjeta requeridos
                document.getElementById("card-number").required = true;
                document.getElementById("card-name").required = true;
                document.getElementById("card-expiry").required = true;
                document.getElementById("card-cvv").required = true;
            } else {
                cardForm.classList.add("hidden");
                // Quitar requerimiento de campos de tarjeta
                document.getElementById("card-number").required = false;
                document.getElementById("card-name").required = false;
                document.getElementById("card-expiry").required = false;
                document.getElementById("card-cvv").required = false;
            }
        });
    });

    // Formateo automático de campos de tarjeta
    setupCardFormatting();

    // Manejar envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // Validar tarjeta si se seleccionó ese método
        if (document.querySelector('input[name="metodo-pago"]:checked').value === "tarjeta") {
            if (!validarTarjeta()) {
                return;
            }
        }
        
        await procesarPedido();
    });
}

// Formateo y validación de campos de tarjeta
function setupCardFormatting() {
    const cardNumber = document.getElementById("card-number");
    const cardExpiry = document.getElementById("card-expiry");
    const cardCvv = document.getElementById("card-cvv");
    const cardName = document.getElementById("card-name");
    const cardBrand = document.getElementById("card-brand");

    // Formatear número de tarjeta
    cardNumber.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\s/g, "");
        let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
        e.target.value = formattedValue;

        // Detectar tipo de tarjeta
        detectarMarcaTarjeta(value, cardBrand);
    });

    // Solo números en tarjeta
    cardNumber.addEventListener("keypress", (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
        }
    });

    // Formatear fecha de expiración
    cardExpiry.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length >= 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4);
        }
        e.target.value = value;
    });

    // Solo números en CVV
    cardCvv.addEventListener("keypress", (e) => {
        if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
            e.preventDefault();
        }
    });

    // Convertir nombre a mayúsculas
    cardName.addEventListener("input", (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
}

// Detectar marca de tarjeta
function detectarMarcaTarjeta(number, brandElement) {
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/
    };

    let brand = null;
    for (const [key, pattern] of Object.entries(patterns)) {
        if (pattern.test(number)) {
            brand = key;
            break;
        }
    }

    // Actualizar icono
    if (brand === "visa") {
        brandElement.innerHTML = '<svg class="w-10 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#1434CB"/><text x="24" y="20" fill="white" font-size="12" font-weight="bold" text-anchor="middle">VISA</text></svg>';
    } else if (brand === "mastercard") {
        brandElement.innerHTML = '<svg class="w-10 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#EB001B"/><circle cx="18" cy="16" r="10" fill="#FF5F00"/><circle cx="30" cy="16" r="10" fill="#F79E1B"/></svg>';
    } else if (brand === "amex") {
        brandElement.innerHTML = '<svg class="w-10 h-6" viewBox="0 0 48 32"><rect width="48" height="32" rx="4" fill="#006FCF"/><text x="24" y="20" fill="white" font-size="10" font-weight="bold" text-anchor="middle">AMEX</text></svg>';
    } else {
        brandElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>';
    }
}

// Validar datos de tarjeta
function validarTarjeta() {
    const cardNumber = document.getElementById("card-number").value.replace(/\s/g, "");
    const cardExpiry = document.getElementById("card-expiry").value;
    const cardCvv = document.getElementById("card-cvv").value;
    const cardName = document.getElementById("card-name").value;

    // Validar que todos los campos estén llenos
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        mostrarError("Por favor completa todos los campos de la tarjeta");
        return false;
    }

    // Validar longitud del número de tarjeta
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        mostrarError("Número de tarjeta inválido");
        return false;
    }

    // Validar algoritmo de Luhn
    if (!validarLuhn(cardNumber)) {
        mostrarError("Número de tarjeta inválido");
        return false;
    }

    // Validar fecha de expiración
    const [month, year] = cardExpiry.split("/");
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (parseInt(month) < 1 || parseInt(month) > 12) {
        mostrarError("Mes de expiración inválido");
        return false;
    }

    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        mostrarError("La tarjeta está vencida");
        return false;
    }

    // Validar CVV
    if (cardCvv.length < 3 || cardCvv.length > 4) {
        mostrarError("CVV inválido");
        return false;
    }

    return true;
}

// Algoritmo de Luhn para validar número de tarjeta
function validarLuhn(number) {
    let sum = 0;
    let isEven = false;

    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

// Mostrar error
function mostrarError(mensaje) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "fixed top-24 right-4 z-[200] px-6 py-3 rounded-lg shadow-lg text-white font-medium bg-red-600 animate-slide-in";
    errorDiv.textContent = "❌ " + mensaje;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = "slide-out 0.3s ease-out";
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Procesar pedido
async function procesarPedido() {
    const form = document.getElementById("checkout-form");
    const button = form.querySelector('button[type="submit"]');

    // Simulación de pago
    button.disabled = true;
    button.innerHTML = `
        <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Procesando...
    `;

    // Solo simulación (1.5 seg)
    setTimeout(() => {
        mostrarConfirmacion("SIMULADO-123456");

        // limpiar carrito como si todo hubiera funcionado
        localStorage.removeItem('jarron_cart');
        cart = [];

    }, 1500);
}


// Actualizar stock en Firebase
async function actualizarStock() {
    // Agrupar productos por ID y talla
    const updates = {};
    
    cart.forEach(item => {
        const key = `${item.productId}-${item.size}`;
        if (!updates[key]) {
            updates[key] = {
                productId: item.productId,
                size: item.size,
                quantity: 0
            };
        }
        updates[key].quantity++;
    });

    // Actualizar stock en batch
    const batch = db.batch();
    
    for (const update of Object.values(updates)) {
        const docRef = db.collection("camisetas").doc(update.productId);
        const doc = await docRef.get();
        
        if (doc.exists) {
            const currentStock = doc.data().tallas[update.size] || 0;
            const newStock = Math.max(0, currentStock - update.quantity);
            
            batch.update(docRef, {
                [`tallas.${update.size}`]: newStock
            });
        }
    }
    
    await batch.commit();
}

// Mostrar modal de confirmación
function mostrarConfirmacion(orderId) {
    const modal = document.getElementById("confirmation-modal");
    const orderNumber = document.getElementById("order-number");
    
    // Generar número de orden corto
    const shortOrderId = orderId.substring(0, 8).toUpperCase();
    orderNumber.textContent = `#${shortOrderId}`;
    
    modal.classList.remove("hidden");
    
    // Confetti effect (opcional)
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

// Detectar marca de tarjeta (función auxiliar)
function detectarMarca(number) {
    if (/^4/.test(number)) return "Visa";
    if (/^5[1-5]/.test(number)) return "Mastercard";
    if (/^3[47]/.test(number)) return "American Express";
    if (/^6(?:011|5)/.test(number)) return "Discover";
    return "Desconocida";
}

// Animación de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});