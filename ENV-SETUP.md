# 🔧 Configuración de Variables de Entorno

Para crear el usuario admin y acceder al panel de administración, necesitas configurar las variables de entorno.

## 📁 Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Admin User Configuration
ADMIN_EMAIL=admin@tu-dominio.com
ADMIN_PASSWORD=Admin123!
```

## 🔑 Obtener las Keys de Supabase

### 1. PUBLIC_SUPABASE_URL

- Ve a tu dashboard de Supabase
- Copia la URL del proyecto (ej: `https://abcdefghijklmnop.supabase.co`)

### 2. PUBLIC_SUPABASE_ANON_KEY

- En el dashboard de Supabase, ve a **Settings > API**
- Copia la "anon" key

### 3. SUPABASE_SERVICE_ROLE_KEY

- En el dashboard de Supabase, ve a **Settings > API**
- Copia la "service_role" key (¡mantén esta segura!)

## 👤 Configurar Usuario Admin

### Opción A: Usar el script automático

```bash
# 1. Asegúrate de que el .env esté configurado
# 2. Ejecuta el script
./scripts/create-admin.sh
```

### Opción B: Crear manualmente desde el dashboard

1. Ve al dashboard de Supabase
2. Navega a **Authentication > Users**
3. Haz clic en **"Add user"**
4. Completa:
   - Email: `admin@tu-dominio.com`
   - Password: `Admin123!`
   - Marca "Auto-confirm email"

## 🚀 Acceder al Panel de Administración

1. Inicia tu aplicación:

   ```bash
   npm run dev
   ```

2. Ve a: `http://localhost:4321/admin/login`

3. Inicia sesión con:
   - Email: `admin@tu-dominio.com`
   - Password: `Admin123!`

## 🔒 Seguridad

- ✅ Cambia la contraseña del admin después del primer login
- ✅ Usa una contraseña fuerte
- ✅ No compartas las keys de Supabase
- ✅ Mantén el archivo .env fuera del control de versiones

## 🛠️ Solución de Problemas

### Error: "Variables de entorno no encontradas"

- Verifica que el archivo `.env` esté en la raíz del proyecto
- Asegúrate de que las variables estén escritas correctamente

### Error: "Service role key inválida"

- Verifica que hayas copiado la key completa
- Asegúrate de que sea la "service_role" key, no la "anon" key

### Error: "Usuario ya existe"

- El script detectará si el usuario ya existe
- Puedes usar las mismas credenciales para acceder

### Error: "No se puede crear perfil"

- El perfil se puede crear manualmente desde el dashboard
- Ve a **Table Editor > profiles** y añade el registro manualmente

## 📋 Verificación

Para verificar que todo funciona:

```bash
# 1. Verificar variables de entorno
echo $ADMIN_EMAIL
echo $ADMIN_PASSWORD

# 2. Crear usuario admin
./scripts/create-admin.sh

# 3. Iniciar aplicación
npm run dev

# 4. Acceder a /admin/login
```

¡Listo! Ahora puedes acceder al panel de administración. 🎉
