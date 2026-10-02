# Protocolos de Seguridad del Paciente
**ESE Municipal de Villavicencio × Universidad de los Llanos**

Aplicación web para la capacitación y evaluación del personal de la
ESE Municipal de Villavicencio en cuatro protocolos independientes: Código Azul,
Carro de Paro, Ronda de Seguridad y Recibo y Entrega de Turno.

## Características

- **Cuatro protocolos independientes**: cada uno tiene sus módulos, su evaluación,
  sus 3 intentos. Se avanza de uno en uno, sin bloquearse entre sí.
- **Autenticación**: Google Sign-In (Identity Services). En entorno local se habilita
  un modo demo para pruebas.
- **Sin formularios repetidos**: el nombre y el correo se toman de la cuenta de Google.
  Solo se elige **sede** y **cargo** una vez, y quedan guardados.
- **Evaluación con las preguntas oficiales**: 30 preguntas tomadas textualmente de los
  documentos de evaluación institucionales (10 + 10 + 5 + 5). No se inventan preguntas.
- **Calificación exigente**: 80 % mínimo para aprobar, con 3 intentos por protocolo.
- **Lectura obligatoria antes de evaluar**: cada módulo se avanza sección por sección.
  Mientras falte una sección por marcar, la evaluación del protocolo queda bloqueada.
- **Editor de perfil**: teléfono, dónde trabaja y a qué se dedica, editables cuando la
  persona quiera. El nombre y el correo siguen viniendo de Google.
- **Panel administrativo** (`admin.html`): acceso con contraseña maestra validada en el
  servidor. Muestra el avance de lectura, el tiempo de estudio en cada módulo y las
  notas de cada protocolo, y permite borrar el progreso de una persona.
- **PDF de cada procedimiento**: enlace al documento oficial original en la tarjeta de
  cada protocolo y en la cabecera de cada módulo, para consultar si se quiere.
- **Registro institucional**: `registro.html` lista quién entró y qué nota obtuvo en cada
  protocolo (intentos aprobados y no aprobados), protegido por un código de acceso
  validado en el servidor. Exportable a CSV.
- **Notificaciones tipo pestaña**: los avisos (módulo leído, sesión iniciada,
  aprobación, errores) aparecen como pestañas flotantes en lugar de `alert`.
- **Almacenamiento**: local en `localStorage` como respaldo; opcionalmente se envían
  los resultados al backend de Google Apps Script para registro central y verificación.
- **Responsive**: adaptado a escritorio, tablet y móvil.

## Los cuatro protocolos

| # | Protocolo | Módulos | Preguntas | Horas | PDF |
|---|---|---|---|---|---|
| 1 | Código Azul | 1-5 | 10 | 2 | `assets/pdf/codigo-azul.pdf` |
| 2 | Carro de Paro | 6-7 | 10 | 1 | `assets/pdf/carro-paro.pdf` |
| 3 | Ronda de Seguridad | 8 | 5 | 0,5 | `assets/pdf/ronda-seguridad.pdf` |
| 4 | Recibo y Entrega de Turno | 9 | 5 | 0,5 | `assets/pdf/entrega-turno.pdf` |

La lista completa (id, número, sigla, módulos, temas, horas y PDF) está en
`assets/js/config.js` → `protocolos`. Cada módulo y cada tema declara su `protocolo`.

## Rutas

- `index.html` — portada, ingreso con Google y selección única de sede y cargo.
- `protocolos.html` — índice de los 4 protocolos con el estado y el PDF de cada uno.
- `modulo.html?n=5&p=codigo-azul` — lector de un módulo.
- `evaluacion.html?p=codigo-azul` — cuestionario de **un** protocolo.
- `resultado.html?p=codigo-azul` — resultado e historial de ese protocolo.
- `perfil.html` — editor de los datos de la persona.
- `registro.html` — registro institucional (requiere código de acceso).
- `admin.html` — panel administrativo (requiere la contraseña maestra).

