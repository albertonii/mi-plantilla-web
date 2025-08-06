#!/usr/bin/env node

// Script simple para crear usuario admin
// Uso: node scripts/create-admin-user-simple.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Verificar variables de entorno
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Necesario para admin
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  console.log('Asegúrate de tener PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en tu archivo .env');
  console.log('');
  console.log('💡 Para obtener SUPABASE_SERVICE_ROLE_KEY:');
  console.log('1. Ve a tu dashboard de Supabase');
  console.log('2. Settings > API');
  console.log('3. Copia "service_role" key');
  process.exit(1);
}

if (!adminEmail || !adminPassword) {
  console.error('❌ Error: Variables de entorno de admin no encontradas');
  console.log('Asegúrate de tener ADMIN_EMAIL y ADMIN_PASSWORD en tu archivo .env');
  process.exit(1);
}

// Crear cliente de Supabase con service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  console.log('🚀 Creando usuario admin...');
  console.log(`📧 Email: ${adminEmail}`);

  try {
    // 1. Crear usuario en Auth
    console.log('📝 Creando usuario en Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Administrador'
      }
    });

    if (authError) {
      console.error('❌ Error al crear usuario en Auth:', authError.message);
      
      // Si el usuario ya existe, intentar obtenerlo
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  El usuario ya existe, intentando obtener información...');
        
        // Listar usuarios para encontrar el existente
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
          console.error('❌ Error al listar usuarios:', listError.message);
          process.exit(1);
        }
        
        const existingUser = users.find(user => user.email === adminEmail);
        if (existingUser) {
          console.log('✅ Usuario admin encontrado');
          console.log(`   ID: ${existingUser.id}`);
          console.log(`   Email: ${existingUser.email}`);
          return existingUser;
        }
      }
      
      process.exit(1);
    }

    console.log('✅ Usuario creado en Auth correctamente');

    // 2. Crear perfil en la tabla profiles
    console.log('📝 Creando perfil en la base de datos...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        name: 'Administrador',
        email: adminEmail,
        bio: 'Administrador del sistema',
        location: 'Sistema',
        website: '',
        github: '',
        linkedin: '',
        twitter: ''
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error al crear perfil:', profileError.message);
      console.log('ℹ️  El perfil se puede crear manualmente desde el dashboard');
    } else {
      console.log('✅ Perfil creado correctamente');
    }

    console.log('');
    console.log('🎉 ¡Usuario admin creado exitosamente!');
    console.log('');
    console.log('📋 Información del usuario:');
    console.log(`   ID: ${authData.user.id}`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Role: admin`);
    console.log('');
    console.log('🔗 Puedes acceder al panel de administración con estas credenciales');
    console.log('   URL: /admin/login');
    console.log('');

    return authData.user;

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
createAdminUser()
  .then(() => {
    console.log('✅ Script completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script:', error);
    process.exit(1);
  }); 