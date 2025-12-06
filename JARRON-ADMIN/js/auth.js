// ======================
//  LOGIN FIREBASE v8
// ======================

// Inputs y formulario
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// ----- LOGIN -----
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        mostrarNotificacion("Por favor completa todos los campos.", "error");
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            mostrarNotificacion("Bienvenido.", "success");

            setTimeout(() => {
                window.location.href = "admin.php";
            }, 800);
        })
        .catch((error) => {
            let mensaje = "";

            switch (error.code) {
                case "auth/wrong-password":
                    mensaje = "La contraseña es incorrecta.";
                    break;
                case "auth/user-not-found":
                    mensaje = "No existe una cuenta con este correo.";
                    break;
                case "auth/invalid-email":
                    mensaje = "Correo inválido.";
                    break;
                default:
                    mensaje = "Error al iniciar sesión.";
            }

            mostrarNotificacion(mensaje, "error");
        });
});


// ----- MOSTRAR / OCULTAR PASSWORD -----
// ----- MOSTRAR / OCULTAR PASSWORD -----
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
    passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
});



// ======================
//  NOTIFICACIONES
// ======================
function mostrarNotificacion(mensaje, tipo) {
    const notification = document.createElement("div");
    const color = tipo === "success" ? "bg-green-500" : "bg-red-500";

    notification.className = `
        fixed top-4 right-4 ${color} text-white px-6 py-3 
        rounded-lg shadow-lg z-50 transform translate-x-full 
        transition-transform duration-300
    `;
    notification.textContent = mensaje;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove("translate-x-full"), 50);

    setTimeout(() => {
        notification.classList.add("translate-x-full");
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}
