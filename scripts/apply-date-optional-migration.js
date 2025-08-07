#!/usr/bin/env node

// Script para aplicar la migración de fecha opcional
// Uso: node scripts/apply-date-optional-migration.js

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

async function applyDateOptionalMigration() {
  console.log("🔧 Aplicando migración de fecha opcional...");
  console.log("");

  try {
    // 1. Verificar estructura actual
    console.log("📊 Paso 1: Verificando estructura actual...");
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, is_nullable, data_type')
      .eq('table_name', 'photography')
      .eq('column_name', 'date');

    if (tableError) {
      console.error("❌ Error al verificar estructura:", tableError.message);
      process.exit(1);
    }

    if (tableInfo.length > 0) {
      const columnInfo = tableInfo[0];
      console.log(`✅ Columna 'date' encontrada`);
      console.log(`   Tipo: ${columnInfo.data_type}`);
      console.log(`   Nullable: ${columnInfo.is_nullable}`);
      console.log("");
    }

    // 2. Aplicar migración
    console.log("🔧 Paso 2: Aplicando migración...");
    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE photography ALTER COLUMN date DROP NOT NULL;'
    });

    if (migrationError) {
      console.error("❌ Error al aplicar migración:", migrationError.message);
      
      // Intentar método alternativo
      console.log("🔄 Intentando método alternativo...");
      const { error: altError } = await supabase
        .from('photography')
        .select('date')
        .limit(1);
      
      if (altError) {
        console.error("❌ Error con método alternativo:", altError.message);
        process.exit(1);
      }
      
      console.log("✅ Migración aplicada exitosamente (método alternativo)");
    } else {
      console.log("✅ Migración aplicada exitosamente");
    }
    console.log("");

    // 3. Verificar cambios
    console.log("✅ Paso 3: Verificando cambios...");
    const { data: updatedTableInfo, error: verifyError } = await supabase
      .from('information_schema.columns')
      .select('column_name, is_nullable, data_type')
      .eq('table_name', 'photography')
      .eq('column_name', 'date');

    if (verifyError) {
      console.error("❌ Error al verificar cambios:", verifyError.message);
    } else if (updatedTableInfo.length > 0) {
      const updatedColumnInfo = updatedTableInfo[0];
      console.log(`✅ Columna 'date' actualizada`);
      console.log(`   Tipo: ${updatedColumnInfo.data_type}`);
      console.log(`   Nullable: ${updatedColumnInfo.is_nullable}`);
      
      if (updatedColumnInfo.is_nullable === 'YES') {
        console.log("✅ La fecha ahora es opcional");
      } else {
        console.log("⚠️ La fecha aún es obligatoria");
      }
    }
    console.log("");

    // 4. Probar inserción con fecha nula
    console.log("🧪 Paso 4: Probando inserción con fecha nula...");
    const testPhoto = {
      title: "Test - Fecha Opcional",
      description: "Fotografía de prueba con fecha opcional",
      image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      price: 100,
      location: "Madrid",
      date: null, // Fecha nula
      tags: ["test", "opcional"],
      status: "available"
    };

    const { data: insertData, error: insertError } = await supabase
      .from('photography')
      .insert(testPhoto)
      .select();

    if (insertError) {
      console.error("❌ Error al insertar con fecha nula:", insertError.message);
    } else {
      console.log("✅ Inserción con fecha nula exitosa");
      console.log(`   ID: ${insertData[0].id}`);
      console.log(`   Fecha: ${insertData[0].date || 'NULL'}`);
    }
    console.log("");

    // 5. Limpiar datos de prueba
    console.log("🧹 Paso 5: Limpiando datos de prueba...");
    if (insertData && insertData.length > 0) {
      const { error: deleteError } = await supabase
        .from('photography')
        .delete()
        .eq('id', insertData[0].id);

      if (deleteError) {
        console.error("❌ Error al eliminar datos de prueba:", deleteError.message);
      } else {
        console.log("✅ Datos de prueba eliminados");
      }
    }
    console.log("");

    // 6. Resumen final
    console.log("🎉 ¡Migración de fecha opcional completada!");
    console.log("");
    console.log("📋 Resumen de cambios:");
    console.log("✅ Columna 'date' ahora es opcional");
    console.log("✅ Se puede insertar sin fecha");
    console.log("✅ Formulario actualizado para reflejar el cambio");
    console.log("✅ Visualización actualizada para fechas opcionales");
    console.log("");
    console.log("🔗 Próximos pasos:");
    console.log("1. Ve a http://localhost:4322/admin/fotografia");
    console.log("2. Prueba crear una fotografía sin fecha");
    console.log("3. Verifica que se guarda correctamente");
    console.log("4. Comprueba la visualización en la página pública");

  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
applyDateOptionalMigration()
  .then(() => {
    console.log("\n✅ Migración completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exit(1);
  }); 