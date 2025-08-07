// Script para la funcionalidad de la galería de fotografía
// Este archivo se carga en la página de fotografía

// Datos de las fotografías (se pasan desde el servidor)
let photographyData = [];
let currentPhotoIndex = 0;

// Inicializar la galería
function initPhotographyGallery(data) {
  // Parsear los datos si vienen como string JSON
  if (typeof data === "string") {
    try {
      photographyData = JSON.parse(data);
    } catch (error) {
      console.error("Error al parsear datos de fotografía:", error);
      photographyData = [];
    }
  } else {
    photographyData = data || [];
  }

  // Si no hay datos, intentar obtenerlos de la variable global
  if (photographyData.length === 0 && window.photographyData) {
    photographyData = window.photographyData.photographyData || [];
  }

  // Esperar a que el DOM esté completamente cargado
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(setupGallery, 100); // Pequeño delay para asegurar que todo esté renderizado
    });
  } else {
    setTimeout(setupGallery, 100); // Pequeño delay para asegurar que todo esté renderizado
  }
}

function setupGallery() {
  // Filtros de galería
  const filterButtons = document.querySelectorAll(".filter-btn");
  const photoCards = document.querySelectorAll(".photo-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      // Actualizar botones activos
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filtrar fotos
      photoCards.forEach((card) => {
        const tags = card.getAttribute("data-tags");
        if (filter === "all" || tags.includes(filter)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Modal de vista detallada
  const photoModal = document.getElementById("photo-modal");
  const largeImageModal = document.getElementById("large-image-modal");
  const closeModal = document.getElementById("close-modal");
  const closeLargeModal = document.getElementById("close-large-modal");
  const viewLargeBtn = document.getElementById("view-large");
  const navPrev = document.getElementById("nav-prev");
  const navNext = document.getElementById("nav-next");
  const toggleInfo = document.getElementById("toggle-info");
  const closeInfo = document.getElementById("close-info");

  // Función para mostrar imagen en pantalla completa
  function showImageInFullscreen(photoId) {
    const photo = photographyData.find((p) => p.id == photoId);
    if (!photo) return;

    // Encontrar el índice de la foto actual
    currentPhotoIndex = photographyData.findIndex((p) => p.id == photoId);
    if (currentPhotoIndex === -1) return;

    const largeImage = document.getElementById("large-image");
    const largeImageInfo = document.getElementById("large-image-info");
    const largeImageTitle = document.getElementById("large-image-title");
    const largeImageDescription = document.getElementById(
      "large-image-description"
    );
    const largeImagePrice = document.getElementById("large-image-price");
    const largeImageLocation = document.getElementById("large-image-location");
    const largeImageDate = document.getElementById("large-image-date");

    if (!largeImage || !largeImageModal) return;

    // Configurar la imagen
    largeImage.src = photo.image_url;
    largeImage.alt = photo.title;

    // Llenar información de la imagen
    if (largeImageTitle) largeImageTitle.textContent = photo.title;
    if (largeImageDescription)
      largeImageDescription.textContent =
        photo.description || "Sin descripción";
    if (largeImagePrice)
      largeImagePrice.textContent = photo.price
        ? `$${photo.price}`
        : "Precio no especificado";
    if (largeImageLocation)
      largeImageLocation.textContent = photo.location || "Sin ubicación";
    if (largeImageDate)
      largeImageDate.textContent = photo.date
        ? new Date(photo.date).toLocaleDateString()
        : "";

    // Mostrar modal con transición
    largeImageModal.classList.remove("hidden");
    largeImageModal.classList.add("entering");
    document.body.style.overflow = "hidden";

    // Animar la imagen después de un breve delay
    setTimeout(() => {
      largeImage.classList.add("loaded");
    }, 100);

    // Mostrar información automáticamente después de un delay
    setTimeout(() => {
      if (largeImageInfo) {
        largeImageInfo.classList.add("show");
      }
    }, 800);

    // Actualizar botones de navegación
    updateNavigationButtons();
  }

  // Función para actualizar botones de navegación
  function updateNavigationButtons() {
    if (navPrev) {
      navPrev.style.display = currentPhotoIndex > 0 ? "flex" : "none";
    }
    if (navNext) {
      navNext.style.display =
        currentPhotoIndex < photographyData.length - 1 ? "flex" : "none";
    }
  }

  // Función para navegar a la siguiente imagen
  function navigateToNext() {
    if (currentPhotoIndex < photographyData.length - 1) {
      currentPhotoIndex++;
      const photo = photographyData[currentPhotoIndex];
      showImageInFullscreen(photo.id);
    }
  }

  // Función para navegar a la imagen anterior
  function navigateToPrev() {
    if (currentPhotoIndex > 0) {
      currentPhotoIndex--;
      const photo = photographyData[currentPhotoIndex];
      showImageInFullscreen(photo.id);
    }
  }

  // Función para cerrar el modal con transición
  function closeFullscreenModal() {
    const largeImage = document.getElementById("large-image");
    const largeImageInfo = document.getElementById("large-image-info");

    if (largeImageInfo) {
      largeImageInfo.classList.remove("show");
    }

    // Transición de salida
    largeImageModal.classList.add("closing");

    setTimeout(() => {
      largeImageModal.classList.add("hidden");
      largeImageModal.classList.remove("closing", "entering");
      largeImage.classList.remove("loaded");
      document.body.style.overflow = "auto";
    }, 300);
  }

  // Función para mostrar/ocultar información
  function toggleImageInfo() {
    const largeImageInfo = document.getElementById("large-image-info");
    if (largeImageInfo) {
      largeImageInfo.classList.toggle("show");
    }
  }

  // Usar event delegation para las tarjetas de fotos
  const gallery = document.getElementById("gallery");
  if (gallery) {
    gallery.addEventListener("click", (e) => {
      // Buscar la tarjeta de foto más cercana al elemento clickeado
      const photoCard = e.target.closest(".photo-card");

      if (photoCard) {
        e.preventDefault();
        e.stopPropagation();

        const photoId = photoCard.getAttribute("data-photo-id");
        showImageInFullscreen(photoId);
      }
    });
  }

  // Event listeners para navegación
  if (navNext) {
    navNext.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateToNext();
    });
  }

  if (navPrev) {
    navPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateToPrev();
    });
  }

  // Event listener para toggle de información
  if (toggleInfo) {
    toggleInfo.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleImageInfo();
    });
  }

  // Event listener para cerrar información
  if (closeInfo) {
    closeInfo.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleImageInfo();
    });
  }

  // Cerrar modal de vista detallada
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      photoModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    });
  }

  // Cerrar modal al hacer clic fuera
  if (photoModal) {
    photoModal.addEventListener("click", (e) => {
      if (e.target === photoModal) {
        photoModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Abrir modal de vista grande desde el modal detallado
  if (viewLargeBtn) {
    viewLargeBtn.addEventListener("click", () => {
      const modalImage = document.getElementById("modal-image");
      const largeImage = document.getElementById("large-image");
      if (modalImage && largeImage) {
        largeImage.src = modalImage.src;
        photoModal.classList.add("hidden");
        largeImageModal.classList.remove("hidden");
      }
    });
  }

  // Cerrar modal de vista grande
  if (closeLargeModal) {
    closeLargeModal.addEventListener("click", closeFullscreenModal);
  }

  // Cerrar modal grande al hacer clic fuera
  if (largeImageModal) {
    largeImageModal.addEventListener("click", (e) => {
      if (e.target === largeImageModal) {
        closeFullscreenModal();
      }
    });
  }

  // Cerrar modales con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (largeImageModal && !largeImageModal.classList.contains("hidden")) {
        closeFullscreenModal();
      } else if (photoModal && !photoModal.classList.contains("hidden")) {
        photoModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    }

    // Navegación con flechas
    if (largeImageModal && !largeImageModal.classList.contains("hidden")) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateToNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateToPrev();
      }
    }
  });
}

// Exportar la función para uso global
window.initPhotographyGallery = initPhotographyGallery;
