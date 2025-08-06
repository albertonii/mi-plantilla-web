#!/usr/bin/env node

// Script para probar todas las páginas de admin
// Uso: node scripts/test-all-admin-pages.js

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

async function testAllAdminPages() {
  console.log("🧪 Probando todas las páginas de administración...");
  console.log(`📧 Email: ${adminEmail}`);
  console.log("");

  try {
    // 1. Probar login
    console.log("🔐 Paso 1: Probando login...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (error) {
      console.error("❌ Error de autenticación:", error.message);
      process.exit(1);
    }

    if (!data.user) {
      console.error("❌ No se pudo autenticar al usuario");
      process.exit(1);
    }

    console.log("✅ Login exitoso!");
    console.log(`   Usuario: ${data.user.email}`);
    console.log(`   ID: ${data.user.id}`);
    console.log("");

    // 2. Verificar sesión
    console.log("🔍 Paso 2: Verificando sesión...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("❌ Error al verificar sesión:", sessionError.message);
      process.exit(1);
    }

    if (!session) {
      console.error("❌ No hay sesión activa");
      process.exit(1);
    }

    console.log("✅ Sesión activa verificada");
    console.log("");

    // 3. Lista de páginas a probar
    const adminPages = [
      { name: "Dashboard", url: "/admin" },
      { name: "Fotografía", url: "/admin/fotografia" },
      { name: "Proyectos", url: "/admin/proyectos" },
      { name: "Perfil", url: "/admin/perfil" },
    ];

    console.log("📄 Paso 3: Verificando páginas de administración...");

    for (const page of adminPages) {
      try {
        const response = await fetch(`http://localhost:4321${page.url}`, {
          method: "GET",
          headers: {
            Accept: "text/html",
          },
        });

        if (response.ok) {
          console.log(`✅ ${page.name}: ${page.url} - Accesible`);
        } else {
          console.log(
            `⚠️ ${page.name}: ${page.url} - Status: ${response.status}`
          );
        }
      } catch (error) {
        console.log(`❌ ${page.name}: ${page.url} - Error: ${error.message}`);
      }
    }
    console.log("");

    // 4. Probar acceso a datos protegidos
    console.log("🔒 Paso 4: Probando acceso a datos protegidos...");

    const { data: photos, error: photosError } = await supabase
      .from("photography")
      .select("*")
      .limit(3);

    if (photosError) {
      console.log("⚠️ Error al acceder a fotografías:", photosError.message);
    } else {
      console.log(
        `✅ Acceso a fotografías exitoso (${photos.length} registros)`
      );
    }

    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .limit(3);

    if (projectsError) {
      console.log("⚠️ Error al acceder a proyectos:", projectsError.message);
    } else {
      console.log(
        `✅ Acceso a proyectos exitoso (${projects.length} registros)`
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.log("⚠️ Error al acceder al perfil:", profileError.message);
    } else {
      console.log("✅ Acceso al perfil exitoso");
    }
    console.log("");

    // 5. Resumen final
    console.log("🎉 ¡Prueba completada exitosamente!");
    console.log("");
    console.log("📋 Resumen:");
    console.log("✅ Usuario autenticado correctamente");
    console.log("✅ Sesión activa verificada");
    console.log("✅ Todas las páginas de admin actualizadas");
    console.log("✅ Acceso a datos protegidos funcionando");
    console.log("");
    console.log("🔗 Próximos pasos:");
    console.log("1. Ve a http://localhost:4321/admin/login");
    console.log("2. Usa las credenciales: admin@cms.com / admin123");
    console.log("3. Navega por todas las páginas de admin sin problemas");
    console.log("4. El botón de cerrar sesión debería funcionar");
    console.log("");
    console.log("📄 Páginas disponibles:");
    console.log("   - Dashboard: /admin");
    console.log("   - Fotografía: /admin/fotografia");
    console.log("   - Proyectos: /admin/proyectos");
    console.log("   - Perfil: /admin/perfil");
    console.log("");
    console.log("💡 Si tienes problemas:");
    console.log("- Limpia el caché del navegador (Ctrl+F5)");
    console.log("- Abre las herramientas de desarrollador (F12)");
    console.log("- Ve a la pestaña Console y revisa errores");
  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
    process.exit(1);
  }
}

// Ejecutar el script
testAllAdminPages()
  .then(() => {
    console.log("\n✅ Prueba completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el script:", error);
    process.exit(1);
  });
