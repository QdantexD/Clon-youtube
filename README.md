# 🎥 Clon de YouTube Avanzado

Un clon moderno y avanzado de YouTube construido con React, Vite y la API de YouTube. Este proyecto incluye características profesionales como modo oscuro, búsqueda en tiempo real, recomendaciones inteligentes, y una experiencia de usuario pulida.

> **Nota**: Este proyecto es desarrollado con fines **exclusivamente educativos** y para demostrar habilidades técnicas en desarrollo web moderno con React.

## ✨ Características Principales

### 🎯 Funcionalidades Core
- **Búsqueda en Tiempo Real**: Búsqueda funcional integrada con la API de YouTube
- **Reproductor de Video**: Reproductor completo con iframe de YouTube
- **Comentarios Dinámicos**: Comentarios reales cargados desde la API
- **Recomendaciones Inteligentes**: Videos relacionados basados en el video actual
- **Categorías**: Navegación por categorías (Gaming, Música, Tech, Deportes, etc.)

### 🎨 Mejoras de UI/UX
- **Modo Oscuro/Claro**: Toggle entre temas con persistencia en localStorage
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **Animaciones Suaves**: Transiciones y efectos hover mejorados
- **Loading States**: Skeletons y estados de carga elegantes
- **Manejo de Errores**: Mensajes de error amigables y recuperación

### 🔧 Funcionalidades Avanzadas
- **Context API**: Estado global para tema, usuario, suscripciones e historial
- **Suscripciones**: Sistema de suscripciones a canales con persistencia
- **Historial de Visualización**: Rastrea los videos vistos (hasta 50)
- **Compartir Videos**: Funcionalidad de compartir con Web Share API
- **Duración de Videos**: Muestra la duración en thumbnails
- **Estadísticas en Tiempo Real**: Views, likes, suscriptores desde la API

## 🚀 Tecnologías Utilizadas

- **React 18.3** - Biblioteca UI
- **Vite 5.4** - Build tool y dev server
- **React Router DOM 6.28** - Navegación
- **Moment.js 2.30** - Manejo de fechas
- **YouTube Data API v3** - Datos de videos, canales y comentarios
- **CSS3** - Estilos con variables CSS para temas

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd Clon-youtube
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar API Key de YouTube**
   - Obtén una API Key de [Google Cloud Console](https://console.cloud.google.com/)
   - Habilita la YouTube Data API v3
   - Actualiza `API_KEY` en `src/data.js` con tu clave

4. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   - Navega a `http://localhost:5173`

## 🚀 Despliegue en GitHub Pages

### Opción 1: Deploy Automático (Recomendado)

El proyecto está configurado con GitHub Actions para deploy automático:

1. **Habilitar GitHub Pages en tu repositorio**
   - Ve a `Settings` > `Pages` en tu repositorio de GitHub
   - En `Source`, selecciona `GitHub Actions`

2. **Hacer push a la rama main**
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages"
   git push origin main
   ```

3. **Esperar el deploy**
   - Ve a la pestaña `Actions` en tu repositorio
   - El workflow se ejecutará automáticamente
   - Una vez completado, tu sitio estará disponible en:
     `https://tu-usuario.github.io/Clon-youtube/`

### Opción 2: Deploy Manual

1. **Construir el proyecto**
   ```bash
   npm run build
   ```

2. **Instalar gh-pages (si no está instalado)**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Desplegar**
   ```bash
   npm run deploy
   ```

4. **Configurar GitHub Pages**
   - Ve a `Settings` > `Pages` en tu repositorio
   - En `Source`, selecciona la rama `gh-pages`
   - Tu sitio estará disponible en unos minutos

### ⚙️ Configuración del Base Path

Si tu repositorio tiene un nombre diferente a `Clon-youtube`, actualiza el `base` en `vite.config.js`:

```js
base: process.env.NODE_ENV === 'production' ? '/tu-nombre-repo/' : '/',
```

## 🏗️ Estructura del Proyecto

```
src/
├── Components/
│   ├── Feed/           # Grid de videos con búsqueda
│   ├── Navbar/         # Barra de navegación con búsqueda
│   ├── PlayVideo/      # Reproductor y detalles del video
│   ├── Recommend/      # Videos recomendados
│   └── Sidebar/        # Menú lateral con categorías
├── Pages/
│   └── Home/
│       ├── Home.jsx    # Página principal
│       └── Video/      # Página de video individual
├── context/
│   └── AppContext.jsx  # Context API para estado global
├── services/
│   └── youtubeApi.js   # Servicios de API de YouTube
├── assets/             # Imágenes y recursos
├── data.js             # Utilidades y configuración
└── App.jsx             # Componente principal
```

## 🎨 Temas y Personalización

El proyecto usa variables CSS para fácil personalización:

```css
:root {
  --primary-color: #c00;
  --text-color: #030303;
  /* ... más variables */
}

[data-theme="dark"] {
  --primary-color: #ff0000;
  --text-color: #fff;
  /* ... variables para modo oscuro */
}
```

## 📱 Responsive Design

- **Desktop**: Layout completo con sidebar y grid de videos
- **Tablet**: Sidebar colapsable, grid adaptativo
- **Mobile**: Sidebar oculto, diseño optimizado para touch

## 🔐 API Key de YouTube

**⚠️ Importante**: 
- No compartas tu API Key públicamente
- Considera usar variables de entorno para producción
- La API Key tiene límites de cuota diaria

Para producción, crea un archivo `.env`:
```
VITE_YOUTUBE_API_KEY=tu_api_key_aqui
```

Y actualiza `src/data.js` para leer desde `import.meta.env.VITE_YOUTUBE_API_KEY`

## 🚧 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Playlists personalizadas
- [ ] Notificaciones
- [ ] Filtros de búsqueda avanzados
- [ ] Subtítulos y traducciones
- [ ] Modo Picture-in-Picture
- [ ] PWA (Progressive Web App)

## 📄 Licencia

Este proyecto es desarrollado **únicamente para fines educativos** y como demostración de habilidades técnicas en desarrollo web moderno.

## 👨‍💻 Autor

**Eddi Andreé Salazar Matos**

Este proyecto fue desarrollado como una demostración de dominio en:
- Desarrollo Frontend con React
- Integración de APIs REST
- Gestión de estado con Context API
- Diseño responsive y UI/UX moderno
- Arquitectura de componentes escalable

---

**⚠️ Aviso Legal**: Este es un proyecto educativo. Respeta los términos de servicio de YouTube al usar su API. Este clon no está afiliado ni respaldado por YouTube o Google.
