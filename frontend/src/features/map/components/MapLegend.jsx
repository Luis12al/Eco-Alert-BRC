import React from 'react';
import { ALERT_LEVELS } from '../../../utils/constants.js';

const MapLegend = () => {
  return (
    <div className="absolute left-4 bottom-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-3">
      <h4 className="text-xs font-semibold text-gray-700 mb-2">Leyenda</h4>
      <div className="space-y-1.5">
        {ALERT_LEVELS.map(level => (
          <div key={level.value} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-xs text-gray-600">{level.label}</span>
          </div>
        ))}
        <div className="border-t border-gray-200 my-1.5 pt-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white" />
            <span className="text-xs text-gray-600">Tu ubicación</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;