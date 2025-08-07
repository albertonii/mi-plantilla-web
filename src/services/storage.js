// Servicio para manejar subidas de archivos a Supabase Storage
import { supabase } from './auth.js';

// Subir imagen al bucket de fotografías
export async function uploadPhotographyImage(file, fileName = null) {
  try {
    // Validar archivo
    if (!file) {
      throw new Error('No se proporcionó ningún archivo');
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF, SVG)');
    }

    // Validar tamaño (50MB máximo)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 50MB');
    }

    // Generar nombre único para el archivo
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const finalFileName = fileName || `photo_${timestamp}_${randomId}.${extension}`;

    // Subir archivo al bucket de fotografías
    const { data, error } = await supabase.storage
      .from('photography')
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('photography')
      .getPublicUrl(finalFileName);

    return {
      success: true,
      fileName: finalFileName,
      publicUrl: urlData.publicUrl,
      path: data.path,
      size: file.size,
      type: file.type
    };

  } catch (error) {
    console.error('Error inesperado al subir imagen:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Eliminar imagen del storage
export async function deletePhotographyImage(fileName) {
  try {
    if (!fileName) {
      throw new Error('Nombre de archivo requerido');
    }

    const { error } = await supabase.storage
      .from('photography')
      .remove([fileName]);

    if (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }

    return {
      success: true,
      message: 'Imagen eliminada correctamente'
    };

  } catch (error) {
    console.error('Error inesperado al eliminar imagen:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Obtener lista de imágenes del bucket de fotografías
export async function listPhotographyImages() {
  try {
    const { data, error } = await supabase.storage
      .from('photography')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error al listar imágenes:', error);
      throw error;
    }

    // Generar URLs públicas para cada imagen
    const imagesWithUrls = data.map(file => {
      const { data: urlData } = supabase.storage
        .from('photography')
        .getPublicUrl(file.name);

      return {
        name: file.name,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || 'image/jpeg',
        created_at: file.created_at,
        publicUrl: urlData.publicUrl
      };
    });

    return {
      success: true,
      data: imagesWithUrls
    };

  } catch (error) {
    console.error('Error inesperado al listar imágenes:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
}

// Obtener URL pública de una imagen
export function getPhotographyImageUrl(fileName) {
  try {
    const { data } = supabase.storage
      .from('photography')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error al obtener URL de imagen:', error);
    return null;
  }
}

// Validar archivo antes de subir
export function validateImageFile(file) {
  const errors = [];

  // Validar que existe un archivo
  if (!file) {
    errors.push('No se seleccionó ningún archivo');
    return { isValid: false, errors };
  }

  // Validar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF, SVG)');
  }

  // Validar tamaño (50MB máximo)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    errors.push('El archivo es demasiado grande. Máximo 50MB');
  }

  // Validar tamaño mínimo (1KB)
  const minSize = 1024; // 1KB
  if (file.size < minSize) {
    errors.push('El archivo es demasiado pequeño. Mínimo 1KB');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Convertir archivo a Base64 (para preview)
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Obtener información del archivo
export function getFileInfo(file) {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
  };
} 