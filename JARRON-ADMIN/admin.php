<!-- admin.php -->

<!doctype html>
<html lang="es" class="scroll-smooth">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JARRON - Panel de Administración</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/admin.css">
  <script src="https://unpkg.com/lucide@latest"></script>
</head>

<body class="font-sans antialiased bg-gray-900">
  <!-- Navegación Principal -->
  <nav class="fixed top-4 left-1/2 -translate-x-1/2 z-50">
    <div class="bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 
                px-10 py-3 flex items-center justify-center space-x-32 w-fit mx-auto">

      <!-- Logo y nombre -->
      <div class="flex items-center space-x-3">
        <div class="relative w-10 h-10">
          <img src="img/logo.png" alt="Logo" class="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer rounded-xl">
        </div>
        <h1 class="text-lg font-bold text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
          JARRON
        </h1>
      </div>

      <!-- Menú -->
      <div class="hidden md:flex items-center space-x-10">
        <a href="#inicio" class="text-gray-300 hover:text-[#F5F5DC] font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5DC]/20">
          Inicio
        </a>
        <a href="#preview" class="text-gray-300 hover:text-[#F5F5DC] font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-[#F5F5DC]/20">
          Agregar
        </a>

        <!-- Icono de cerrar sesión -->
        <button onclick="window.location.href='index.php'" class="text-gray-300 hover:text-red-500 transition-all duration-300 p-2 rounded-lg hover:bg-red-600/20">
          <i data-lucide="log-out" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Menú hamburguesa móvil -->
      <button class="md:hidden p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-300 text-gray-300 hover:scale-110 hover:text-purple-400" id="mobile-menu-button">
        <div class="w-5 h-5 flex flex-col justify-center space-y-1">
          <div class="hamburger-line w-full h-0.5 bg-current rounded-full"></div>
          <div class="hamburger-line w-full h-0.5 bg-current rounded-full"></div>
          <div class="hamburger-line w-full h-0.5 bg-current rounded-full"></div>
        </div>
      </button>
    </div>

    <!-- Menú móvil -->
    <div class="md:hidden hidden absolute top-full right-4 mt-2 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/30 w-48" id="mobile-menu">
      <div class="px-3 py-3 space-y-1">
        <a href="#inicio" class="nav-link block text-gray-300 hover:text-gray-100 font-medium py-2 px-3 rounded-lg hover:bg-gray-600/20 transition-all duration-300 text-sm">
          Inicio
        </a>
        <a href="#preview" class="nav-link block text-gray-300 hover:text-gray-100 font-medium py-2 px-3 rounded-lg hover:bg-gray-600/20 transition-all duration-300 text-sm">
          Agregar
        </a>

        <!-- Icono cerrar sesión móvil -->
        <button onclick="window.location.href='index.html'" class="flex items-center justify-center bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-500 py-2 px-3 rounded-lg transition-all duration-300 text-sm w-full">
          <i data-lucide="log-out" class="w-5 h-5"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section id="inicio" class="bg-black relative overflow-hidden flex flex-col justify-center text-center text-white py-8 min-h-[70vh]">
    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Badge superior -->
      <div class="inline-flex items-center px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-8 opacity-0 animate-fade-in-up delay-200">
        <span class="w-2 h-2 bg-white-400 rounded-full mr-2 animate-pulse"></span> Personaliza tu estilo con Jarrón
      </div>
      
      <!-- Título principal -->
      <h1 id="main-title" class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 leading-tight text-shadow-lg">
        <span>Panel de Administración</span>
      </h1>

      <!-- Subtítulo -->
      <p id="main-subtitle" class="text-sm sm:text-base md:text-lg mb-6 text-white/85 font-light leading-relaxed max-w-2xl mx-auto">
        Sección exclusiva para el administrador, donde puede gestionar y actualizar el contenido de la página web de forma fácil y segura.
      </p>
    </div>
  </section>

  <!-- Sección de Administración -->
  <section class="py-20 bg-black text-white">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-8">

      <!-- Vista Previa -->
      <div id="preview" class="flex justify-center items-start">
        <div class="group bg-gradient-to-b from-neutral-900 to-black rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10 max-w-[280px] mx-auto h-auto flex flex-col">
          <div class="relative h-64 overflow-hidden rounded-t-2xl">
            <img id="preview-img" class="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-700" src="img/clasico.png" alt="Camiseta Clásica">
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between bg-black">
            <div>
              <h3 id="preview-nombre" class="text-xl font-semibold text-white mb-1">Camiseta Clásica</h3>
              <div id="preview-precio" class="text-lg font-bold text-white-400 mb-3">$70.000 COP</div>
              <p id="preview-descripcion" class="text-gray-400 text-sm mb-5 leading-relaxed">
                Algodón 100% premium, corte clásico y cómodo. Perfecta para el uso diario con estilo.
              </p>
            </div>
            <a href="#" class="block w-full text-center bg-white text-black px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-95">
              Comprar Ahora
            </a>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <div class="bg-gradient-to-b from-neutral-900 to-black border border-white/10 rounded-2xl p-8 shadow-lg hover:shadow-white/10 transition-all duration-500">
        <h2 class="text-3xl font-bold mb-8 text-center tracking-wide">Agregar Nueva Camiseta</h2>

        <form id="formCamiseta" class="space-y-6">
          <!-- Categoría -->
          <div>
            <label for="categoria" class="block text-sm text-gray-300 mb-2 uppercase tracking-wide">Categoría</label>
            <select id="categoria" name="categoria" class="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white-400 focus:border-transparent transition-all duration-300">
              <option value="" disabled selected class="bg-black text-gray-400">Selecciona una categoría</option>
              <option value="Camiseta Clásica" class="bg-black text-white">Camiseta Clásica</option>
              <option value="Camiseta Tendencia" class="bg-black text-white">Camiseta Tendencia</option>
              <option value="Camiseta Anime" class="bg-black text-white">Camiseta Anime</option>
              <option value="Camiseta Urbano" class="bg-black text-white">Camiseta Urbano</option>
            </select>
          </div>

          <!-- Precio -->
          <div>
            <label for="precio" class="block text-sm text-gray-300 mb-2 uppercase tracking-wide">Precio</label>
            <input type="number" id="precio" name="precio" placeholder="Ej: 70000" class="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white-400 focus:border-transparent transition-all duration-300">
          </div>

          <!-- Imagen -->
         <!-- Imagen -->
