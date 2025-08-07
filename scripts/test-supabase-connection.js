// Script para probar la conexión a Supabase
import { supabase } from '../supabase/config.ts';

console.log('🧪 Probando conexión a Supabase...');

async function testSupabaseConnection() {
  try {
    console.log('🔍 Verificando conexión...');
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('photography')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error de conexión:', error);
      return;
    }
    
    console.log('✅ Conexión exitosa');
    console.log('📊 Total de fotos en la base de datos:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('📸 Primera foto:', data[0]);
      
      // Verificar el campo status
      const statuses = [...new Set(data.map(photo => photo.status))];
      console.log('🏷️ Estados disponibles:', statuses);
      
      // Contar fotos por estado
      const statusCount = {};
      data.forEach(photo => {
        statusCount[photo.status] = (statusCount[photo.status] || 0) + 1;
      });
      console.log('📈 Conteo por estado:', statusCount);
      
      // Buscar fotos con status 'available'
      const availablePhotos = data.filter(photo => photo.status === 'available');
      console.log('✅ Fotos disponibles:', availablePhotos.length);
      
      if (availablePhotos.length > 0) {
        console.log('📸 Primera foto disponible:', availablePhotos[0]);
      }
    } else {
      console.log('❌ No hay fotos en la base de datos');
    }
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Ejecutar la prueba
testSupabaseConnection(); 