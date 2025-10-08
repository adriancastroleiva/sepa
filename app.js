// PWA install prompt
let deferredPrompt;
const btnInstall = document.getElementById('btn-install');
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  btnInstall.hidden = false;
});
btnInstall?.addEventListener('click', async ()=>{
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  btnInstall.hidden = true;
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js');
  });
}

const cfg = window.SEPA_CONFIG || {};
const qs = (sel)=>document.querySelector(sel);
const views = ['menu','coord','proced','parte'];

function show(id){
  views.forEach(v=>qs('#view-'+v)?.classList.remove('active'));
  qs('#view-'+id)?.classList.add('active');
}
document.querySelectorAll('[data-home]').forEach(b=>b.addEventListener('click',()=>show('menu')));
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>show('menu')));

document.querySelectorAll('.card').forEach(b=>{
  b.addEventListener('click', ()=>{
    const target = b.getAttribute('data-target');
    if (target==='coord') show('coord');
    if (target==='proced') { renderProcedimientos(); show('proced'); }
    if (target==='parte') { initParteDefaults(); show('parte'); }
  });
});

// ---- OsmAnd+ desde menú: href intent:// pre-generado ----
function setOsmAndHref() {
  const a = document.getElementById('menu-open-osmand');
  if (!a) return;
  const lat = cfg.latDefault ?? 43.36;
  const lon = cfg.lonDefault ?? -5.85;
  const pkg = (cfg.osmandPackage || 'net.osmand.plus').trim();
  const intentGeo = `intent://0,0?q=${lat},${lon}#Intent;scheme=geo;package=${pkg};end;`;
  a.setAttribute('href', intentGeo);
  a.setAttribute('data-fallback', `geo:${lat},${lon}?z=16`);
}
document.addEventListener('DOMContentLoaded', setOsmAndHref);

document.getElementById('menu-open-osmand')?.addEventListener('click', (e) => {
  setTimeout(() => {
    if (document.visibilityState === 'visible') {
      const geo = e.currentTarget.getAttribute('data-fallback') || '';
      if (geo) window.location.href = geo;
    }
  }, 700);
});

// Connection + pending queue status
const statusConn = qs('#status-conn');
const pendingCount = qs('#pending-count');
function updateConn(){
  if (!statusConn) return;
  statusConn.textContent = navigator.onLine ? '● Online' : '● Offline';
  statusConn.style.color = navigator.onLine ? '#22c55e' : '#f59e0b';
}
window.addEventListener('online', ()=>{ updateConn(); trySync(); });
window.addEventListener('offline', updateConn);
updateConn();

const qMarksKey = 'sepa_pending_marks';
const qPartsKey = 'sepa_pending_parts';
const getQueue = (k)=>JSON.parse(localStorage.getItem(k)||'[]');
const setQueue = (k,arr)=>localStorage.setItem(k, JSON.stringify(arr));
function refreshPending(){
  if (!pendingCount) return;
  const total = getQueue(qMarksKey).length + getQueue(qPartsKey).length;
  pendingCount.textContent = total;
}
refreshPending();

// ---- COORDENADAS ----
const gpsInfo = qs('#gps-info');
const incInput = qs('#incidente-id');
const notasInput = qs('#notas');

qs('#btn-capturar')?.addEventListener('click', async ()=>{
  if (gpsInfo) gpsInfo.textContent = 'Obteniendo GPS...';
  try{
    const pos = await getPosition({ enableHighAccuracy: true, timeout: 15000 });
    const payload = {
      type: 'marca',
      Timestamp: new Date().toISOString(),
      Parque: cfg.parque || '',
      IncidenteID: incInput?.value || '',
      Coordenadas: `${pos.coords.latitude},${pos.coords.longitude}`,
      PrecisionM: pos.coords.accuracy ?? null,
      DispositivoID: cfg.dispositivoId || '',
      Notas: (notasInput?.value||'').slice(0,1024)
    };
    if (gpsInfo) gpsInfo.textContent = `GPS OK: ${payload.Coordenadas} (±${Math.round(payload.PrecisionM||0)}m)`;
    await enqueueAndSend(qMarksKey, payload);
    if (incInput) incInput.value=''; 
    if (notasInput) notasInput.value='';
    alert('Coordenadas guardadas');
  }catch(e){
    console.error(e);
    if (gpsInfo) gpsInfo.textContent = 'Error GPS o permisos denegados';
    alert('No se pudo capturar la ubicación. Revisa permisos de localización.');
  }
});