El parámetro `?p=` es obligatorio al abrir una evaluación o un resultado directamente;
si falta, la aplicación recuerda el último protocolo visitado.

## Datos del participante

Al entrar con Google, la ficha se crea sola con tu nombre y tu correo: **no se vuelven
a escribir**. Lo único que se elige es la **sede** (hoy `CAMPUS ESE MUNICIPAL`) y el
**cargo**, una sola vez, desde dos selectores definidos en `CONFIG.sedes` y
`CONFIG.cargos`. Para agregar más sedes o cargos, edita esas dos listas en
`assets/js/config.js` y aparecerán automáticamente.

El registro imprime únicamente lo que la persona eligió: nada de "Centro de Salud
Recreo" ni ningún dato que no se haya escrito.

## Requisitos para producción

1. **Google Cloud OAuth 2.0 Client ID**
   - Crear un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
   - Configurar `OAuth 2.0 Client ID` (tipo *Web application*).
   - Orígenes autorizados de JavaScript: el dominio de publicación
     (ej. `https://capacitacion.esevillavicencio.gov.co`) y `http://localhost:8000`
     mientras se prueba en local.
   - Copiar el `Client ID` en `assets/js/config.js` → `googleClientId`.

2. **Google Apps Script (recomendado)**
   - Abrir [script.google.com](https://script.google.com/) → *Nuevo proyecto*.
   - Pegar el contenido de `apps-script/Code.gs` en el editor.
   - En *Configuración del proyecto*, activar «Mostrar el archivo `appsscript.json»» y
     sustituir su contenido por `apps-script/appsscript.json`.
   - Poner en `CLAVE` (inicio de `Code.gs`) el código de acceso del registro
     institucional, y en `CLAVE_ADMIN` la contraseña maestra del panel.
     **Cambia las dos antes de publicar.**
   - Ejecutar una vez la función `crearHojas()` y aceptar los permisos.
   - Implementar → Nueva implementación → *Aplicación web* → Ejecutar como: *Yo* →
     Quién tiene acceso: *Cualquier persona*.
   - Copiar la URL que termina en `/exec` en `config.js` → `appsScriptUrl`.
   - Definir `almacenamiento: "sheet"` para enviar registros y resultados.
   - Opcional: definir `appsScriptSecret` en `config.js` con la misma clave de `CLAVE`
     para que solo este sitio pueda escribir en la hoja.

   La hoja queda con tres pestañas: `Participantes` (ficha), `Resultados` (cada intento,
   con su nota) y `Progreso` (secciones leídas y tiempo por módulo).

3. **Logos y colores**
   - Los logos oficiales ya están en `assets/logos/eselogo.jpg` y
     `assets/logos/Logo_unillanos1.png`.
   - El logo de la Universidad de los Llanos es blanco: se invierte por CSS
     (`.logo-unillanos`) para que sea legible sobre fondo claro.
   - La paleta institucional (`#306090`, `#C03060`, `#E0C000`) está en
     `config.js` y en las variables CSS.

4. **Hosting**
   - El sitio es estático (HTML, CSS, JS). Puede publicarse en GitHub Pages,
     Netlify, Vercel, Firebase Hosting o en un servidor propio.
   - Debe servirse por **HTTPS**: es un requisito de Google Identity Services.
   - Los PDF de `assets/pdf/` están optimizados (de 54 MB a 3,3 MB) y conservan
     la capa de texto, así que se pueden buscar y copiar.

## Configuración (`assets/js/config.js`)

| Campo | Descripción |
|---|---|
| `googleClientId` | Client ID de Google OAuth. Vacío = modo demo (solo `localhost` / `127.0.0.1`). |
| `protocolos` | Definición de los 4 protocolos: id, número, sigla, nombre, módulos, temas, horas, color y PDF. |
| `programa.notaAprobacion` | Porcentaje mínimo para aprobar (80). |
| `programa.intentosMaximos` | Máximos intentos **por protocolo** (3). |
| `codigo.prefijo` | Prefijo de los códigos de seguimiento (`ESE-VLL`). |
| `sedes` | Sedes que puede elegir la persona. |
| `cargos` | Cargos que puede elegir la persona. |
| `almacenamiento` | `local` o `sheet`. |
| `appsScriptUrl` | URL `/exec` de Google Apps Script. |
| `appsScriptSecret` | Clave compartida para autorizar escrituras. |

## Desarrollo local

```bash
npx http-server -p 8000 -c-1
```

Abrir `http://localhost:8000`. El modo demo se activa solo cuando `googleClientId`
está vacío y la URL es local.

## Registro institucional y panel administrativo y panel administrativo

`registro.html` pide un código de acceso que **se valida en Google Apps Script**:
no está escrito en el código del sitio. Permite filtrar por protocolo, rango de
fechas y texto libre, y exportar el listado a CSV.

`admin.html` es el panel de la coordinación. Pide la contraseña maestra, que se
compara **en el servidor** (`CLAVE_ADMIN` en `apps-script/Code.gs`) y devuelve un
token de sesión válido por 8 horas. Desde ahí se ve, por cada persona: qué secciones
leyó de cada módulo, cuánto tiempo estuvo en cada uno, y qué nota obtuvo en cada
protocolo. También permite borrar todo el progreso de una persona (se conserva la
ficha con nombre, sede y cargo).

> Con `almacenamiento: "local"` el panel solo ve los datos de ese mismo navegador.
> Para ver el progreso de todos hay que desplegar el Apps Script y poner la URL en
> `CONFIG.appsScriptUrl`.

## Notas de seguridad

- No se almacenan contraseñas: la autenticación es únicamente Google Identity Services.
- El código del registro institucional no se distribuye en `config.js`; si se
  escribiera ahí, cualquiera que abriera la página podría leerlo.
- `appsScriptSecret` es un token anti-abuso para impedir escrituras no autorizadas; si
  el repositorio es público, conviene rotarlo antes de publicar.
- La contraseña maestra del panel **no** está en el sitio: se compara en `Code.gs`
  (`CLAVE_ADMIN`). Si estuviera en un archivo del navegador, cualquiera que mirara el
  código fuente la leería.
- Los resultados permanecen en el `localStorage` del participante; solo se envían al
  servidor si se configura `appsScriptUrl`.

## Estructura

```
index.html          portada, ingreso y registro
protocolos.html     índice de los 4 protocolos
modulo.html         lector de módulos
evaluacion.html     cuestionario de un protocolo
resultado.html      resultado e historial de un protocolo
perfil.html         editor de datos de la persona
admin.html          panel administrativo (contraseña maestra)
registro.html       registro institucional (código de acceso)
curso.html          redirige a protocolos.html (compatibilidad)
assets/js/config.js       configuración central y definición de protocolos
assets/js/app.js          sesión, almacenamiento, protocolos, utilidades
assets/js/preguntas.js    banco de 30 preguntas oficiales (4 temas)
assets/js/contenido.js    contenido de los 9 módulos
assets/js/evaluacion.js   motor del cuestionario por protocolo
assets/js/resultado.js    vista de resultados por protocolo
assets/js/perfil.js       editor de perfil
assets/js/admin.js        panel administrativo
assets/js/registro.js     registro institucional con notas por persona
assets/css/estilos.css    estilos (incluye impresión)
assets/pdf/               procedimientos oficiales en PDF
apps-script/Code.gs       backend opcional (Google Sheets)
```

## Créditos

**Entidad de Salud:** ESE Municipal de Villavicencio
**Institución Académica:** Universidad de los Llanos
**Fuente del contenido:** procedimientos y protocolos institucionales suministrados
por la ESE Municipal de Villavicencio.
