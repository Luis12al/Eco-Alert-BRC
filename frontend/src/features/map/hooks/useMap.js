import { useState, useCallback } from 'react';

export const useMapState = () => {
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(14);
  const [bounds, setBounds] = useState(null);

  const updateCenter = useCallback((newCenter) => {
    setCenter(newCenter);
  }, []);

  const updateZoom = useCallback((newZoom) => {
    setZoom(newZoom);
  }, []);

  const updateBounds = useCallback((newBounds) => {
    setBounds(newBounds);
  }, []);

  return {
    center,
    zoom,
    bounds,
    updateCenter,
    updateZoom,
    updateBounds,
  };
};