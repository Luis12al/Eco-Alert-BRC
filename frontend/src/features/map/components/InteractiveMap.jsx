import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BARRANCABERMEJA_CENTER } from '../../../utils/constants.js';
import ReportMarker from './ReportMarker.jsx';
import MapLegend from './MapLegend.jsx';
import { useNearbyReports } from '../../reports/hooks/useReports.js';
import { useReportStore } from '../../../stores/reportStore.js';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ============================================
// COMPONENTES INTERNOS (dentro de MapContainer)
// ============================================

// Componente para actualizar el centro del mapa
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Componente para manejar eventos del mapa
const MapEventHandler = ({ onBoundsChange }) => {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      onBoundsChange?.({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
        center: map.getCenter(),
        zoom: map.getZoom(),
      });
    },
  });
  return null;
};

// Controles del mapa (DEBE estar dentro de MapContainer)
const MapControlsInner = ({ onLocate }) => {
  const map = useMap();
  
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={onLocate}
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        title="Mi ubicación"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>
      </button>
      
      <button
        onClick={() => map.zoomIn()}
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        title="Acercar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      
      <button
        onClick={() => map.zoomOut()}
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        title="Alejar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  );
};

// Filtros del mapa (pueden estar fuera, no usan hooks de Leaflet)
const MapFiltersOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeFilters, setActiveFilters, clearFilters } = useReportStore();

  const REPORT_CATEGORIES = [
    { value: 'agua', label: '💧 Agua' },
    { value: 'aire', label: '🌬️ Aire' },
    { value: 'olor', label: '👃 Olor' },
    { value: 'residuos', label: '🗑️ Residuos' },
    { value: 'ruido', label: '🔊 Ruido' },
    { value: 'otro', label: '📋 Otro' },
  ];

  const ALERT_LEVELS = [
    { value: 'verde', label: 'Normal', color: '#22c55e' },
    { value: 'amarillo', label: 'Sospechoso', color: '#eab308' },
    { value: 'rojo', label: 'Alerta', color: '#ef4444' },
  ];

  const hasActiveFilters = activeFilters.category || activeFilters.alertLevel;

  return (
    <div className="absolute left-4 top-4 z-[1000]">
      <button
        className={`px-3 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm font-medium transition-colors ${
          hasActiveFilters 
            ? 'bg-primary-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Filtros
        {hasActiveFilters && (
          <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
            {[activeFilters.category, activeFilters.alertLevel].filter(Boolean).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-100 w-64">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Filtrar reportes</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Categoría</label>
              <select
                value={activeFilters.category || ''}
                onChange={(e) => setActiveFilters({ category: e.target.value || null })}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todas las categorías</option>
                {REPORT_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Nivel de alerta</label>
              <div className="flex gap-2">
                {ALERT_LEVELS.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setActiveFilters({ 
                      alertLevel: activeFilters.alertLevel === level.value ? null : level.value 
                    })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeFilters.alertLevel === level.value
                        ? 'ring-2 ring-offset-1'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activeFilters.alertLevel === level.value ? level.color + '20' : '#f3f4f6',
                      color: level.color,
                      ringColor: level.color,
                    }}
                  >
                    {level.value === 'verde' ? '🟢' : level.value === 'amarillo' ? '🟡' : '🔴'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const InteractiveMap = ({ 
  reports = [], 
  selectedReportId, 
  onMarkerClick,
  showUserLocation = true,
  height = '600px',
}) => {
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(BARRANCABERMEJA_CENTER);

  // Obtener ubicación del usuario
  useEffect(() => {
    if (!showUserLocation) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (error) => {
          console.warn('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [showUserLocation]);

  const handleBoundsChange = (bounds) => {
    // Aquí se puede implementar carga dinámica de reportes según bounds
  };

  const handleLocate = () => {
    if (userLocation) {
      setMapCenter({ ...userLocation });
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Componentes que usan hooks de Leaflet DEBEN estar aquí dentro */}
        <MapUpdater center={mapCenter} />
        <MapEventHandler onBoundsChange={handleBoundsChange} />
        <MapControlsInner onLocate={handleLocate} />
        
        {/* Marcador de ubicación del usuario */}
        {userLocation && (
          <ReportMarker
            position={[userLocation.lat, userLocation.lng]}
            type="user"
            popupContent="Tu ubicación"
          />
        )}

        {/* Marcadores de reportes */}
        {reports.map((report) => (
          <ReportMarker
            key={report.id}
            position={[
              report.latitude || report.lat,
              report.longitude || report.lng
            ]}
            report={report}
            isSelected={selectedReportId === report.id}
            onClick={() => onMarkerClick?.(report)}
          />
        ))}
      </MapContainer>

      {/* ESTOS componentes NO usan hooks de Leaflet, pueden estar fuera */}
      <MapFiltersOverlay />
      <MapLegend />
    </div>
  );
};

export default InteractiveMap;