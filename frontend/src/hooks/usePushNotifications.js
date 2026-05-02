import { useState, useEffect, useCallback } from 'react';
import { 
  isPushSupported, 
  requestNotificationPermission, 
  subscribeToPush,
  unsubscribeFromPush,
} from '../utils/pushNotifications.js';
import { useUiStore } from '../stores/uiStore.js';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useUiStore();

  useEffect(() => {
    setIsSupported(isPushSupported());
    
    // Verificar si ya está suscrito
    if (isPushSupported()) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setIsSubscribed(!!subscription);
        });
      });
    }
  }, []);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      await subscribeToPush();
      setIsSubscribed(true);
      addToast({
        type: 'success',
        title: 'Notificaciones activadas',
        message: 'Recibirás alertas ambientales importantes',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'No se pudieron activar las notificaciones',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromPush();
      setIsSubscribed(false);
      addToast({
        type: 'info',
        title: 'Notificaciones desactivadas',
        message: 'Ya no recibirás alertas push',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron desactivar las notificaciones',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  };
};