#!/usr/bin/env node

// Script para agregar datos de ejemplo de fotografía
// Uso: node scripts/add-sample-photography.js

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

async function addSamplePhotography() {
  console.log("📸 Agregando datos de ejemplo de fotografía...");
  console.log("");

  try {
    // Datos de ejemplo
    const samplePhotos = [
      {
        title: "Amanecer en la Montaña",
        description: "Captura del primer rayo de sol sobre las cumbres nevadas de los Alpes",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        price: 250,
        location: "Alpes Suizos",
        date: "2024-01-15",
        tags: ["naturaleza", "paisaje", "amanecer", "montaña"],
        status: "available"
      },
      {
        title: "Retrato Urbano",
        description: "Momentos cotidianos capturados en las calles de Barcelona",
        image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        price: 180,
        location: "Barcelona, España",
        date: "2024-02-20",
        tags: ["urbano", "retrato", "street", "ciudad"],
        status: "available"
      },
      {
        title: "Arquitectura Moderna",
        description: "Líneas geométricas y formas abstractas en la arquitectura contemporánea",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        price: 300,
        location: "Nueva York, USA",
        date: "2024-03-10",
        tags: ["arquitectura", "moderno", "geometría", "abstracto"],
        status: "available"
      },
      {
        title: "Vida Silvestre",
        description: "Fotografía de naturaleza salvaje en su hábitat natural",
        image_url: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800",
        price: 400,
        location: "Serengeti, Tanzania",
        tags: ["naturaleza", "vida-silvestre", "animales", "safari"],
        status: "available"
      },
      {
        title: "Fotografía Sin Fecha",
        description: "Una fotografía sin fecha específica para probar la funcionalidad opcional",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        price: 150,
        location: "Madrid, España",
        date: null, // Sin fecha para probar funcionalidad opcional
        tags: ["experimental", "sin-fecha"],
        status: "available"
      }
    ];

    console.log(`📝 Insertando ${samplePhotos.length} fotografías de ejemplo...`);
    console.log("");

    const insertedPhotos = [];
    const errors = [];

    for (let i = 0; i < samplePhotos.length; i++) {
      const photo = samplePhotos[i];
      console.log(`📸 Insertando: ${photo.title}...`);

      const { data, error } = await supabase
        .from("photography")
        .insert(photo)
        .select();

      if (error) {
        console.error(`❌ Error al insertar "${photo.title}":`, error.message);
        errors.push({ photo, error });
      } else {
        console.log(`✅ Insertada: ${photo.title} (ID: ${data[0].id})`);
        insertedPhotos.push(data[0]);
      }
    }

    console.log("");
    console.log("📊 Resumen de inserción:");
    console.log(`✅ Fotografías insertadas: ${insertedPhotos.length}`);
    console.log(`❌ Errores: ${errors.length}`);

    if (insertedPhotos.length > 0) {
      console.log("");
      console.log("📋 Fotografías insertadas:");
      insertedPhotos.forEach((photo, index) => {
        console.log(`   ${index + 1}. ${photo.title}`);
        console.log(`      - Precio: $${photo.price}`);
        console.log(`      - Ubicación: ${photo.location}`);
        console.log(`      - Fecha: ${photo.date || "Sin fecha"}`);
        console.log(`      - Etiquetas: ${(photo.tags || []).join(", ")}`);
      });
    }

    if (errors.length > 0) {
      console.log("");
      console.log("❌ Errores encontrados:");
      errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.photo.title}: ${error.error.message}`);
      });
    }

    console.log("");
    console.log("🎉 ¡Datos de ejemplo agregados!");
    console.log("");
    console.log("🔗 Próximos pasos:");
    console.log("1. Ve a http://localhost:4322/fotografia");
    console.log("2. Verifica que se muestran las nuevas fotografías");
    console.log("3. Prueba los filtros por etiquetas");
    console.log("4. Comprueba la visualización de fechas opcionales");
    console.log("");
    console.log("💡 Datos agregados:");
    console.log(`   - ${insertedPhotos.length} nuevas fotografías`);
    console.log(`   - Variedad de etiquetas para probar filtros`);
    console.log(`   - Una fotografía sin fecha para probar opcionalidad`);
    console.log(`   - Diferentes ubicaciones y precios`);

  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
addSamplePhotography()
  .then(() => {
    console.log("\n✅ Script completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exit(1);
  }); 