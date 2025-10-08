# SEPA WebApp (PWA)

Webapp instalable pensada para Android, desplegable en GitHub Pages.

## Funciones
1. **Hidrantes y Puntos de agua** → Lanza la app Android **OsmAnd Plus** (con fallback a OsmAnd normal y `geo:`).
2. **Puntos Kilométricos** → Abre el mapa compartido de **Google My Maps** (intenta usar la app de Google Maps).
3. **Registrar Coordenadas** → Obtiene coordenadas (decimal y sexagesimal). Guarda localmente (IndexedDB). *Pendiente* enviar a Google Sheets.
4. **Procedimientos (PDF)** → Sección vacía para enlazar documentos PDF.
5. **Toma de datos** → Formulario local (IndexedDB) con campos: Nombre, DNI, Dirección, Vehículo, Matrícula y Fotos (múltiples).
6. **Ver datos guardados** → Lista los registros almacenados localmente con fotos.

## Despliegue en GitHub Pages
- Rama `main`: sube todo el contenido a la raíz o a `/docs`.
- Activa **GitHub Pages** y elige la ruta correcta.
- Abre la URL publicada y usa "Añadir a pantalla de inicio" en Android.

## Notas sobre Android intents
- OsmAnd Plus: paquete `net.osmand.plus`. Fallback a `net.osmand` y `geo:`.
- My Maps a veces abre en navegador; intentamos abrir con `com.google.android.apps.maps` via `intent://...` y luego fallback a `https://`.

## Google Sheets (pendiente)
- Implementar POST a Apps Script o API de Sheets en `app.js` dentro de `handleGPS()`.