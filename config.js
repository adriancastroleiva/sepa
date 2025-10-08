// === Configuración SEPA (edita estos valores) ===
window.SEPA_CONFIG = {
  parque: "Avilés",                 // Nombre del parque por defecto
  dispositivoId: "Aviles-01",       // Identificador del móvil
  latDefault: 43.556,               // Para abrir mapa centrado
  lonDefault: -5.924,
  endpointURL: "",                  // URL de Apps Script si ya la tienes
  osmandPackage: "net.osmand",      // Cambia a "net.osmand.plus" si usan OsmAnd+
  // Procedimientos: lista de PDFs/imagenes accesibles por URL pública o intranet
  procedimientos: [
    { titulo: "PTS Incendios Urbanos", url: "Procedimientos/PTS_IncendiosUrbanos.pdf" },
    { titulo: "Forestales - Seguridad Transporte", url: "Procedimientos/Forestales_SegTransporte.pdf" },
    { titulo: "Checklist Helibalde", url: "Procedimientos/Checklist_Helibalde.jpg" }
  ]
};
