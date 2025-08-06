# Portfolio Personal - Plantilla Web con CMS

Una plantilla web moderna y elegante para portfolio personal con galería de fotografía, showcase de proyectos y **CMS privado integrado**, construida con Astro, Tailwind CSS y Supabase.

## 🚀 Características

### 🌐 Sitio Web Público
- **Diseño Minimalista**: Paleta de colores oscuros con azules profundos y grises fríos
- **Responsive**: Optimizado para escritorio y móvil
- **Accesible**: Cumple con estándares de accesibilidad web
- **Performance**: Construido con Astro para máxima velocidad
- **Galería de Fotografía**: Con filtros y opción de venta
- **Showcase de Proyectos**: Con filtros por tecnologías
- **Formulario de Contacto**: Funcional y accesible

### 🔐 CMS Privado
- **Autenticación Segura**: Login con Supabase Auth
- **Dashboard Interactivo**: Estadísticas y actividad reciente
- **Gestión de Fotografía**: CRUD completo con upload de imágenes
- **Gestión de Proyectos**: CRUD completo con tecnologías
- **Perfil de Usuario**: Edición de información personal
- **Notificaciones**: Sistema de alertas en tiempo real
- **Responsive**: Panel de administración adaptativo

## 🛠️ Tecnologías

- **Frontend**: [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com)
- **Backend**: [Supabase](https://supabase.com) (Auth, Database, Storage)
- **Tipografía**: Inter, Space Grotesk, DM Sans
- **Deploy**: Vercel/Netlify

## 📁 Estructura del Proyecto

```
mi-plantilla-web/
├── src/
│   ├── components/          # Componentes públicos
│   │   ├── Navigation.astro
│   │   └── Footer.astro
│   ├── components/admin/    # Componentes del CMS
│   │   ├── Sidebar.astro
│   │   ├── Header.astro
│   │   └── Notifications.astro
│   ├── layouts/            # Layouts públicos
│   │   └── BaseLayout.astro
│   ├── layouts/admin/      # Layouts del CMS
│   │   └── AdminLayout.astro
│   ├── pages/              # Páginas públicas
│   │   ├── index.astro
│   │   ├── fotografia.astro
│   │   ├── proyectos.astro
│   │   └── contacto.astro
│   ├── pages/admin/        # Páginas del CMS
│   │   ├── login.astro
│   │   ├── index.astro
│   │   ├── fotografia.astro
│   │   ├── proyectos.astro
│   │   └── perfil.astro
│   ├── services/           # Servicios de Supabase
│   │   └── supabase.ts
│   ├── styles/             # Estilos globales
│   │   └── global.css
│   └── data/               # Tipos y datos
│       └── types.ts
├── supabase/               # Configuración de Supabase
│   └── config.ts
└── README.md
```

## 🚀 Instalación

1. **Clona el repositorio**
   ```bash
   git clone [URL-del-repositorio]
   cd mi-plantilla-web
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales de Supabase
   ```

4. **Configura Supabase**
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Obtén tu URL y clave anónima
   - Configura las variables en `.env`
   - Crea las tablas necesarias (ver sección de configuración)

5. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abre tu navegador**
   ```
   http://localhost:4321
   ```

## ⚙️ Configuración de Supabase

### 1. Crear Proyecto
1. Ve a [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Obtén las credenciales de la pestaña "Settings" > "API"

### 2. Configurar Variables de Entorno
```env
PUBLIC_SUPABASE_URL=tu_url_de_supabase
PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 3. Crear Tablas (SQL)
```sql
-- Tabla de perfiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de fotografías
CREATE TABLE photography (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  price DECIMAL(10,2),
  location TEXT,
  date DATE NOT NULL,
  tags TEXT[],
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  technologies TEXT[],
  role TEXT NOT NULL,
  status TEXT DEFAULT 'planned' CHECK (status IN ('completed', 'in-progress', 'planned')),
  external_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de etiquetas
CREATE TABLE tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('photography', 'project')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contactos
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Configurar Storage
1. Ve a "Storage" en tu proyecto de Supabase
2. Crea buckets para:
   - `avatars` (para imágenes de perfil)
   - `photography` (para fotografías)
   - `projects` (para imágenes de proyectos)

### 5. Configurar Políticas de Seguridad
```sql
-- Políticas para perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para fotografías (públicas para lectura)
ALTER TABLE photography ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Photography is viewable by everyone" ON photography FOR SELECT USING (true);
CREATE POLICY "Only authenticated users can insert photography" ON photography FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can update photography" ON photography FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only authenticated users can delete photography" ON photography FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas similares para proyectos y contactos...
```

## 📝 Páginas Incluidas

### 🌐 Sitio Público
- **Inicio** (`/`): Presentación personal y habilidades
- **Fotografía** (`/fotografia`): Galería con filtros y opción de compra
- **Proyectos** (`/proyectos`): Showcase de proyectos con filtros
- **Contacto** (`/contacto`): Formulario de contacto funcional

### 🔐 CMS Privado
- **Login** (`/admin/login`): Autenticación de administrador
- **Dashboard** (`/admin`): Panel principal con estadísticas
- **Fotografía** (`/admin/fotografia`): Gestión de galería
- **Proyectos** (`/admin/proyectos`): Gestión de portfolio
- **Perfil** (`/admin/perfil`): Configuración personal

## 🎨 Personalización

### Colores
Los colores están definidos en `tailwind.config.js`:
- `primary-*`: Azules profundos
- `dark-*`: Grises fríos
- `gray-*`: Escala de grises

### Tipografía
- **Inter**: Texto general
- **Space Grotesk**: Títulos
- **DM Sans**: Texto alternativo

### Componentes
Los componentes están en `src/components/` y son fácilmente personalizables.

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run astro        # Comandos de Astro
```

## 📦 Deploy

### Vercel
```bash
npm run build
# Sube la carpeta dist/ a Vercel
```

### Netlify
```bash
npm run build
# Sube la carpeta dist/ a Netlify
```

## 🔐 Acceso al CMS

1. **Credenciales por defecto**:
   - Email: `admin@ejemplo.com`
   - Password: `admin123`

2. **Cambiar credenciales**:
   - Edita las variables en `.env`
   - O configura un usuario real en Supabase Auth

## 🚧 Próximas Características

- [ ] Sistema de pagos con Stripe
- [ ] Blog integrado
- [ ] SEO avanzado
- [ ] PWA (Progressive Web App)
- [ ] Analytics integrado
- [ ] Backup automático
- [ ] Multi-idioma

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Email**: tu-email@ejemplo.com
- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **LinkedIn**: [Tu Nombre](https://linkedin.com/in/tu-perfil)

---

Hecho con ❤️ usando [Astro](https://astro.build) y [Tailwind CSS](https://tailwindcss.com)
