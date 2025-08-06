#!/usr/bin/env node

// Script para probar el login
// Uso: node scripts/test-login.js

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

// Crear cliente de Supabase con anon key (como en el frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log("🧪 Probando login con credenciales de admin...");
  console.log(`📧 Email: ${adminEmail}`);
  console.log("");

  try {
    console.log("🔐 Intentando autenticación...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      console.error("❌ Error de autenticación:", error.message);
      console.log("");
      console.log("💡 Posibles soluciones:");
      console.log("1. Verifica que las credenciales sean correctas");
      console.log("2. El usuario puede estar bloqueado");
      console.log("3. Puede necesitar confirmación de email");
      process.exit(1);
    }

    if (data.user) {
      console.log("✅ Login exitoso!");
      console.log(`   Usuario: ${data.user.email}`);
      console.log(`   ID: ${data.user.id}`);
      console.log(
        `   Email confirmado: ${data.user.email_confirmed_at ? "Sí" : "No"}`
      );
      console.log("");
      console.log("🎉 Las credenciales funcionan correctamente");
      console.log("💡 Puedes usar estas credenciales en la aplicación web");
      console.log("");
      console.log("🔗 Próximos pasos:");
      console.log("1. Ve a http://localhost:4321/admin/login");
      console.log("2. Usa las mismas credenciales");
      console.log("3. Deberías poder acceder al panel de administración");
    } else {
      console.error("❌ No se pudo autenticar al usuario");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
testLogin()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exit(1);
  });
