// === Configuración SEPA (edita estos valores) ===
window.SEPA_CONFIG = {
  osmandPackage: "net.osmand", // o "net.osmand.plus" si usan OsmAnd+
  parque: "Avilés",                 // Nombre del parque (aparece por defecto en formularios)
  dispositivoId: "Aviles-01",       // Identificador del móvil
  latDefault: 43.556,               // Para abrir mapa centrado
  lonDefault: -5.924,
  // Endpoint opcional para guardar datos en la nube (Google Apps Script, API propia, etc.)
  // Si se deja vacío, los registros quedarán en cola local hasta que configures el endpoint
  endpointURL: "",

  // Procedimientos: lista de PDFs/imagenes accesibles por URL pública o intranet
  procedimientos: [
    { titulo: "PTS Incendios Urbanos", url: "Procedimientos/PTS_IncendiosUrbanos.pdf" },
    { titulo: "Forestales - Seguridad Transporte", url: "Procedimientos/Forestales_SegTransporte.pdf" },
    { titulo: "Checklist Helibalde", url: "Procedimientos/Checklist_Helibalde.jpg" }
  ]
};

