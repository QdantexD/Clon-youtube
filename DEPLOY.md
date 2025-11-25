# 🚀 Guía de Despliegue en GitHub Pages

Esta guía te ayudará a desplegar tu Clon de YouTube en GitHub Pages.

## 📋 Requisitos Previos

- Cuenta de GitHub
- Repositorio creado en GitHub
- Git configurado en tu máquina local

## 🔧 Pasos para Desplegar

### Paso 1: Preparar el Repositorio

1. **Inicializar Git (si no lo has hecho)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Conectar con GitHub**
   ```bash
   git remote add origin https://github.com/tu-usuario/Clon-youtube.git
   git branch -M main
   git push -u origin main
   ```

### Paso 2: Configurar GitHub Pages

#### Opción A: Deploy Automático con GitHub Actions (Recomendado)

1. **Habilitar GitHub Pages**
   - Ve a tu repositorio en GitHub
   - Click en `Settings` > `Pages`
   - En `Source`, selecciona `GitHub Actions`
   - Guarda los cambios

2. **Hacer push de los cambios**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages"
   git push origin main
   ```

3. **Verificar el deploy**
   - Ve a la pestaña `Actions` en tu repositorio
   - Verás un workflow ejecutándose
   - Cuando termine, tu sitio estará disponible en:
     `https://tu-usuario.github.io/Clon-youtube/`

#### Opción B: Deploy Manual con gh-pages

1. **Instalar gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Desplegar**
   ```bash
   npm run deploy
   ```

3. **Configurar GitHub Pages**
   - Ve a `Settings` > `Pages`
   - En `Source`, selecciona la rama `gh-pages`
   - Tu sitio estará disponible en unos minutos

### Paso 3: Verificar el Deploy

1. Espera unos minutos para que GitHub procese el deploy
2. Visita: `https://tu-usuario.github.io/Clon-youtube/`
3. Si ves tu aplicación, ¡el deploy fue exitoso!

## ⚙️ Configuración Avanzada

### Cambiar el Nombre del Repositorio

Si tu repositorio tiene un nombre diferente a `Clon-youtube`, actualiza:

1. **vite.config.js**
   ```js
   base: process.env.NODE_ENV === 'production' ? '/tu-nombre-repo/' : '/',
   ```

2. **README.md** - Actualiza todas las referencias al nombre del repo

### Usar un Dominio Personalizado

1. Crea un archivo `CNAME` en la carpeta `public/`:
   ```
   tu-dominio.com
   ```

2. Configura DNS en tu proveedor de dominio:
   - Tipo: `CNAME`
   - Nombre: `@` o `www`
   - Valor: `tu-usuario.github.io`

## 🐛 Solución de Problemas

### El sitio muestra una página en blanco

- Verifica que el `base` en `vite.config.js` coincida con el nombre de tu repositorio
- Asegúrate de usar `HashRouter` en lugar de `BrowserRouter`

### Las rutas no funcionan

- GitHub Pages no soporta rutas del lado del servidor
- Usa `HashRouter` (ya configurado) para rutas con `#`

### El build falla

- Verifica que todas las dependencias estén instaladas: `npm install`
- Revisa los errores en la pestaña `Actions` de GitHub

### La API de YouTube no funciona

- GitHub Pages es público, así que tu API key será visible
- Considera usar variables de entorno o limitar la cuota de tu API key
- Para producción, usa un backend proxy para ocultar la API key

## 📝 Notas Importantes

- ⚠️ **API Key**: Si usas la API de YouTube, tu key será visible en el código. Considera limitar la cuota o usar un backend.
- 🔄 **Actualizaciones**: Cada push a `main` desplegará automáticamente (con GitHub Actions)
- 🌐 **HTTPS**: GitHub Pages usa HTTPS por defecto
- 📦 **Tamaño**: El build debe ser menor a 1GB

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en GitHub Pages. Si tienes problemas, revisa los logs en la pestaña `Actions` de tu repositorio.

