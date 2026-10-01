# Capacitación en Protocolos de Urgencias
**ESE Municipal de Villavicencio × Universidad de los Llanos**

Aplicación web para la capacitación, evaluación y certificación del personal de la ESE Municipal de Villavicencio en los protocolos de Código Azul, RCP, Carro de paro, Ronda de seguridad y Entrega de turno.

## Características

- **Autenticación**: Google Sign-In (Identity Services). En entorno local se habilita un modo demo para pruebas.
- **Evaluación estructurada**: 9 temas, 92 preguntas extraídas de los protocolos institucionales.
- **Calificación exigente**: 70% mínimo total y 60% mínimo por cada tema.
- **Máximo de intentos**: 3 intentos por participante.
- **Certificado**: se genera automáticamente al aprobar, imprimible/PDF, con código único de verificación.
- **Almacenamiento**: local en `localStorage` como respaldo; opcionalmente se envían los resultados al backend de Google Apps Script para registro central y verificación pública.
- **Responsive**: adaptado a escritorio, tablet y móvil.

## Requisitos para producción

1. **Google Cloud OAuth 2.0 Client ID**
   - Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
   - Configurar `OAuth 2.0 Client ID` (tipo Web application).
   - Orígenes autorizados de JavaScript: el dominio de publicación (ej. `https://cursos.esevillavicencio.gov.co`).
   - URI de redirección autorizada: el mismo dominio.
   - Copiar el `Client ID` en `assets/js/config.js` → `googleClientId`.

2. **Google Apps Script (opcional pero recomendado)**
   - Abrir [script.google.com](https://script.google.com/) → Nuevo proyecto.
   - Pegar el contenido de `apps-script/Code.gs` en el editor.
   - En *Configuración del proyecto*, activar «Mostrar el archivo `appsscript.json`» y sustituir su contenido por `apps-script/appsscript.json`.
   - Ejecutar una vez la función `crearHojas()` y aceptar los permisos.
   - Implementar → Nueva implementación → tipo *Aplicación web* → Ejecutar como: *Yo* → Quién tiene acceso: *Cualquier persona*.
   - Copiar la URL que termina en `/exec` en `config.js` → `appsScriptUrl`.
   - Definir una clave larga en `config.js` → `appsScriptSecret` y repetirla en `CLAVE`, al inicio de `Code.gs`.

3. **Logos oficiales**
   - Reemplazar `assets/logos/logo-ese.svg` y `assets/logos/logo-unillanos.svg` por los archivos oficiales de cada institución.

4. **Hosting**
   - El sitio es estático (HTML, CSS, JS). Puede publicarse en GitHub Pages, Netlify, Vercel, Firebase Hosting o en un servidor propio.
   - Debe servirse por **HTTPS**: es un requisito de Google Identity Services en producción.

## Configuración (`assets/js/config.js`)

| Campo | Descripción |
|---|---|
| `googleClientId` | Client ID de Google OAuth. Vacío = modo demo (solo `localhost` / `127.0.0.1`). |
| `appsScriptUrl` | URL `/exec` de Google Apps Script (opcional). |
| `appsScriptSecret` | Clave compartida para autorizar escrituras al backend. |
| `curso.notaAprobacion` | Porcentaje mínimo total (70). |
| `curso.notaPorTema` | Porcentaje mínimo por tema (60). |
| `curso.intentosMaximos` | Máximo de intentos permitidos (3). |
| `certificado.horas` | Intensidad horaria impresa en el certificado (4). |

## Desarrollo local

```bash
npx http-server -p 8000 -c-1
```

Abrir `http://localhost:8000`. El modo demo se activa solo cuando `googleClientId` está vacío y la URL es local.

## Verificación de certificados

Desde `certificado.html?verificar=CÓDIGO` o desde la sección **Verificar certificado** de esa misma página. Con el backend desplegado, la verificación consulta la hoja de cálculo; en local, busca en los resultados guardados en ese navegador.

## Notas de seguridad

- No se almacenan contraseñas: la autenticación es únicamente Google Identity Services.
- `appsScriptSecret` es un token anti-abuso para impedir escrituras no autorizadas; si el repositorio es público, conviene rotarlo antes de publicar.
- La acción `consulta` del backend es pública a propósito, para que cualquiera pueda validar un certificado.
- Los resultados permanecen en el `localStorage` del participante; solo se envían al servidor si se configura `appsScriptUrl`.

## Estructura

```
index.html          portada, login y registro
curso.html          índice de módulos
modulo.html         lector de módulos
evaluacion.html     cuestionario
resultado.html      detalle del resultado por intento
certificado.html    certificado imprimible + verificador
assets/js/config.js       configuración central
assets/js/app.js          sesión, almacenamiento, utilidades
assets/js/preguntas.js    banco de 92 preguntas
assets/js/contenido.js    contenido de los 9 módulos
assets/css/estilos.css    estilos (incluye impresión)
apps-script/Code.gs       backend opcional (Google Sheets)
```

## Créditos

**Entidad de Salud:** ESE Municipal de Villavicencio
**Institución Académica:** Universidad de los Llanos
**Curso:** Protocolos de Urgencias — Código Azul, Carro de paro, Ronda de seguridad y Entrega de turno