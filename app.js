// app.js (ESM)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btn-install');
  btn.hidden = false;
  btn.onclick = async () => {
    btn.hidden = true;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  };
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js');
}

// Router
const views = {
  home: document.getElementById('view-home'),
  coords: document.getElementById('view-coords'),
  procs: document.getElementById('view-procs'),
  form: document.getElementById('view-form'),
  saved: document.getElementById('view-saved'),
};

function show(el) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

Array.from(document.querySelectorAll('[data-back]'))
  .forEach(b => b.addEventListener('click', () => show(views.home)));

// Menu actions
qs('#menu-osmand').addEventListener('click', openOsmAnd);
qs('#menu-coords').addEventListener('click', () => show(views.coords));
qs('#menu-procs').addEventListener('click', () => { listProcedures(); show(views.procs); });
qs('#menu-form').addEventListener('click', () => { resetFormUI(); show(views.form); });
qs('#menu-view').addEventListener('click', () => { renderSaved(); show(views.saved); });

// About
qs('#btn-about').addEventListener('click', () => qs('#dlg-about').showModal());
qs('#btn-close-about').addEventListener('click', () => qs('#dlg-about').close());

// Utils
function qs(sel, el=document){ return el.querySelector(sel); }
function qsa(sel, el=document){ return Array.from(el.querySelectorAll(sel)); }
function dms(val, type='lat'){
  const hemi = (type==='lat') ? (val>=0?'N':'S') : (val>=0?'E':'W');
  const abs = Math.abs(val);
  const d = Math.floor(abs);
  const mFloat = (abs - d) * 60;
  const m = Math.floor(mFloat);
  const s = ((mFloat - m) * 60).toFixed(2);
  return `${d}° ${m}' ${s}" ${hemi}`;
}

// Geolocation helper
async function getCurrentPositionOnce(timeoutMs=8000){
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      pos => resolve(pos.coords),
      _err => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 10000 }
    );
  });
}


// 1) Abrir OsmAnd normal con Intent explícito
async function openOsmAnd() {
  const coords = await getCurrentPositionOnce(5000);
  const lat = coords?.latitude ?? 43.36;
  const lon = coords?.longitude ?? -5.84;

  // Intent explícito para OsmAnd normal (no plus)
  const intentUri = `intent://show_map?lat=${lat}&lon=${lon}&z=16#Intent;action=android.intent.action.VIEW;package=net.osmand;component=net.osmand/.activities.MapActivity;end`;

  // Fallbacks
  const osmandUri = `osmand://show_map?lat=${lat}&lon=${lon}&z=16`;
  const geoUri = `geo:${lat},${lon}?q=${lat},${lon}(Ubicación)`;

  try {
    window.location.href = intentUri;
    // Si falla, probar con esquema osmand:// y geo:
    setTimeout(() => { window.location.href = osmandUri; }, 800);
    setTimeout(() => { window.location.href = geoUri; }, 1600);
  } catch (err) {
    alert("No se pudo abrir OsmAnd. Asegúrate de tener la app instalada.");
  }
}


// 2) Registrar coordenadas
qs('#btn-getloc').addEventListener('click', async ()=>{
  qs('#lat-dec').value = '';
  qs('#lon-dec').value = '';
  qs('#lat-dms').value = '';
  qs('#lon-dms').value = '';
  const coords = await getCurrentPositionOnce(10000);
  if(!coords){ alert('No se pudo obtener la ubicación. Revisa permisos o GPS.'); return; }
  const { latitude: lat, longitude: lon } = coords;
  qs('#lat-dec').value = lat.toFixed(6);
  qs('#lon-dec').value = lon.toFixed(6);
  qs('#lat-dms').value = dms(lat, 'lat');
  qs('#lon-dms').value = dms(lon, 'lon');
});

