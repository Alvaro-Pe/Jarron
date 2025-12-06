// main.js - Código compartido entre páginas

// ========================
// Inicializar Lucide
// ========================
lucide.createIcons();

// ========================
// Menú móvil
// ========================
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenuButton || !mobileMenu) return;
  let isMenuOpen = false;
  mobileMenu.addEventListener('click', e => e.stopPropagation());
  mobileMenuButton.addEventListener('click', e => {
      e.stopPropagation();
      toggleMenu();
  });
  document.addEventListener('click', () => {
      if (isMenuOpen) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
  });
  mobileMenu.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => closeMenu());
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
  function toggleMenu() {
      if (isMenuOpen) closeMenu();
      else openMenu();
  }
});