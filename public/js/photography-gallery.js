// Script para la funcionalidad de la galería de fotografía
// Este archivo se carga en la página de fotografía

// Datos de las fotografías (se pasan desde el servidor)
let photographyData = [];

// Inicializar la galería
function initPhotographyGallery(data) {
  photographyData = data;

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

  // Abrir modal de vista detallada
  photoCards.forEach((card) => {
    card.addEventListener("click", () => {
      const photoId = card.getAttribute("data-photo-id");
      const photo = photographyData.find((p) => p.id === photoId);

      if (photo) {
        // Llenar modal con datos de la foto
        document.getElementById("modal-title").textContent = photo.title;
        document.getElementById("modal-image").src = photo.image_url;
        document.getElementById("modal-description").textContent =
          photo.description || "Sin descripción";
        document.getElementById("modal-price").textContent = photo.price
          ? `$${photo.price}`
          : "No especificado";
        document.getElementById("modal-location").textContent =
          photo.location || "Sin ubicación";
        document.getElementById("modal-date").textContent =
          photo.date || "Sin fecha";
        document.getElementById("modal-status").textContent =
          photo.status === "available" ? "Disponible" : "Vendida";

        // Llenar etiquetas
        const tagsContainer = document.getElementById("modal-tags");
        tagsContainer.innerHTML = "";
        if (photo.tags && photo.tags.length > 0) {
          photo.tags.forEach((tag) => {
            const tagSpan = document.createElement("span");
            tagSpan.className =
              "px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded";
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
          });
        }

        // Mostrar/ocultar botón de compra según el estado
        const buyButton = document.getElementById("modal-buy-button");
        if (photo.status === "available") {
          buyButton.classList.remove("hidden");
        } else {
          buyButton.classList.add("hidden");
        }

        // Mostrar modal
        photoModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    });
  });

  // Cerrar modal de vista detallada
  closeModal.addEventListener("click", () => {
    photoModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  // Cerrar modal al hacer clic fuera
  photoModal.addEventListener("click", (e) => {
    if (e.target === photoModal) {
      photoModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });

  // Abrir modal de vista grande
  viewLargeBtn.addEventListener("click", () => {
    const modalImage = document.getElementById("modal-image");
    const largeImage = document.getElementById("large-image");
    largeImage.src = modalImage.src;

    photoModal.classList.add("hidden");
    largeImageModal.classList.remove("hidden");
  });

  // Cerrar modal de vista grande
  closeLargeModal.addEventListener("click", () => {
    largeImageModal.classList.add("hidden");
    photoModal.classList.remove("hidden");
  });

  // Cerrar modal grande al hacer clic fuera
  largeImageModal.addEventListener("click", (e) => {
    if (e.target === largeImageModal) {
      largeImageModal.classList.add("hidden");
      photoModal.classList.remove("hidden");
    }
  });

  // Cerrar modales con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!largeImageModal.classList.contains("hidden")) {
        largeImageModal.classList.add("hidden");
        photoModal.classList.remove("hidden");
      } else if (!photoModal.classList.contains("hidden")) {
        photoModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    }
  });
}

// Exportar la función para uso global
window.initPhotographyGallery = initPhotographyGallery;
