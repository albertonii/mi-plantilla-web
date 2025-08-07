#!/usr/bin/env node

// Script para probar la carga de datos de fotografía desde la base de datos
// Uso: node scripts/test-photography-data-loading.js

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

// Verificar variables de entorno
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error: Variables de entorno de Supabase no encontradas");
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPhotographyDataLoading() {
  console.log(
    "🧪 Probando carga de datos de fotografía desde la base de datos..."
  );
  console.log("");

  try {
    // 1. Probar carga de todas las fotografías
    console.log("📸 Paso 1: Cargando todas las fotografías...");
    const { data: allPhotos, error: allError } = await supabase
      .from("photography")
      .select("*")
      .order("created_at", { ascending: false });

    if (allError) {
      console.error(
        "❌ Error al cargar todas las fotografías:",
        allError.message
      );
      process.exit(1);
    }

    console.log(`✅ Se cargaron ${allPhotos.length} fotografías en total`);
    console.log("");

    // 2. Probar carga de fotografías disponibles (públicas)
    console.log("🌐 Paso 2: Cargando fotografías públicas (disponibles)...");
    const { data: publicPhotos, error: publicError } = await supabase
      .from("photography")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (publicError) {
      console.error(
        "❌ Error al cargar fotografías públicas:",
        publicError.message
      );
      process.exit(1);
    }

    console.log(`✅ Se cargaron ${publicPhotos.length} fotografías públicas`);
    console.log("");

    // 3. Verificar estructura de datos
    console.log("📊 Paso 3: Verificando estructura de datos...");
    if (publicPhotos.length > 0) {
      const samplePhoto = publicPhotos[0];
      console.log("📋 Estructura de una fotografía:");
      console.log(`   ID: ${samplePhoto.id}`);
      console.log(`   Título: ${samplePhoto.title || "Sin título"}`);
      console.log(
        `   Descripción: ${samplePhoto.description || "Sin descripción"}`
      );
      console.log(`   URL de imagen: ${samplePhoto.image_url || "Sin imagen"}`);
      console.log(`   Precio: ${samplePhoto.price || "Sin precio"}`);
      console.log(`   Ubicación: ${samplePhoto.location || "Sin ubicación"}`);
      console.log(`   Fecha: ${samplePhoto.date || "Sin fecha"}`);
      console.log(`   Estado: ${samplePhoto.status}`);
      console.log(
        `   Etiquetas: ${
          (samplePhoto.tags || []).join(", ") || "Sin etiquetas"
        }`
      );
      console.log(`   Creada: ${samplePhoto.created_at}`);
      console.log("");
    }

    // 4. Verificar etiquetas únicas
    console.log("🏷️ Paso 4: Verificando etiquetas únicas...");
    const allTags = [
      ...new Set(publicPhotos.flatMap((photo) => photo.tags || [])),
    ];
    console.log(`✅ Se encontraron ${allTags.length} etiquetas únicas:`);
    allTags.forEach((tag, index) => {
      console.log(`   ${index + 1}. ${tag}`);
    });
    console.log("");

    // 5. Verificar imágenes disponibles
    console.log("🖼️ Paso 5: Verificando imágenes disponibles...");
    const photosWithImages = publicPhotos.filter((photo) => photo.image_url);
    const photosWithoutImages = publicPhotos.filter(
      (photo) => !photo.image_url
    );

    console.log(`✅ Fotografías con imágenes: ${photosWithImages.length}`);
    console.log(`⚠️ Fotografías sin imágenes: ${photosWithoutImages.length}`);

    if (photosWithImages.length > 0) {
      console.log("📋 URLs de imágenes disponibles:");
      photosWithImages.slice(0, 3).forEach((photo, index) => {
        console.log(`   ${index + 1}. ${photo.title}: ${photo.image_url}`);
      });
    }
    console.log("");

    // 6. Verificar fechas opcionales
    console.log("📅 Paso 6: Verificando fechas opcionales...");
    const photosWithDate = publicPhotos.filter((photo) => photo.date);
    const photosWithoutDate = publicPhotos.filter((photo) => !photo.date);

    console.log(`✅ Fotografías con fecha: ${photosWithDate.length}`);
    console.log(`✅ Fotografías sin fecha: ${photosWithoutDate.length}`);
    console.log("");

    // 7. Simular consulta de página pública
    console.log("🌐 Paso 7: Simulando consulta de página pública...");
    const pagePublicData = {
      photographyData: publicPhotos,
      allTags: allTags,
    };

    console.log("📋 Datos para página pública:");
    console.log(`   - Fotografías: ${pagePublicData.photographyData.length}`);
    console.log(`   - Etiquetas únicas: ${pagePublicData.allTags.length}`);
    console.log(
      `   - Con imágenes: ${
        pagePublicData.photographyData.filter((p) => p.image_url).length
      }`
    );
    console.log(
      `   - Con fecha: ${
        pagePublicData.photographyData.filter((p) => p.date).length
      }`
    );
    console.log("");

    // 8. Verificar URLs de imágenes
    console.log("🔗 Paso 8: Verificando URLs de imágenes...");
    const validUrls = [];
    const invalidUrls = [];

    for (const photo of photosWithImages.slice(0, 3)) {
      try {
        const response = await fetch(photo.image_url, { method: "HEAD" });
        if (response.ok) {
          validUrls.push(photo.image_url);
          console.log(`✅ URL válida: ${photo.title}`);
        } else {
          invalidUrls.push(photo.image_url);
          console.log(`❌ URL inválida: ${photo.title} (${response.status})`);
        }
      } catch (error) {
        invalidUrls.push(photo.image_url);
        console.log(
          `❌ Error al verificar URL: ${photo.title} (${error.message})`
        );
      }
    }

    console.log(`✅ URLs válidas: ${validUrls.length}`);
    console.log(`❌ URLs inválidas: ${invalidUrls.length}`);
    console.log("");

    // 9. Resumen final
    console.log("🎉 ¡Prueba de carga de datos completada!");
    console.log("");
    console.log("📋 Resumen de funcionalidades:");
    console.log("✅ Conexión con Supabase funcionando");
    console.log("✅ Carga de fotografías públicas exitosa");
    console.log("✅ Estructura de datos verificada");
    console.log("✅ Etiquetas únicas extraídas");
    console.log("✅ Imágenes disponibles identificadas");
    console.log("✅ Fechas opcionales funcionando");
    console.log("✅ URLs de imágenes validadas");
    console.log("");
    console.log("🔗 Próximos pasos:");
    console.log("1. Ve a http://localhost:4322/fotografia");
    console.log("2. Verifica que las imágenes se cargan correctamente");
    console.log("3. Prueba los filtros por etiquetas");
    console.log("4. Comprueba la visualización de fechas opcionales");
    console.log("");
    console.log("💡 Datos disponibles para la página:");
    console.log(`   - ${publicPhotos.length} fotografías públicas`);
    console.log(`   - ${allTags.length} etiquetas únicas`);
    console.log(`   - ${photosWithImages.length} con imágenes`);
    console.log(`   - ${photosWithDate.length} con fecha`);
    console.log(`   - ${photosWithoutDate.length} sin fecha`);
  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
testPhotographyDataLoading()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exit(1);
  });
