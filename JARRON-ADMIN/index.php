<!doctype html>
<html lang="es" class="scroll-smooth">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JARRON</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>

<body
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans">

    <!-- Login -->
    <div
        class="bg-black/80 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl p-10 w-full max-w-sm flex flex-col items-center space-y-6">
        <img src="img/logo.png" alt="Logo" class="w-28 h-auto object-contain">

        <!-- Título -->
        <h2 class="text-2xl font-bold tracking-wide text-center">Acceso Administrador</h2>


<!-- Formulario -->
<form id="loginForm" class="w-full space-y-5">
    <!-- Correo -->
    <div>
        <input 
            type="email" 
            id="email"
            placeholder="Correo electrónico"
            class="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white-400 focus:border-transparent transition-all duration-300">
    </div>

    <!-- Contraseña -->
    <div class="relative">
        <input 
            type="password" 
            id="password"
            placeholder="Contraseña"
            class="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white-400 focus:border-transparent transition-all duration-300">

        <button 
            type="button" 
            id="togglePassword"
            class="absolute right-3 top-3 text-gray-400 hover:text-white transition duration-200">
            👁️
        </button>
    </div>

    <!-- Olvido contraseña -->
    <div class="text-center">
        <a href="#" class="text-sm text-gray-400 hover:text-white-400 transition duration-300">
            ¿Olvidaste tu contraseña?
        </a>
    </div>

    <!-- Botón (importante: debe ser type="submit") -->
    <button 
        type="submit"
        class="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.03] active:scale-95">
        Iniciar Sesión
    </button>
</form>


        <!-- Versión -->
        <p class="text-xs text-gray-500 mt-4">Versión 1.0.0</p>
    </div>
<script src="https://www.gstatic.com/firebasejs/12.5.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/12.5.0/firebase-auth-compat.js"></script>

<script src="js/firebase.js?v=1.0.1"></script>
<script src="js/auth.js?v=1.0.1"></script>
<script src="js/script.js?v=1.0.1"></script>

</body>

</html>