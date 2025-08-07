// Script para la funcionalidad de la galería de fotografía
// Este archivo se carga en la página de fotografía

// Datos de las fotografías (se pasan desde el servidor)
let photographyData = [];

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
        const photo = photographyData.find((p) => p.id == photoId); // Usar == para comparar string con number

        if (photo) {
          // Mostrar imagen directamente en pantalla completa
          const largeImage = document.getElementById("large-image");
          const largeImageInfo = document.getElementById("large-image-info");
          const largeImageTitle = document.getElementById("large-image-title");
          const largeImageDescription = document.getElementById(
            "large-image-description"
          );
          const largeImagePrice = document.getElementById("large-image-price");
          const largeImageLocation = document.getElementById(
            "large-image-location"
          );

          // Verificar que los elementos existen
          if (!largeImage || !largeImageModal) {
            return;
          }

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

          // Mostrar modal de pantalla completa
          largeImageModal.classList.remove("hidden");
          document.body.style.overflow = "hidden";

          // Mostrar información después de un breve delay
          setTimeout(() => {
            if (largeImageInfo) largeImageInfo.classList.remove("hidden");
          }, 500);
        }
      }
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
    closeLargeModal.addEventListener("click", () => {
      const largeImageInfo = document.getElementById("large-image-info");
      if (largeImageInfo) largeImageInfo.classList.add("hidden");
      largeImageModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    });
  }

  // Cerrar modal grande al hacer clic fuera
  if (largeImageModal) {
    largeImageModal.addEventListener("click", (e) => {
      if (e.target === largeImageModal) {
        const largeImageInfo = document.getElementById("large-image-info");
        if (largeImageInfo) largeImageInfo.classList.add("hidden");
        largeImageModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Cerrar modales con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (largeImageModal && !largeImageModal.classList.contains("hidden")) {
        const largeImageInfo = document.getElementById("large-image-info");
        if (largeImageInfo) largeImageInfo.classList.add("hidden");
        largeImageModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      } else if (photoModal && !photoModal.classList.contains("hidden")) {
        photoModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    }
  });

  // Botón de prueba para el modal
  const testButton = document.getElementById("test-modal");
  if (testButton) {
    testButton.addEventListener("click", () => {
      const largeImage = document.getElementById("large-image");
      const largeImageModal = document.getElementById("large-image-modal");

      if (largeImage && largeImageModal) {
        largeImage.src = "https://picsum.photos/800/600";
        largeImage.alt = "Imagen de prueba";
        largeImageModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    });
  }
}

// Exportar la función para uso global
window.initPhotographyGallery = initPhotographyGallery;