qs('#btn-save-coords').addEventListener('click', async ()=>{
  const name = qs('#inc-name').value.trim();
  const latd = qs('#lat-dec').value.trim();
  const lond = qs('#lon-dec').value.trim();
  const latm = qs('#lat-dms').value.trim();
  const lonm = qs('#lon-dms').value.trim();
  if(!latd || !lond){ alert('Primero obtén la ubicación.'); return; }
  const rec = { id: crypto.randomUUID(), ts: new Date().toISOString(), name, latd, lond, latm, lonm };
  await db.coords.add(rec.id, rec);

  // Future: Google Sheets webhook (Apps Script) paste URL below
  // const SHEETS_WEB_APP_URL = "";
  // if (SHEETS_WEB_APP_URL) fetch(SHEETS_WEB_APP_URL, { method:'POST', body: JSON.stringify(rec) });

  alert('Coordenadas guardadas en el dispositivo.');
  qs('#inc-name').value = '';
});

// 3) Procedimientos
async function listProcedures(){
  const ul = qs('#proc-ul');
  ul.innerHTML = '';
  try{
    const res = await fetch('./procedimientos/index.json', { cache: 'no-cache' });
    if(res.ok){
      const files = await res.json();
      if(Array.isArray(files) && files.length){
        files.forEach(f=>{
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `./procedimientos/${encodeURIComponent(f)}`;
          a.textContent = f;
          a.target = '_blank';
          li.appendChild(a);
          ul.appendChild(li);
        });
        return;
      }
      ul.innerHTML = '<li class="muted">(index.json está vacío)</li>';
    } else {
      ul.innerHTML = '<li class="muted">(Crea procedimientos/index.json)</li>';
    }
  }catch{
    ul.innerHTML = '<li class="muted">(No se pudo leer procedimientos/index.json)</li>';
  }
}

// 4) Toma de datos (form local + fotos)
const entriesEl = qs('#entries');
qs('#btn-add-entry').addEventListener('click', ()=> addEntry());
qs('#btn-clear-form').addEventListener('click', ()=> resetFormUI());
qs('#btn-save-form').addEventListener('click', async ()=>{
  const entries = collectEntries();
  if(!entries.length){ alert('Añade al menos una entrada.'); return; }
  const photos = await collectPhotos();
  const rec = { id: crypto.randomUUID(), ts: new Date().toISOString(), entries, photos };
  await db.forms.add(rec.id, rec);
  alert('Registro guardado localmente.');
  resetFormUI();
});

function entryTemplate(){
  const wrap = document.createElement('div');
  wrap.className = 'card soft';
  wrap.innerHTML = `
    <div class="grid-2">
      <div>
        <label>Nombre completo</label>
        <input type="text" class="in-nombre" placeholder="Nombre y apellidos" />
      </div>
      <div>
        <label>DNI</label>
        <input type="text" class="in-dni" placeholder="12345678A" />
      </div>
    </div>
    <div class="row">
      <label>Dirección</label>
      <input type="text" class="in-dir" placeholder="Calle, número, localidad" />
    </div>
    <div class="grid-2">
      <div>
        <label>Marca y modelo</label>
        <input type="text" class="in-modelo" placeholder="Ej. Toyota Hilux" />
      </div>
      <div>
        <label>Matrícula</label>
        <input type="text" class="in-matricula" placeholder="0000-XXX" />
      </div>
    </div>
    <div class="row end">
      <button class="btn danger btn-del">Eliminar</button>
    </div>
  `;
  qs('.btn-del', wrap).addEventListener('click', ()=> wrap.remove());
  return wrap;
}

function addEntry(){ entriesEl.appendChild(entryTemplate()); }
function resetFormUI(){ entriesEl.innerHTML=''; qs('#photo-input').value=''; qs('#photo-preview').innerHTML=''; addEntry(); }
function collectEntries(){
  return qsa(':scope > .card.soft', entriesEl).map(w=>({
    nombre: qs('.in-nombre', w).value.trim(),
    dni: qs('.in-dni', w).value.trim(),
    direccion: qs('.in-dir', w).value.trim(),
    modelo: qs('.in-modelo', w).value.trim(),
    matricula: qs('.in-matricula', w).value.trim(),
  })).filter(e => e.nombre || e.dni || e.direccion || e.modelo || e.matricula);
}

async function collectPhotos(){
  const files = qs('#photo-input').files;
  const urls = [];
  for (const f of files){
    const b64 = await fileToDataURL(f);
    urls.push({ name: f.name, type: f.type, dataURL: b64 });
  }
  return urls;
}

