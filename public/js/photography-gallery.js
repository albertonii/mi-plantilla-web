// Script para la funcionalidad de la galería de fotografía
// Este archivo se carga en la página de fotografía

// Datos de las fotografías (se pasan desde el servidor)
let photographyData = [];

// Inicializar la galería
function initPhotographyGallery(data) {
  photographyData = data;
  console.log("🎨 Inicializando galería de fotografía con", data.length, "imágenes");

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
  console.log("📸 Configurando event listeners para", photoCards.length, "tarjetas de foto");
  photoCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      console.log("🖱️ Clic en tarjeta", index + 1);
      const photoId = card.getAttribute("data-photo-id");
      const photo = photographyData.find((p) => p.id === photoId);

      if (photo) {
        console.log("🖼️ Abriendo imagen en pantalla completa:", photo.title);
        
        // Mostrar imagen directamente en pantalla completa
        const largeImage = document.getElementById("large-image");
        const largeImageInfo = document.getElementById("large-image-info");
        const largeImageTitle = document.getElementById("large-image-title");
        const largeImageDescription = document.getElementById("large-image-description");
        const largeImagePrice = document.getElementById("large-image-price");
        const largeImageLocation = document.getElementById("large-image-location");

        // Verificar que los elementos existen
        if (!largeImage) {
          console.error("❌ Elemento large-image no encontrado");
          return;
        }

        largeImage.src = photo.image_url;
        largeImage.alt = photo.title;

        // Llenar información de la imagen
        if (largeImageTitle) largeImageTitle.textContent = photo.title;
        if (largeImageDescription) largeImageDescription.textContent = photo.description || "Sin descripción";
        if (largeImagePrice) largeImagePrice.textContent = photo.price ? `$${photo.price}` : "Precio no especificado";
        if (largeImageLocation) largeImageLocation.textContent = photo.location || "Sin ubicación";

        // Mostrar modal de pantalla completa
        console.log("🖼️ Mostrando modal de pantalla completa");
        largeImageModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        console.log("✅ Modal mostrado, overflow bloqueado");

        // Mostrar información después de un breve delay
        setTimeout(() => {
          if (largeImageInfo) largeImageInfo.classList.remove("hidden");
        }, 500);
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
    const largeImageInfo = document.getElementById("large-image-info");
    if (largeImageInfo) largeImageInfo.classList.add("hidden");
    largeImageModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  // Cerrar modal grande al hacer clic fuera
  largeImageModal.addEventListener("click", (e) => {
    if (e.target === largeImageModal) {
      const largeImageInfo = document.getElementById("large-image-info");
      if (largeImageInfo) largeImageInfo.classList.add("hidden");
      largeImageModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });

  // Cerrar modales con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!largeImageModal.classList.contains("hidden")) {
        const largeImageInfo = document.getElementById("large-image-info");
        if (largeImageInfo) largeImageInfo.classList.add("hidden");
        largeImageModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      } else if (!photoModal.classList.contains("hidden")) {
        photoModal.classList.add("hidden");
        document.body.style.overflow = "auto";
      }
    }
  });
}

// Exportar la función para uso global
window.initPhotographyGallery = initPhotographyGallery;
