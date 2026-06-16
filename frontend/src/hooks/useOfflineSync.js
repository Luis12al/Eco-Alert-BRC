import { useEffect, useCallback } from 'react';
import { useOnlineStatus } from './useOnlineStatus.js';
import { useUiStore } from '../stores/uiStore.js';

/**
 * Hook para manejar sincronización offline de reportes
 */
export const useOfflineSync = () => {
  const isOnline = useOnlineStatus();
  const { addToast } = useUiStore();

  const saveReportOffline = useCallback(async (reportData) => {
    // Guardar en IndexedDB
    const db = await openIndexedDB();
    const tx = db.transaction('pending-reports', 'readwrite');
    const store = tx.objectStore('pending-reports');
    await store.add({
      ...reportData,
      createdAt: new Date().toISOString(),
    });
    
    // Registrar para sync en background
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-reports');
    
    addToast({
      type: 'warning',
      title: 'Sin conexión',
      message: 'Tu reporte se guardará cuando recuperes la conexión',
    });
  }, [addToast]);

  useEffect(() => {
    if (isOnline) {
      // Intentar sincronizar reportes pendientes
      navigator.serviceWorker.ready.then((registration) => {
        registration.sync.register('sync-reports').catch(() => {
          // Fallback: sincronizar manualmente
          syncPendingReports();
        });
      });
      
      addToast({
        type: 'success',
        title: 'Conexión restaurada',
        message: 'Sincronizando reportes pendientes...',
      });
    }
  }, [isOnline, addToast]);

  return { saveReportOffline };
};

async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('eco-alert-db', 1);
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

async function syncPendingReports() {
  // Implementación de sincronización manual
  console.log('Syncing pending reports...');
}