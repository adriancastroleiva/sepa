// Utility: DMS conversion
function toDMS(val, isLat = true) {
  const deg = Math.floor(Math.abs(val));
  const minFloat = (Math.abs(val) - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = (minFloat - min) * 60;
  const hemi = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
  return `${deg}° ${min}' ${sec.toFixed(2)}" ${hemi}`;
}

// -------- Option 1: Launch OsmAnd (Plus preferred) --------
function openOsmAnd(lat = 43.36, lon = -5.84, zoom = 15) {
  try {
    // Try OsmAnd custom scheme first
    const scheme = `osmand://show_map?lat=${lat}&lon=${lon}&z=${zoom}`;
    window.location.href = scheme;

    // As a robust fallback, use Android intent targeting OsmAnd Plus, then standard OsmAnd, then geo:.
    setTimeout(() => {
      // Try OsmAnd Plus
      const intentPlus = `intent://show_map?lat=${lat}&lon=${lon}&z=${zoom}#Intent;scheme=osmand;package=net.osmand.plus;end`;
      window.location.href = intentPlus;

      setTimeout(() => {
        // Try OsmAnd standard package
        const intentStd = `intent://show_map?lat=${lat}&lon=${lon}&z=${zoom}#Intent;scheme=osmand;package=net.osmand;end`;
        window.location.href = intentStd;

        setTimeout(() => {
          // Last resort: geo:
          const geo = `geo:${lat},${lon}?z=${zoom}`;
          window.location.href = geo;
        }, 600);
      }, 600);
    }, 600);
  } catch (e) {
    console.error('Error opening OsmAnd:', e);
  }
}

// -------- Option 2: Open Google My Maps in Google Maps app if possible --------
function openMyMaps() {
  const url = 'https://www.google.com/maps/d/edit?mid=1QgMMRz19UxEE1yY9T1Sptjj-2aQvHRs&usp=sharing';
  try {
    // Try to force open with the Maps package via intent
    const intent = `intent://${url.replace('https://','')}#Intent;scheme=https;package=com.google.android.apps.maps;end`;
    window.location.href = intent;

    // Fallback to https (browser if app can't handle the My Maps link)
    setTimeout(() => {
      window.location.href = url;
    }, 800);
  } catch (e) {
    window.location.href = url;
  }
}

// -------- Option 3: Get coordinates and (optionally) save locally --------
async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocalización no soportada'));
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    });
  });
}

async function handleGPS() {
  const out = document.getElementById('gps-output');
  const name = document.getElementById('gps-name').value.trim();
  out.textContent = 'Obteniendo posición...';
  try {
    const pos = await getCurrentPosition();
    const { latitude, longitude } = pos.coords;
    const latDec = latitude.toFixed(6);
    const lonDec = longitude.toFixed(6);
    const latDMS = toDMS(latitude, true);
    const lonDMS = toDMS(longitude, false);
    out.innerHTML = `<b>Decimal:</b> ${latDec}, ${lonDec}<br><b>Sexagesimal:</b> ${latDMS} — ${lonDMS}`;

    // Save locally (Option 3 local log) with placeholder for future Google Sheets integration
    const payload = {
      name: name || null,
      latitude: latitude,
      longitude: longitude,
      lat_decimal: latDec,
      lon_decimal: lonDec,
      lat_dms: latDMS,
      lon_dms: lonDMS,
      createdAt: new Date().toISOString()
    };
    await SepaDB.addGPS(payload);

    // Placeholder for Google Sheets endpoint (to be configured later)
    // TODO: Implement Google Sheets POST (Apps Script / Sheets API) here.
  } catch (e) {
    out.textContent = 'Error: ' + e.message;
  }
}

// -------- Option 5: Local form with photos, stored in IndexedDB --------
function fileListToDataURLs(fileList) {
  const promises = [];
  for (const f of fileList) {
    promises.push(new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: f.name, type: f.type, dataURL: reader.result });
      reader.readAsDataURL(f);
    }));
  }
  return Promise.all(promises);
}

async function handleLocalFormSave(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    nombre: form.nombre.value.trim(),
    dni: form.dni.value.trim(),
    direccion: form.direccion.value.trim(),
    vehiculo: form.vehiculo.value.trim(),
    matricula: form.matricula.value.trim(),
    fotos: [],
    createdAt: new Date().toISOString()
  };
  const files = form.fotos.files;
  if (files && files.length > 0) {
    data.fotos = await fileListToDataURLs(files);
  }
  await SepaDB.addRecord(data);
  form.reset();
  alert('Registro guardado localmente.');
}

// -------- Option 6: Render saved records --------
async function renderSavedRecords() {
  const container = document.getElementById('saved-records');
  container.innerHTML = 'Cargando...';
  const items = await SepaDB.getAllRecords();
  if (!items.length) {
    container.textContent = 'No hay registros guardados todavía.';
    return;
  }
  const parts = [];
  items.sort((a,b)=> (a.createdAt<b.createdAt?1:-1));
  for (const it of items) {
    parts.push(`<div class="card">
      <div class="card-title">Registro #${it.id || ''}</div>
      <div class="card-body">
        <p><b>Nombre:</b> ${it.nombre || ''}</p>
        <p><b>DNI:</b> ${it.dni || ''}</p>
        <p><b>Dirección:</b> ${it.direccion || ''}</p>
        <p><b>Vehículo:</b> ${it.vehiculo || ''}</p>
        <p><b>Matrícula:</b> ${it.matricula || ''}</p>
        <p><b>Fecha:</b> ${new Date(it.createdAt).toLocaleString()}</p>
        ${Array.isArray(it.fotos) && it.fotos.length ? `<div class="photo-grid">` + it.fotos.map(f=>`<img src="${f.dataURL}" alt="${f.name}" />`).join('') + `</div>` : ''}
      </div>
    </div>`);
  }
  container.innerHTML = parts.join('\n');
}

// Nav routing (simple hash router inside single page)
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
  if (id === 'view-saved') renderSavedRecords();
}

window.SepaApp = { openOsmAnd, openMyMaps, handleGPS, handleLocalFormSave, showView };