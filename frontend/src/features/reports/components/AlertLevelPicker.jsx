import React from 'react';
import { ALERT_LEVELS } from '../../../utils/constants.js';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AlertLevelPicker = ({ value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Nivel de alerta
      </label>
      <div className="grid grid-cols-3 gap-3">
        {ALERT_LEVELS.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              value === level.value
                ? 'border-current shadow-md scale-105'
                : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
            )}
            style={{
              borderColor: value === level.value ? level.color : undefined,
              color: value === level.value ? level.color : undefined,
            }}
          >
            <span className="text-3xl">{level.icon}</span>
            <span className="text-sm font-semibold">{level.label}</span>
            {value === level.value && (
              <div 
                className="absolute inset-0 rounded-xl opacity-10"
                style={{ backgroundColor: level.color }}
              />
            )}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default AlertLevelPicker;