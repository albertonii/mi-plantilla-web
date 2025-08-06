# Portfolio Personal - Plantilla Web

Una plantilla web moderna y elegante para portfolio personal con galería de fotografía y showcase de proyectos, construida con Astro, Tailwind CSS y Supabase.

## 🚀 Características

- **Diseño Minimalista**: Paleta de colores oscuros con azules profundos y grises fríos
- **Responsive**: Optimizado para escritorio y móvil
- **Accesible**: Cumple con estándares de accesibilidad web
- **Performance**: Construido con Astro para máxima velocidad
- **CMS Integrado**: Panel de gestión privado (próximamente)
- **Galería de Fotografía**: Con opción de venta
- **Showcase de Proyectos**: Con filtros por tecnologías
- **Formulario de Contacto**: Funcional y accesible

## 🛠️ Tecnologías

- **Frontend**: [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com)
- **Backend**: [Supabase](https://supabase.com) (Auth, Database, Storage)
- **Tipografía**: Inter, Space Grotesk, DM Sans
- **Deploy**: Vercel/Netlify

## 📁 Estructura del Proyecto

```
mi-plantilla-web/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── layouts/            # Layouts base
│   ├── pages/              # Páginas principales
│   ├── services/           # Servicios de Supabase
│   ├── styles/             # Estilos globales
│   └── data/               # Datos y tipos
├── supabase/               # Configuración de Supabase
├── public/                 # Assets estáticos
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

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   ```
   http://localhost:4321
   ```

## ⚙️ Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Obtén tu URL y clave anónima
3. Configura las variables de entorno en `.env`
4. Crea las tablas necesarias en Supabase (próximamente)

## 📝 Páginas Incluidas

- **Inicio** (`/`): Presentación personal y habilidades
- **Fotografía** (`/fotografia`): Galería con filtros y opción de compra
- **Proyectos** (`/proyectos`): Showcase de proyectos con filtros
- **Contacto** (`/contacto`): Formulario de contacto funcional

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

## 🚧 Próximas Características

- [ ] CMS privado con autenticación
- [ ] Upload de imágenes con Supabase Storage
- [ ] Sistema de pagos con Stripe
- [ ] Blog integrado
- [ ] SEO avanzado
- [ ] PWA (Progressive Web App)

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
