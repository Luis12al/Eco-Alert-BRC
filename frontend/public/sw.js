/**
 * Service Worker para Eco-Alert BRC
 * Maneja cache, notificaciones push y sincronización en segundo plano
 */

const CACHE_NAME = 'eco-alert-brc-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Instalación: cachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación: limpiar caches antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: estrategia stale-while-revalidate para la API, cache-first para estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: Network First con fallback a cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Assets estáticos: Cache First
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request).then((fetchResponse) => {
          const clone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return fetchResponse;
        })
      );
    })
  );
});

// Notificaciones Push
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'Nueva alerta ambiental cerca de ti',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: data.tag || 'eco-alert',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Ver en mapa',
      },
      {
        action: 'close',
        title: 'Cerrar',
      },
    ],
    data: {
      url: data.url || '/mapa',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Eco-Alert BRC', options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const { action, data } = event.notification;

  if (action === 'close') return;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      const url = data?.url || '/mapa';
      
      // Si hay una ventana abierta, enfocarla
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      
      // Si no, abrir nueva ventana
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Sincronización en segundo plano (para reportes offline)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncPendingReports());
  }
});

async function syncPendingReports() {
  const db = await openDB('eco-alert-db', 1);
  const reports = await db.getAll('pending-reports');
  
  for (const report of reports) {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: report.formData,
      });
      
      if (response.ok) {
        await db.delete('pending-reports', report.id);
      }
    } catch (error) {
      console.error('Error syncing report:', error);
    }
  }
}

// IndexedDB helper
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-reports')) {
        db.createObjectStore('pending-reports', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}