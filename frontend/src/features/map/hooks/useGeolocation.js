import { useState, useEffect, useCallback } from 'react';
import { getCurrentPosition, watchPosition } from '../../../utils/geolocation.js';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await getCurrentPosition(options);
      const loc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      setLocation(loc);
      return loc;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, error, loading, refresh: getLocation };
};