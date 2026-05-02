/**
 * Utilidades de geolocalización
 */
import { BARRANCABERMEJA_CENTER } from './constants.js';

export const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
      ...options,
    });
  });
};

export const watchPosition = (callback, options = {}) => {
  if (!navigator.geolocation) {
    console.warn('Geolocalización no soportada');
    return null;
  }
  
  return navigator.geolocation.watchPosition(callback, console.error, {
    enableHighAccuracy: true,
    timeout: 10000,
    ...options,
  });
};

export const getDistanceFromLatLng = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg) => deg * (Math.PI / 180);

export const getDefaultLocation = () => BARRANCABERMEJA_CENTER;