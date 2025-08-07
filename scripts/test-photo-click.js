// Script de prueba para verificar que los clics en fotos funcionan
console.log('🧪 Iniciando prueba de clics en fotos...');

// Función para simular un clic en una foto
function testPhotoClick() {
  console.log('🖱️ Simulando clic en primera foto...');
  
  const firstPhotoCard = document.querySelector('.photo-card');
  if (firstPhotoCard) {
    console.log('✅ Tarjeta de foto encontrada:', firstPhotoCard.getAttribute('data-photo-id'));
    
    // Simular clic
    firstPhotoCard.click();
    
    // Verificar si el modal se abrió
    setTimeout(() => {
      const modal = document.getElementById('large-image-modal');
      if (modal && !modal.classList.contains('hidden')) {
        console.log('✅ Modal se abrió correctamente');
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          modal.classList.add('hidden');
          document.body.style.overflow = 'auto';
          console.log('✅ Modal cerrado correctamente');
        }, 2000);
      } else {
        console.log('❌ Modal no se abrió');
      }
    }, 500);
  } else {
    console.log('❌ No se encontraron tarjetas de fotos');
  }
}

// Función para verificar elementos
function checkElements() {
  console.log('🔍 Verificando elementos...');
  
  const elements = {
    'photo-cards': document.querySelectorAll('.photo-card'),
    'gallery': document.getElementById('gallery'),
    'large-image-modal': document.getElementById('large-image-modal'),
    'large-image': document.getElementById('large-image')
  };
  
  Object.entries(elements).forEach(([name, element]) => {
    if (element) {
      if (element.length !== undefined) {
        console.log(`✅ ${name}: ${element.length} encontrados`);
      } else {
        console.log(`✅ ${name}: encontrado`);
      }
    } else {
      console.log(`❌ ${name}: NO encontrado`);
    }
  });
  
  // Verificar datos de fotografía
  if (typeof window.photographyData !== 'undefined') {
    console.log(`📸 Datos de fotografía: ${window.photographyData.length} fotos`);
  } else {
    console.log('❌ Datos de fotografía no disponibles');
  }
}

// Ejecutar verificaciones
checkElements();

// Esperar un poco y luego probar el clic
setTimeout(() => {
  console.log('⏰ Ejecutando prueba de clic...');
  testPhotoClick();
}, 2000);

console.log('🧪 Prueba configurada. Se ejecutará en 2 segundos...'); 