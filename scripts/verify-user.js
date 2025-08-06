#!/usr/bin/env node

// Script para verificar usuario y credenciales
// Uso: node scripts/verify-user.js

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
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Variables de entorno de Supabase no encontradas");
  process.exit(1);
}

if (!adminEmail || !adminPassword) {
  console.error("❌ Error: Variables de entorno de admin no encontradas");
  process.exit(1);
}

// Crear cliente de Supabase con service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyUser() {
  console.log("🔍 Verificando usuario admin...");
  console.log(`📧 Email: ${adminEmail}`);

  try {
    // 1. Listar usuarios para ver si existe
    console.log("📝 Buscando usuario en la base de datos...");
    const {
      data: { users },
      error: listError,
    } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Error al listar usuarios:", listError.message);
      process.exit(1);
    }

    const existingUser = users.find((user) => user.email === adminEmail);

    if (!existingUser) {
      console.log("❌ Usuario no encontrado en la base de datos");
      console.log("💡 Ejecuta: ./scripts/create-admin.sh");
      process.exit(1);
    }

    console.log("✅ Usuario encontrado en la base de datos");
    console.log(`   ID: ${existingUser.id}`);
    console.log(`   Email: ${existingUser.email}`);
    console.log(
      `   Email confirmado: ${existingUser.email_confirmed_at ? "Sí" : "No"}`
    );
    console.log(`   Último login: ${existingUser.last_sign_in_at || "Nunca"}`);

    // 2. Verificar perfil en la tabla profiles
    console.log("\n📝 Verificando perfil en la tabla profiles...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", existingUser.id)
      .single();

    if (profileError) {
      console.log("❌ Perfil no encontrado en la tabla profiles");
      console.log("💡 El perfil se puede crear manualmente");
    } else {
      console.log("✅ Perfil encontrado en la tabla profiles");
      console.log(`   Nombre: ${profile.name}`);
      console.log(`   Email: ${profile.email}`);
    }

    // 3. Probar login con las credenciales
    console.log("\n🔐 Probando login con las credenciales...");
    const {
      data: { user },
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (signInError) {
      console.error("❌ Error al hacer login:", signInError.message);
      console.log("");
      console.log("💡 Posibles soluciones:");
      console.log("1. Verifica que la contraseña sea correcta");
      console.log("2. El usuario puede estar bloqueado");
      console.log("3. Puede necesitar confirmación de email");
      console.log("");
      console.log("🔧 Para resetear la contraseña:");
      console.log("   - Ve al dashboard de Supabase");
      console.log("   - Authentication > Users");
      console.log('   - Encuentra el usuario y haz clic en "..."');
      console.log('   - Selecciona "Reset password"');
    } else {
      console.log("✅ Login exitoso!");
      console.log(`   Usuario autenticado: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log("");
      console.log("🎉 Las credenciales son correctas");
      console.log("💡 Puedes acceder al panel de administración");
    }
  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
verifyUser()
  .then(() => {
    console.log("\n✅ Verificación completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exit(1);
  });
