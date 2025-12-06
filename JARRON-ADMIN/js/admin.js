// ADMIN.JS - Funcionalidad del panel de administración

// ESPERAR A QUE EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', () => {
  
  console.log('DOM cargado - Iniciando admin.js');

  // ========================
  // Auth Guard
  // ========================
  firebase.auth().onAuthStateChanged(user => {
      if (!user) window.location.href = 'index.php';
  });

  // ========================
  // Logout
  // ========================
  const logoutButtons = document.querySelectorAll('button[onclick*="index.php"]');
  logoutButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
          await firebase.auth().signOut();
          window.location.href = 'index.php';
      });
  });

  // ========================
  // Formulario de Camisetas
  // ========================

  // Elementos del formulario
  const form = document.getElementById('formCamiseta');
  const categoria = document.getElementById('categoria');
  const precio = document.getElementById('precio');
  const descripcion = document.getElementById('descripcion');
  const imagen = document.getElementById('imagen');
  const talla_xs = document.getElementById('talla_xs');
  const talla_s = document.getElementById('talla_s');
  const talla_m = document.getElementById('talla_m');
  const talla_l = document.getElementById('talla_l');
  const talla_xl = document.getElementById('talla_xl');

  // Elementos de vista previa
  const previewNombre = document.getElementById('preview-nombre');
  const previewPrecio = document.getElementById('preview-precio');
  const previewDescripcion = document.getElementById('preview-descripcion');
  const previewImg = document.getElementById('preview-img');

  // Botones de imagen
  const btnConfirmarImagen = document.getElementById('btnConfirmarImagen');
  const btnEliminarImagen = document.getElementById('btnEliminarImagen');

  console.log('Botones encontrados:', { btnConfirmarImagen, btnEliminarImagen, imagen });

  let imagenSeleccionada = null;
  let imagenConfirmada = false;
  let rutaImagenGuardada = null;

  // Vista previa en tiempo real
  if (categoria) {
    categoria.addEventListener('change', () => {
      previewNombre.textContent = categoria.value || 'Camiseta Clásica';
    });
  }

  if (precio) {
    precio.addEventListener('input', () => {
      previewPrecio.textContent = precio.value
        ? `$${Number(precio.value).toLocaleString('es-CO')} COP`
        : '$70.000 COP';
    });
  }

  if (descripcion) {
    descripcion.addEventListener('input', () => {
      previewDescripcion.textContent = descripcion.value || 'Algodón 100% premium, corte clásico y cómodo. Perfecta para el uso diario con estilo.';
    });
  }

  // Habilitar botones cuando se selecciona una imagen
  if (imagen) {
    imagen.addEventListener('change', (e) => {
      console.log('Evento change disparado');
      const file = e.target.files[0];
      if (file) {
        console.log('Archivo seleccionado:', file.name);
        imagenSeleccionada = file;
        imagenConfirmada = false;
        rutaImagenGuardada = null;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImg.src = event.target.result;
        };
        reader.readAsDataURL(file);
        
        // Habilitar botones
        if (btnConfirmarImagen) {
          btnConfirmarImagen.disabled = false;
          btnConfirmarImagen.textContent = 'Confirmar Imagen';
          btnConfirmarImagen.classList.remove('bg-green-800');
          btnConfirmarImagen.classList.add('bg-green-600');
          console.log('Botón confirmar habilitado');
        }
        if (btnEliminarImagen) {
          btnEliminarImagen.disabled = false;
          console.log('Botón eliminar habilitado');
        }
      }
    });
  }

  // Botón Confirmar - Subir a servidor PHP
  if (btnConfirmarImagen) {
    btnConfirmarImagen.addEventListener('click', async () => {
      console.log('Click en confirmar');
      if (imagenSeleccionada && !imagenConfirmada) {
        try {
          btnConfirmarImagen.textContent = 'Subiendo...';
          btnConfirmarImagen.disabled = true;
          if (btnEliminarImagen) btnEliminarImagen.disabled = true;
          
          const formData = new FormData();
          formData.append('imagen', imagenSeleccionada);
          
          const response = await fetch('upload.php', {
            method: 'POST',
            body: formData
          });
          
          const result = await response.json();
          
          if (result.success) {
            rutaImagenGuardada = result.rutaImagen;
            imagenConfirmada = true;
            
            btnConfirmarImagen.textContent = '✓ Confirmada';
            btnConfirmarImagen.classList.remove('bg-green-600');
            btnConfirmarImagen.classList.add('bg-green-800');
            if (btnEliminarImagen) btnEliminarImagen.disabled = false;
            
            console.log('✅ Imagen confirmada:', imagenConfirmada);
            console.log('✅ Imagen guardada:', result.rutaImagen);
          } else {
            console.error('Error:', result.error);
            alert('❌ Error al subir imagen: ' + result.error);
            btnConfirmarImagen.textContent = 'Confirmar Imagen';
            btnConfirmarImagen.disabled = false;
            if (btnEliminarImagen) btnEliminarImagen.disabled = false;
          }
        } catch (error) {
          console.error('Error de conexión:', error);
          alert('❌ Error de conexión al subir la imagen');
          btnConfirmarImagen.textContent = 'Confirmar Imagen';
          btnConfirmarImagen.disabled = false;
          if (btnEliminarImagen) btnEliminarImagen.disabled = false;
        }
      }
    });
  }

  // Botón Eliminar
  if (btnEliminarImagen) {
    btnEliminarImagen.addEventListener('click', () => {
      console.log('Click en eliminar');
      if (imagen) imagen.value = '';
      imagenSeleccionada = null;
      imagenConfirmada = false;
      rutaImagenGuardada = null;
      
      if (previewImg) previewImg.src = 'img/clasico.png';
      
      if (btnConfirmarImagen) {
        btnConfirmarImagen.disabled = true;
        btnConfirmarImagen.textContent = 'Confirmar Imagen';
        btnConfirmarImagen.classList.remove('bg-green-800');
        btnConfirmarImagen.classList.add('bg-green-600');
      }
      btnEliminarImagen.disabled = true;
      
      console.log('🗑️ Imagen eliminada');
    });
  }

  // Limpiar formulario
  function limpiarFormulario() {
    if (form) form.reset();
    if (imagen) imagen.value = '';
    imagenSeleccionada = null;
    imagenConfirmada = false;
    rutaImagenGuardada = null;
    
    if (previewImg) previewImg.src = "img/clasico.png";
    if (previewNombre) previewNombre.textContent = "Camiseta Clásica";
    if (previewPrecio) previewPrecio.textContent = "$70.000 COP";
    if (previewDescripcion) previewDescripcion.textContent = "Algodón 100% premium, corte clásico y cómodo. Perfecta para el uso diario con estilo.";
    
    if (btnConfirmarImagen) {
      btnConfirmarImagen.disabled = true;
      btnConfirmarImagen.textContent = 'Confirmar Imagen';
      btnConfirmarImagen.classList.remove('bg-green-800');
      btnConfirmarImagen.classList.add('bg-green-600');
    }
    if (btnEliminarImagen) {
      btnEliminarImagen.disabled = true;
    }
  }

  // Submit del formulario
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      console.log('=== VALIDACIÓN DE FORMULARIO ===');
      console.log('imagenSeleccionada:', imagenSeleccionada);
      console.log('imagenConfirmada:', imagenConfirmada);
      console.log('rutaImagenGuardada:', rutaImagenGuardada);
      
      // Validar campos obligatorios
      if (!categoria.value || !precio.value || !descripcion.value) {
        alert("⚠️ Por favor completa todos los campos obligatorios");
        return;
      }

      // VALIDAR QUE LA IMAGEN ESTÉ CONFIRMADA SI SE SELECCIONÓ UNA
      if (imagenSeleccionada && !imagenConfirmada) {
        alert("⚠️ Debes confirmar la imagen antes de guardar. Presiona el botón 'Confirmar Imagen'");
        return;
      }

      // Si no hay imagen confirmada, usar la imagen por defecto
      const imagenFinal = rutaImagenGuardada || "img/clasico.png";

      const camiseta = {
        categoria: categoria.value,
        precio: Number(precio.value),
        descripcion: descripcion.value,
        imagen: imagenFinal,
        tallas: {
          XS: Number(talla_xs.value) || 0,
          S: Number(talla_s.value) || 0,
          M: Number(talla_m.value) || 0,
          L: Number(talla_l.value) || 0,
          XL: Number(talla_xl.value) || 0
        },
        fechaCreacion: firebase.firestore.FieldValue.serverTimestamp()
      };

      try {
        const submitBtn = form.querySelector('button[type="submit"]');
        const textoOriginal = submitBtn.textContent;
        submitBtn.textContent = "Guardando...";
        submitBtn.disabled = true;

        await firebase.firestore().collection("camisetas").add(camiseta);
        
        alert("✅ Camiseta guardada correctamente en Firebase");
        limpiarFormulario();
        
        submitBtn.textContent = textoOriginal;
        submitBtn.disabled = false;
      } catch (error) {
        console.error("Error completo:", error);
        alert("❌ Error al guardar: " + error.message);
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = "Guardar Camiseta";
        submitBtn.disabled = false;
      }
    });
  }

}); // FIN DOMContentLoaded