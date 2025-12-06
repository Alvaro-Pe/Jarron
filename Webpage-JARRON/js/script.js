
/* ---------- JS: menú móvil (compatible con tu HTML) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuButton || !mobileMenu) return; // nada que hacer si falta alguno

  let isMenuOpen = false;

  // Evitar que pulsar dentro del menú cierre inmediatamente (stopPropagation)
  mobileMenu.addEventListener('click', (e) => e.stopPropagation());

  // Toggle al pulsar el botón (evitar burbujeo para que el document click no lo cierre)
  mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Cerrar al pulsar fuera
  document.addEventListener('click', () => {
    if (isMenuOpen) closeMenu();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) closeMenu();
  });

  // También cerrar al hacer click en cualquier enlace dentro del menú (útil para anclas)
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      // si el enlace es ancla o navegación, cerramos el menú
      closeMenu();
    });
  });

  function openMenu() {
    mobileMenu.classList.remove('hidden', 'mobile-menu-exit');
    // forzar reflow para que la animación se aplique correctamente
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
    // Al terminar la animación ocultamos (timeout coincide con la duración del animation)
    setTimeout(() => {
      if (!isMenuOpen) {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('mobile-menu-exit');
      }
    }, 250);
  }

  function toggleMenu() {
    if (isMenuOpen) closeMenu();
    else openMenu();
  }
});