<div>
  <label for="imagen" class="block text-sm text-gray-300 mb-2 uppercase tracking-wide">
    Foto de la camiseta
  </label>
  <div class="border border-dashed border-white/30 rounded-xl p-4 text-center hover:border-white-400 transition-all duration-300">
    <input type="file" id="imagen" name="imagen" accept="image/*" class="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white-500 file:text-black hover:file:bg-white-400 cursor-pointer transition-all duration-300">
  </div>
  
  <!-- Botones de Confirmar y Eliminar -->
  <div class="flex gap-3 mt-3">
    <button type="button" id="btnConfirmarImagen" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
      Confirmar Imagen
    </button>
    <button type="button" id="btnEliminarImagen" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
      Eliminar Imagen
    </button>
  </div>
  
  <p class="text-xs text-gray-500 mt-2">Formatos permitidos: JPG, PNG, WEBP</p>
</div>
          <!-- Descripción -->
          <div>
            <label for="descripcion" class="block text-sm text-gray-300 mb-2 uppercase tracking-wide">Descripción</label>
            <textarea id="descripcion" name="descripcion" rows="4" placeholder="Describe la camiseta..." class="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white-400 focus:border-transparent transition-all duration-300"></textarea>
          </div>

          <!-- Tallas -->
          <div>
            <h3 class="text-sm text-gray-300 mb-3 uppercase tracking-wide">Inventario por talla</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-400 text-xs mb-1">XS</label>
                <input type="number" id="talla_xs" name="talla_xs" min="0" class="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white-400 transition-all duration-300">
              </div>

              <div>
                <label class="block text-gray-400 text-xs mb-1">S</label>
                <input type="number" id="talla_s" name="talla_s" min="0" class="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white-400 transition-all duration-300">
              </div>

              <div>
                <label class="block text-gray-400 text-xs mb-1">M</label>
                <input type="number" id="talla_m" name="talla_m" min="0" class="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white-400 transition-all duration-300">
              </div>

              <div>
                <label class="block text-gray-400 text-xs mb-1">L</label>
                <input type="number" id="talla_l" name="talla_l" min="0" class="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white-400 transition-all duration-300">
              </div>

              <div>
                <label class="block text-gray-400 text-xs mb-1">XL</label>
                <input type="number" id="talla_xl" name="talla_xl" min="0" class="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white-400 transition-all duration-300">
              </div>
            </div>
          </div>

          <!-- Botón -->
          <button type="submit" class="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.03] active:scale-95">
            Guardar Camiseta
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Scripts -->
 <script src="https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.5.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.5.0/firebase-storage-compat.js"></script>

<script src="js/firebase.js?v=1.0.1"></script>
<script src="js/main.js?v=1.0.1"></script>
<script src="js/admin.js?v=1.0.1"></script>


  <script>
    // Inicializar iconos de Lucide
    lucide.createIcons();
  </script>
</body>

</html>