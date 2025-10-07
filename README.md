# SEPA Bomberos — PWA (sin login, gratis)

Aplicación web instalable (PWA) con **menú**, **captura de coordenadas**, **procedimientos (PDF)** y **toma de datos**.
Funciona **offline** y puede **sincronizar** con un endpoint cuando haya conexión.

## 🧩 Estructura
- `index.html` — interfaz con 4 módulos
- `style.css` — estilo oscuro
- `app.js` — lógica de menú, GPS, formularios, cola offline y sincronización
- `config.js` — **edita aquí** nombre de parque, endpoint y lista de PDFs
- `manifest.webmanifest`, `sw.js` — PWA/offline
- `assets/icons/` — iconos de la app

## 🚀 Cómo probar en local
1. Sube esta carpeta a **SharePoint/OneDrive** o a cualquier servidor estático (Netlify, GitHub Pages, etc.).
2. Abre `index.html` desde HTTPS/servidor (para que Geolocalización funcione bien en móviles).
3. En móvil: **Añadir a pantalla de inicio** para instalar.

## ⚙️ Configuración básica
Edita `config.js`:
```js
window.SEPA_CONFIG = {
  parque: "Avilés",
  dispositivoId: "Aviles-01",
  latDefault: 43.556,
  lonDefault: -5.924,
  endpointURL: "", // ← cuando tengas el endpoint
  procedimientos: [
    { titulo: "PTS Incendios Urbanos", url: "Procedimientos/PTS_IncendiosUrbanos.pdf" }
  ]
};
```

- **Sin endpoint**: los registros se acumulan en el almacenamiento local. Pulsa **“Sincronizar”** cuando configures el endpoint.
- **Procedimientos**: coloca tus PDFs en una carpeta pública (SharePoint/OneDrive con enlace compartido o en el mismo servidor).

## 🌐 Abrir Mapa de Recursos
- Intenta abrir `osmand://show_map?lat=...&lon=...`.
- Si falla, usa `geo:lat,lon` (abre la app de mapas por defecto). Edita coordenadas por parque en `config.js`.

## 🛰️ Registrar coordenadas
- Botón **📍 Capturar y guardar** obtiene GPS (lat, lon, precisión) + `Parque`, `IncidenteID`, `Notas`.
- Se guarda **en cola local** y, si `endpointURL` está configurado, se **envía** en JSON:
```json
{ "kind": "marks", "rows": [ { "Timestamp": "...", "Parque": "...", "Coordenadas":"43.5,-5.9", "PrecisionM": 8, ... } ] }
```

## 📝 Parte de intervención
- Formulario con campos básicos y **foto opcional** (en Base64).
- Se guarda en cola y se envía (cuando haya endpoint) con JSON:
```json
{ "kind": "parts", "rows": [ { "ParteID": "P-...", "Parque":"...", "Coordenadas":"...", "FotoBase64":".../=" } ] }
```

## 🔌 Endpoint (ejemplo rápido con Google Apps Script → Google Sheets)
1. Crea un **Google Sheet** con dos hojas: `Marcas` y `Partes`.
2. En el menú: **Extensiones → Apps Script** y pega:

```javascript
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (body.kind === 'marks') {
      const sh = ss.getSheetByName('Marcas') || ss.insertSheet('Marcas');
      body.rows.forEach(r => {
        sh.appendRow([
          new Date(r.Timestamp), r.Parque, r.IncidenteID, r.Coordenadas, r.PrecisionM, r.DispositivoID, r.Notas
        ]);
      });
    }
    if (body.kind === 'parts') {
      const sh = ss.getSheetByName('Partes') || ss.insertSheet('Partes');
      body.rows.forEach(r => {
        sh.appendRow([
          r.ParteID, new Date(r.Timestamp), r.Parque, r.IncidenteID, r.VehiculoMatricula,
          r.ConductorNombre, r.ConductorDNI, r.Descripcion, r.Coordenadas, r.FotoName || '', r.FotoType || '', r.FotoBase64 ? ('LEN:' + r.FotoBase64.length) : ''
        ]);
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Deploy → New deployment → Web app**  
   - Who has access: **Anyone**  
   - Copia la **URL** y ponla en `config.js` → `endpointURL`.

> Para guardar archivos de foto en Drive, puedes ampliar el script para `Utilities.newBlob(Utilities.base64Decode(r.FotoBase64), r.FotoType, r.FotoName)` y subirlo a una carpeta, guardando el enlace en la hoja.

## 🔒 Privacidad
- Esta PWA no exige login. Identifica el origen por `parque`/`dispositivoId`. Para auditoría personal, habría que añadir login/certificado del dispositivo o usar MDM.

## 🛠️ Personalización rápida
- Cambia títulos y emojis de los botones en `index.html`.
- Añade procedimientos en `config.js`.
- Ajusta estilos en `style.css`.

---
Generado: 2025-10-07T12:15:35.002134Z
