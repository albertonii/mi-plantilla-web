#!/usr/bin/env node

// Script para probar la funcionalidad de fecha opcional
// Uso: node scripts/test-optional-date.js

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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Variables de entorno de Supabase no encontradas");
  process.exit(1);
}

// Crear cliente de Supabase con service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testOptionalDate() {
  console.log("🧪 Probando funcionalidad de fecha opcional...");
  console.log("");

  try {
    // 1. Probar inserción con fecha nula
    console.log("📝 Paso 1: Probando inserción con fecha nula...");
    const testPhotoWithNullDate = {
      title: "Test - Sin Fecha",
      description: "Fotografía de prueba sin fecha",
      image_url:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      price: 150,
      location: "Barcelona",
      date: null, // Fecha nula
      tags: ["test", "sin-fecha"],
      status: "available",
    };

    const { data: insertData1, error: insertError1 } = await supabase
      .from("photography")
      .insert(testPhotoWithNullDate)
      .select();

    if (insertError1) {
      console.error(
        "❌ Error al insertar con fecha nula:",
        insertError1.message
      );
      console.log("💡 Esto indica que la fecha aún es obligatoria");
    } else {
      console.log("✅ Inserción con fecha nula exitosa");
      console.log(`   ID: ${insertData1[0].id}`);
      console.log(`   Fecha: ${insertData1[0].date || "NULL"}`);
    }
    console.log("");

    // 2. Probar inserción con fecha válida
    console.log("📅 Paso 2: Probando inserción con fecha válida...");
    const testPhotoWithDate = {
      title: "Test - Con Fecha",
      description: "Fotografía de prueba con fecha",
      image_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
      price: 200,
      location: "Madrid",
      date: "2024-01-15", // Fecha válida
      tags: ["test", "con-fecha"],
      status: "available",
    };

    const { data: insertData2, error: insertError2 } = await supabase
      .from("photography")
      .insert(testPhotoWithDate)
      .select();

    if (insertError2) {
      console.error(
        "❌ Error al insertar con fecha válida:",
        insertError2.message
      );
    } else {
      console.log("✅ Inserción con fecha válida exitosa");
      console.log(`   ID: ${insertData2[0].id}`);
      console.log(`   Fecha: ${insertData2[0].date}`);
    }
    console.log("");

    // 3. Probar inserción sin campo fecha
    console.log("🔍 Paso 3: Probando inserción sin campo fecha...");
    const testPhotoWithoutDate = {
      title: "Test - Sin Campo Fecha",
      description: "Fotografía de prueba sin campo fecha",
      image_url:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      price: 175,
      location: "Valencia",
      tags: ["test", "sin-campo-fecha"],
      status: "available",
    };

    const { data: insertData3, error: insertError3 } = await supabase
      .from("photography")
      .insert(testPhotoWithoutDate)
      .select();

    if (insertError3) {
      console.error(
        "❌ Error al insertar sin campo fecha:",
        insertError3.message
      );
      console.log("💡 Esto indica que la fecha aún es obligatoria");
    } else {
      console.log("✅ Inserción sin campo fecha exitosa");
      console.log(`   ID: ${insertData3[0].id}`);
      console.log(`   Fecha: ${insertData3[0].date || "NULL"}`);
    }
    console.log("");

    // 4. Limpiar datos de prueba
    console.log("🧹 Paso 4: Limpiando datos de prueba...");
    const testIds = [];
    if (insertData1) testIds.push(insertData1[0].id);
    if (insertData2) testIds.push(insertData2[0].id);
    if (insertData3) testIds.push(insertData3[0].id);

    if (testIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("photography")
        .delete()
        .in("id", testIds);

      if (deleteError) {
        console.error(
          "❌ Error al eliminar datos de prueba:",
          deleteError.message
        );
      } else {
        console.log("✅ Datos de prueba eliminados");
      }
    }
    console.log("");

    // 5. Verificar fotografías existentes
    console.log("📸 Paso 5: Verificando fotografías existentes...");
    const { data: existingPhotos, error: fetchError } = await supabase
      .from("photography")
      .select("id, title, date")
      .order("created_at", { ascending: false })
      .limit(5);

    if (fetchError) {
      console.error("❌ Error al obtener fotografías:", fetchError.message);
    } else {
      console.log(`✅ Se encontraron ${existingPhotos.length} fotografías`);
      existingPhotos.forEach((photo, index) => {
        console.log(
          `   ${index + 1}. ${photo.title}: ${photo.date || "Sin fecha"}`
        );
      });
    }
    console.log("");

    // 6. Resumen final
    console.log("🎉 ¡Prueba de fecha opcional completada!");
    console.log("");
    console.log("📋 Resultados:");

    const nullDateSuccess = !insertError1;
    const validDateSuccess = !insertError2;
    const noDateFieldSuccess = !insertError3;

    console.log(
      `✅ Inserción con fecha nula: ${nullDateSuccess ? "EXITOSA" : "FALLIDA"}`
    );
    console.log(
      `✅ Inserción con fecha válida: ${
        validDateSuccess ? "EXITOSA" : "FALLIDA"
      }`
    );
    console.log(
      `✅ Inserción sin campo fecha: ${
        noDateFieldSuccess ? "EXITOSA" : "FALLIDA"
      }`
    );

    if (nullDateSuccess && noDateFieldSuccess) {
      console.log("🎉 ¡La fecha es completamente opcional!");
    } else {
      console.log("⚠️ La fecha aún es obligatoria en la base de datos");
      console.log("💡 Necesitas aplicar la migración manualmente en Supabase");
    }
    console.log("");
    console.log("🔗 Próximos pasos:");
    console.log("1. Si la fecha es opcional: ¡Todo listo!");
    console.log(
      "2. Si la fecha es obligatoria: Aplica la migración en Supabase"
    );
    console.log(
      "3. Prueba el formulario en http://localhost:4322/admin/fotografia"
    );
  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
testOptionalDate()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exit(1);
  });
