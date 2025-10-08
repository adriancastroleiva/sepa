# SEPA Bomberos — PWA (forzada a OsmAnd Plus, sin abrir Play Store)

- Botón de **Mapa de Recursos** es un `<a href="intent://...">` con `scheme=geo` y `package=net.osmand.plus`.
- Así Android lanza **OsmAnd+ directo** (sin chooser y sin Play Store).
- Fallback `geo:` si el Intent no salta en ~700 ms.

Despliegue: subir a GitHub Pages/Netlify. Editar `config.js` si cambian parque/lat/lon o si algún móvil usa `net.osmand`.

Generado: 2025-10-08T16:18:00.024729Z
