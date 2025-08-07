// Script de prueba para el modal de pantalla completa
// Este script verifica que todos los elementos necesarios estén presentes

console.log("🧪 Iniciando prueba del modal de pantalla completa...");

// Verificar elementos del DOM
const elements = {
  "large-image-modal": document.getElementById("large-image-modal"),
  "large-image": document.getElementById("large-image"),
  "close-large-modal": document.getElementById("close-large-modal"),
  "large-image-info": document.getElementById("large-image-info"),
  "large-image-title": document.getElementById("large-image-title"),
  "large-image-description": document.getElementById("large-image-description"),
  "large-image-price": document.getElementById("large-image-price"),
  "large-image-location": document.getElementById("large-image-location"),
  "photo-cards": document.querySelectorAll(".photo-card"),
};

console.log("📋 Elementos encontrados:");
Object.entries(elements).forEach(([name, element]) => {
  if (element) {
    console.log(`✅ ${name}: encontrado`);
  } else {
    console.log(`❌ ${name}: NO encontrado`);
  }
});

// Verificar que hay tarjetas de fotos
console.log(
  `📸 Tarjetas de fotos encontradas: ${elements["photo-cards"].length}`
);

// Función de prueba para abrir modal
function testFullscreenModal() {
  console.log("🧪 Probando apertura del modal...");

  const largeImage = document.getElementById("large-image");
  const largeImageModal = document.getElementById("large-image-modal");

  if (largeImage && largeImageModal) {
    // Configurar imagen de prueba
    largeImage.src = "https://picsum.photos/800/600";
    largeImage.alt = "Imagen de prueba";

    // Mostrar modal
    largeImageModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    console.log("✅ Modal de prueba mostrado correctamente");

    // Ocultar después de 3 segundos
    setTimeout(() => {
      largeImageModal.classList.add("hidden");
      document.body.style.overflow = "auto";
      console.log("✅ Modal de prueba cerrado correctamente");
    }, 3000);
  } else {
    console.error("❌ Elementos del modal no encontrados");
  }
}

// Ejecutar prueba después de 2 segundos
setTimeout(testFullscreenModal, 2000);

console.log("🧪 Prueba configurada. El modal se abrirá en 2 segundos...");
