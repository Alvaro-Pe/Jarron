// ======== CARGAR CAMISETAS DESDE FIRESTORE ========
const grid = document.getElementById("servicesGrid");

// Esperamos que Firebase ya esté cargado por firebase.js
document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
    try {
        const snapshot = await db.collection("camisetas").get();

        grid.innerHTML = ""; // limpiar el grid

        snapshot.forEach(doc => {
            const item = doc.data();
            const id = doc.id;

            // 🔥 GUARDAR INVENTARIO EN VARIABLE GLOBAL (para catalog.js)
            if (typeof localInventory !== 'undefined') {
                localInventory[id] = item.tallas || {};
            }

            // Tallas disponibles > 0
            const tallasDisponibles = Object.entries(item.tallas || {})
                .filter(([talla, stock]) => stock > 0)
                .map(([t]) => t);

            // 🔥 VERIFICAR SI HAY STOCK DISPONIBLE
            const sinStock = tallasDisponibles.length === 0;

            // 🟢 CORREGIR RUTA DE IMAGEN AQUÍ
            let imagenCorregida = item.imagen;
            if (imagenCorregida && imagenCorregida.startsWith("img/")) {
                imagenCorregida = imagenCorregida.replace("img/", "../JARRON-ADMIN/img/");
            }

            // Crear tarjeta CON EL ESTILO EXACTO DEL HTML
            const card = document.createElement("div");
            card.className = "group bg-black rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10 max-w-[260px] mx-auto h-auto flex flex-col";
            card.dataset.name = item.categoria;
            card.dataset.category = item.categoria.toLowerCase();
            card.dataset.price = item.precio;
            card.dataset.id = id;

            card.innerHTML = `
                <div class="relative h-64 overflow-hidden rounded-t-2xl">
                    <img class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-700"
                         src="${imagenCorregida}" 
                         alt="${item.categoria}">
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between bg-black">
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-1">${item.categoria}</h3>
                        <div class="text-lg font-bold text-white mb-3">$${item.precio.toLocaleString()} COP</div>
                        <p class="text-gray-400 text-sm mb-5 leading-relaxed">
                            ${item.descripcion || 'Algodón 100% premium, corte clásico y cómodo. Perfecta para el uso diario con estilo.'}
                        </p>
                    </div>
                    ${sinStock 
                        ? `<button class="block w-full text-center bg-gray-600 text-gray-400 px-4 py-3 rounded-lg font-semibold cursor-not-allowed" disabled>
                               Sin stock disponible
                           </button>`
                        : `<a href="#" class="open-options block w-full text-center bg-white text-black px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-95">
                               Añadir al carrito →
                           </a>`
                    }
                </div>
            `;

            // Guardar tallas en dataset para el modal
            card.dataset.tallas = JSON.stringify(tallasDisponibles);

            grid.appendChild(card);
            document.dispatchEvent(new Event("cardsLoaded"));

        });

        // Recalcular filtros
        if (typeof applyFilters === "function") {
            applyFilters();
        }

        // Conectar botones al modal DESPUÉS de crear las tarjetas
        initOptionButtons();

    } catch (error) {
        console.error("Error cargando camisetas:", error);
    }
}

// ========= CONECTAR BOTONES PARA ABRIR EL MODAL =========
// ========= CONECTAR BOTONES PARA ABRIR EL MODAL =========
function initOptionButtons() {
    document.querySelectorAll(".open-options").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault(); // 👈 ESTO PREVIENE EL SCROLL
            
            const card = button.closest("[data-name]");

            selectedProduct = card;

            // Cargar tallas desde dataset
            const tallas = JSON.parse(card.dataset.tallas || "[]");

            // 🔥 SI NO HAY TALLAS, NO ABRIR EL MODAL
            if (tallas.length === 0) {
                if (typeof showNotification === 'function') {
                    showNotification("⚠️ Este producto no tiene stock disponible", "warning");
                } else {
                    alert("Este producto no tiene stock disponible");
                }
                return;
            }

            productSize.innerHTML = "";
            
            // 🔥 CARGAR TALLAS CON INFORMACIÓN DE STOCK
            const productId = card.dataset.id;
            const productStock = typeof localInventory !== 'undefined' ? localInventory[productId] : null;
            
            if (productStock) {
                // Mostrar tallas con stock disponible
                tallas.forEach(t => {
                    const stock = productStock[t] || 0;
                    const opt = document.createElement("option");
                    opt.value = t;
                    
                    if (stock <= 3) {
                        opt.textContent = `${t} - Solo ${stock} disponibles`;
                        opt.style.color = "#f59e0b";
                    } else {
                        opt.textContent = `${t} - ${stock} disponibles`;
                    }
                    
                    productSize.appendChild(opt);
                });
            } else {
                // Fallback sin información de stock
                tallas.forEach(t => {
                    const opt = document.createElement("option");
                    opt.value = t;
                    opt.textContent = t;
                    productSize.appendChild(opt);
                });
            }

            // Abrir modal
            optionsModal.classList.remove("hidden");
        });
    });
}