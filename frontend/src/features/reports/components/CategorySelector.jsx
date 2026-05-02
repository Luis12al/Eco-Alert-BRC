import React from 'react';
import { REPORT_CATEGORIES } from '../../../utils/constants.js';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CategorySelector = ({ value, onChange, error }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Categoría del reporte
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {REPORT_CATEGORIES.map((category) => (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={cn(
              'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-200',
              value === category.value
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <span className="text-2xl">{category.label.split(' ')[0]}</span>
            <span className="text-xs font-medium">{category.label.split(' ').slice(1).join(' ')}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CategorySelector;