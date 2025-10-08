// Minimal IndexedDB wrapper for local records (Option 5 & 6) + GPS saves (Option 3 local)
const DB_NAME = 'sepa_webapp_db';
const DB_VERSION = 1;
const STORE_RECORDS = 'records'; // for Option 5
const STORE_GPS = 'gps';         // for Option 3

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_RECORDS)) {
        const store = db.createObjectStore(STORE_RECORDS, { keyPath: 'id', autoIncrement: true });
        store.createIndex('by_date', 'createdAt');
      }
      if (!db.objectStoreNames.contains(STORE_GPS)) {
        const store2 = db.createObjectStore(STORE_GPS, { keyPath: 'id', autoIncrement: true });
        store2.createIndex('by_date', 'createdAt');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function addRecord(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_RECORDS, 'readwrite');
    tx.objectStore(STORE_RECORDS).add(data);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllRecords() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_RECORDS, 'readonly');
    const req = tx.objectStore(STORE_RECORDS).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function addGPS(data) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_GPS, 'readwrite');
    tx.objectStore(STORE_GPS).add(data);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllGPS() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_GPS, 'readonly');
    const req = tx.objectStore(STORE_GPS).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

window.SepaDB = { addRecord, getAllRecords, addGPS, getAllGPS };