function fileToDataURL(file){
  return new Promise((resolve, reject)=>{
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

// Photo preview
qs('#photo-input').addEventListener('change', async (e)=>{
  const prev = qs('#photo-preview');
  prev.innerHTML = '';
  const files = e.target.files;
  for (const f of files){
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.src = url; img.alt = f.name;
    prev.appendChild(img);
  }
});

// 5) Ver datos guardados (sólo registros de opción 4)
qs('#btn-export-json').addEventListener('click', async ()=>{
  const items = await db.forms.getAll();
  const blob = new Blob([JSON.stringify(items, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sepa-registros.json';
  a.click();
});
qs('#btn-clear-all').addEventListener('click', async ()=>{
  if(!confirm('¿Borrar todos los registros de la opción 4?')) return;
  await db.forms.clear();
  renderSaved();
});

async function renderSaved(){
  const list = qs('#saved-list');
  list.innerHTML = '';
  const items = await db.forms.getAll();
  if(!items.length){
    list.innerHTML = '<div class="muted">No hay registros guardados.</div>';
    return;
  }
  items.sort((a,b)=> new Date(b.ts)-new Date(a.ts));
  for (const it of items){
    const div = document.createElement('div');
    div.className = 'item';
    const count = it.entries?.length || 0;
    div.innerHTML = `
      <h4>Registro ${it.id.slice(0,8)}</h4>
      <div class="meta">Fecha: ${new Date(it.ts).toLocaleString()}</div>
      <div>${count} entr${count===1?'ada':'adas'} · ${it.photos?.length||0} foto(s)</div>
      <details style="margin-top:6px">
        <summary>Ver detalles</summary>
        <pre style="white-space:pre-wrap;font-size:12px">${escapeHtml(JSON.stringify(it, null, 2))}</pre>
      </details>
      <div class="row end" style="margin-top:6px">
        <button class="btn danger btn-del-one">Eliminar</button>
      </div>
    `;
    qs('.btn-del-one', div).addEventListener('click', async ()=>{
      await db.forms.delete(it.id);
      renderSaved();
    });
    list.appendChild(div);
  }
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// ===== IndexedDB tiny wrapper =====
const db = (function(){
  const DB_NAME = 'sepa-webapp';
  const DB_VER = 1;
  let p;
  function open(){
    if (p) return p;
    p = new Promise((resolve, reject)=>{
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = (e)=>{
        const d = req.result;
        if (!d.objectStoreNames.contains('coords')) d.createObjectStore('coords');
        if (!d.objectStoreNames.contains('forms'))  d.createObjectStore('forms');
      };
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    });
    return p;
  }
  async function put(store, key, value){
    const d = await open();
    return new Promise((resolve, reject)=>{
      const tx = d.transaction(store, 'readwrite');
      tx.objectStore(store).put(value, key);
      tx.oncomplete = ()=> resolve(true);
      tx.onerror = ()=> reject(tx.error);
    });
  }
  async function add(store, key, value){ return put(store, key, value); }
  async function getAll(store){
    const d = await open();
    return new Promise((resolve, reject)=>{
      const tx = d.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = ()=> resolve(req.result || []);
      req.onerror = ()=> reject(req.error);
    });
  }
  async function del(store, key){
    const d = await open();
    return new Promise((resolve, reject)=>{
      const tx = d.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = ()=> resolve(true);
      tx.onerror = ()=> reject(tx.error);
    });
  }
  async function clear(store){
    const d = await open();
    return new Promise((resolve, reject)=>{
      const tx = d.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = ()=> resolve(true);
      tx.onerror = ()=> reject(tx.error);
    });
  }
  return {
    coords: { add: (k,v)=>add('coords',k,v), getAll: ()=>getAll('coords'), clear: ()=>clear('coords'), delete:(k)=>del('coords',k) },
    forms:  { add: (k,v)=>add('forms',k,v),  getAll: ()=>getAll('forms'),  clear: ()=>clear('forms'),  delete:(k)=>del('forms',k) },
  };
})();

// Initial state
resetFormUI();

export {};