function getPosition(opts){
  return new Promise((res,rej)=>navigator.geolocation.getCurrentPosition(res, rej, opts));
}

async function enqueueAndSend(key, payload){
  const q = getQueue(key); q.push(payload); setQueue(key, q); refreshPending();
  await trySync();
}

qs('#btn-sync')?.addEventListener('click', trySync);

async function trySync(){
  const url = (cfg.endpointURL||'').trim();
  if (!url){ refreshPending(); return; }
  if (!navigator.onLine){ refreshPending(); return; }
  let marks = getQueue(qMarksKey);
  if (marks.length){
    try{
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind:'marks', rows: marks })
      });
      if (resp.ok){
        marks = []; setQueue(qMarksKey, marks);
      }
    }catch(e){ console.error('sync marks', e); }
  }
  let parts = getQueue(qPartsKey);
  if (parts.length){
    try{
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind:'parts', rows: parts })
      });
      if (resp.ok){
        parts = []; setQueue(qPartsKey, parts);
      }
    }catch(e){ console.error('sync parts', e); }
  }
  refreshPending();
}

// ---- PROCEDIMIENTOS ----
function renderProcedimientos(){
  const cont = qs('#procedimientos-list');
  if (!cont) return;
  cont.innerHTML = '';
  (cfg.procedimientos||[]).forEach(p=>{
    const a = document.createElement('a');
    a.href = p.url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = p.titulo;
    cont.appendChild(a);
  });
}

// ---- PARTE ----
function initParteDefaults(){
  const el = document.getElementById('parte-parque');
  if (el) el.value = cfg.parque || '';
}

const parteForm = qs('#parte-form');
parteForm?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const fd = new FormData(parteForm);
  const payload = {
    type: 'parte',
    ParteID: 'P-' + Date.now(),
    Timestamp: new Date().toISOString(),
    Parque: (fd.get('Parque')||cfg.parque||'').toString(),
    IncidenteID: (fd.get('IncidenteID')||'').toString(),
    VehiculoMatricula: (fd.get('VehiculoMatricula')||'').toString(),
    ConductorNombre: (fd.get('ConductorNombre')||'').toString(),
    ConductorDNI: (fd.get('ConductorDNI')||'').toString(),
    Descripcion: (fd.get('Descripcion')||'').toString().slice(0,4000)
  };
  try{
    const pos = await getPosition({ enableHighAccuracy: false, timeout: 5000 });
    payload.Coordenadas = `${pos.coords.latitude},${pos.coords.longitude}`;
  }catch{ payload.Coordenadas = ''; }

  const file = fd.get('Foto');
  if (file && file.size){
    payload.FotoName = file.name;
    payload.FotoType = file.type;
    payload.FotoBase64 = await fileToBase64(file);
  }

  await enqueueAndSend(qPartsKey, payload);
  const st = document.getElementById('parte-status');
  if (st) st.textContent = 'Parte guardado en cola.';
  parteForm.reset();
  initParteDefaults();
  alert('Parte guardado');
});

function fileToBase64(file){
  return new Promise((res,rej)=>{
    const rdr = new FileReader();
    rdr.onload = ()=>res(rdr.result.split(',')[1]);
    rdr.onerror = rej;
    rdr.readAsDataURL(file);
  });
}
