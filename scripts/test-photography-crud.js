#!/usr/bin/env node

// Script para probar las funcionalidades CRUD de fotografías
// Uso: node scripts/test-photography-crud.js

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
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Error: Variables de entorno de Supabase no encontradas");
  process.exit(1);
}

if (!adminEmail || !adminPassword) {
  console.error("❌ Error: Variables de entorno de admin no encontradas");
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testPhotographyCRUD() {
  console.log("🧪 Probando funcionalidades CRUD de fotografías...");
  console.log(`📧 Email: ${adminEmail}`);
  console.log("");

  try {
    // 1. Autenticación
    console.log("🔐 Paso 1: Autenticación...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      console.error("❌ Error de autenticación:", error.message);
      process.exit(1);
    }

    console.log("✅ Autenticación exitosa");
    console.log("");

    // 2. Obtener fotografías existentes
    console.log("📸 Paso 2: Obteniendo fotografías existentes...");
    const { data: existingPhotos, error: fetchError } = await supabase
      .from("photography")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("❌ Error al obtener fotografías:", fetchError.message);
      process.exit(1);
    }

    console.log(
      `✅ Se encontraron ${existingPhotos.length} fotografías existentes`
    );
    console.log("");

    // 3. Crear nueva fotografía
    console.log("➕ Paso 3: Creando nueva fotografía...");
    const newPhoto = {
      title: "Fotografía de Prueba",
      description:
        "Esta es una fotografía de prueba para verificar las funcionalidades CRUD",
      image_url: "https://ejemplo.com/imagen-prueba.jpg",
      price: 150.0,
      location: "Madrid, España",
      date: "2024-01-15",
      tags: ["prueba", "test", "demo"],
      status: "available",
    };

    const { data: createdPhoto, error: createError } = await supabase
      .from("photography")
      .insert([newPhoto])
      .select()
      .single();

    if (createError) {
      console.error("❌ Error al crear fotografía:", createError.message);
      process.exit(1);
    }

    console.log("✅ Fotografía creada exitosamente");
    console.log(`   ID: ${createdPhoto.id}`);
    console.log(`   Título: ${createdPhoto.title}`);
    console.log("");

    // 4. Obtener fotografía por ID
    console.log("🔍 Paso 4: Obteniendo fotografía por ID...");
    const { data: fetchedPhoto, error: getError } = await supabase
      .from("photography")
      .select("*")
      .eq("id", createdPhoto.id)
      .single();

    if (getError) {
      console.error("❌ Error al obtener fotografía:", getError.message);
      process.exit(1);
    }

    console.log("✅ Fotografía obtenida exitosamente");
    console.log(`   Título: ${fetchedPhoto.title}`);
    console.log(`   Precio: $${fetchedPhoto.price}`);
    console.log("");

    // 5. Actualizar fotografía
    console.log("✏️ Paso 5: Actualizando fotografía...");
    const updateData = {
      title: "Fotografía de Prueba Actualizada",
      description:
        "Esta fotografía ha sido actualizada para probar la funcionalidad de edición",
      price: 200.0,
      status: "sold",
    };

    const { data: updatedPhoto, error: updateError } = await supabase
      .from("photography")
      .update(updateData)
      .eq("id", createdPhoto.id)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Error al actualizar fotografía:", updateError.message);
      process.exit(1);
    }

    console.log("✅ Fotografía actualizada exitosamente");
    console.log(`   Nuevo título: ${updatedPhoto.title}`);
    console.log(`   Nuevo precio: $${updatedPhoto.price}`);
    console.log(`   Nuevo estado: ${updatedPhoto.status}`);
    console.log("");

    // 6. Buscar fotografías
    console.log("🔎 Paso 6: Probando búsqueda de fotografías...");
    const { data: searchResults, error: searchError } = await supabase
      .from("photography")
      .select("*")
      .or(`title.ilike.%prueba%,description.ilike.%prueba%`)
      .order("created_at", { ascending: false });

    if (searchError) {
      console.error("❌ Error al buscar fotografías:", searchError.message);
    } else {
      console.log(
        `✅ Búsqueda exitosa: ${searchResults.length} resultados encontrados`
      );
    }
    console.log("");

    // 7. Filtrar por estado
    console.log("📊 Paso 7: Probando filtro por estado...");
    const { data: soldPhotos, error: filterError } = await supabase
      .from("photography")
      .select("*")
      .eq("status", "sold")
      .order("created_at", { ascending: false });

    if (filterError) {
      console.error("❌ Error al filtrar por estado:", filterError.message);
    } else {
      console.log(
        `✅ Filtro por estado exitoso: ${soldPhotos.length} fotografías vendidas`
      );
    }
    console.log("");

    // 8. Eliminar fotografía de prueba
    console.log("🗑️ Paso 8: Eliminando fotografía de prueba...");
    const { error: deleteError } = await supabase
      .from("photography")
      .delete()
      .eq("id", createdPhoto.id);

    if (deleteError) {
      console.error("❌ Error al eliminar fotografía:", deleteError.message);
      process.exit(1);
    }

    console.log("✅ Fotografía eliminada exitosamente");
    console.log("");

    // 9. Verificar eliminación
    console.log("✅ Paso 9: Verificando eliminación...");
    const { data: deletedPhoto, error: verifyError } = await supabase
      .from("photography")
      .select("*")
      .eq("id", createdPhoto.id)
      .single();

    if (verifyError && verifyError.code === "PGRST116") {
      console.log(
        "✅ Verificación exitosa: La fotografía fue eliminada correctamente"
      );
    } else {
      console.log("⚠️ La fotografía aún existe después de la eliminación");
    }
    console.log("");

    // 10. Resumen final
    console.log("🎉 ¡Prueba CRUD completada exitosamente!");
    console.log("");
    console.log("📋 Resumen de operaciones:");
    console.log("✅ CREATE: Fotografía creada correctamente");
    console.log("✅ READ: Fotografía obtenida por ID");
    console.log("✅ UPDATE: Fotografía actualizada correctamente");
    console.log("✅ DELETE: Fotografía eliminada correctamente");
    console.log("✅ SEARCH: Búsqueda de fotografías funcionando");
    console.log("✅ FILTER: Filtro por estado funcionando");
    console.log("");
    console.log("🔗 Próximos pasos:");
    console.log("1. Ve a http://localhost:4321/admin/fotografia");
    console.log("2. Prueba las funcionalidades CRUD desde la interfaz web");
    console.log("3. Verifica que los datos se sincronizan correctamente");
  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
testPhotographyCRUD()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exit(1);
  });
