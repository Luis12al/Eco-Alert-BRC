import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ALERT_LEVELS } from '../../../utils/constants.js';
import { formatRelativeDate } from '../../../utils/formatters.js';

// Crear iconos personalizados para cada nivel de alerta
const createAlertIcon = (color, isSelected = false) => {
  const size = isSelected ? 32 : 24;
  const borderWidth = isSelected ? 3 : 2;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: ${borderWidth}px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        ${isSelected ? 'transform: scale(1.2);' : ''}
      ">
        <div style="
          width: ${size * 0.4}px;
          height: ${size * 0.4}px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const userIcon = L.divIcon({
  className: 'user-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background-color: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const ReportMarker = ({ position, report, type = 'report', isSelected, onClick, popupContent }) => {
  if (type === 'user') {
    return (
      <Marker position={position} icon={userIcon}>
        <Popup>{popupContent}</Popup>
      </Marker>
    );
  }

  const alertLevel = ALERT_LEVELS.find(l => l.value === report.alert_level);
  const icon = createAlertIcon(alertLevel?.color || '#6b7280', isSelected);

  return (
    <Marker 
      position={position} 
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{alertLevel?.icon}</span>
            <span className="font-semibold text-sm">{alertLevel?.label}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2 line-clamp-3">
            {report.description}
          </p>
          <div className="text-xs text-gray-400 space-y-1">
            <p>{formatRelativeDate(report.created_at)}</p>
            <p>Por: {report.reporter_name || 'Anónimo'}</p>
            {report.distance_km && <p>A {report.distance_km} km</p>}
          </div>
          {report.image_url && (
            <img 
              src={report.image_url} 
              alt="Reporte" 
              className="mt-2 w-full h-24 object-cover rounded-lg"
            />
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default ReportMarker;