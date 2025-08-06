// Servicio de autenticación para el panel de administración
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configurar Supabase
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Variables de entorno de Supabase no encontradas");
  throw new Error("Supabase configuration not found");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verificar si el usuario está autenticado
export async function checkAuth() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("❌ Error al verificar sesión:", error.message);
      return { isAuthenticated: false, user: null, error };
    }

    if (!session) {
      return { isAuthenticated: false, user: null, error: null };
    }

    return { isAuthenticated: true, user: session.user, error: null };
  } catch (error) {
    console.error("❌ Error inesperado:", error);
    return { isAuthenticated: false, user: null, error };
  }
}

// Redirigir a login si no está autenticado
export async function requireAuth() {
  const { isAuthenticated, user, error } = await checkAuth();

  if (!isAuthenticated) {
    console.log("❌ Usuario no autenticado, redirigiendo a login...");
    window.location.href = "/admin/login";
    return null;
  }

  console.log("✅ Usuario autenticado:", user.email);

  // Guardar información del usuario en localStorage
  localStorage.setItem(
    "admin-user",
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || "Administrador",
    })
  );

  return user;
}

// Cerrar sesión
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ Error al cerrar sesión:", error.message);
      return { success: false, error };
    }

    // Limpiar localStorage
    localStorage.removeItem("admin-user");

    console.log("✅ Sesión cerrada exitosamente");
    return { success: true, error: null };
  } catch (error) {
    console.error("❌ Error inesperado:", error);
    return { success: false, error };
  }
}

// Obtener usuario actual desde localStorage
export function getCurrentUser() {
  try {
    const userData = localStorage.getItem("admin-user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    return null;
  }
}
