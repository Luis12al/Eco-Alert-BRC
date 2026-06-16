import React from 'react';
import { Search, MapPin, FileText } from 'lucide-react';
import Button from './Button.jsx';

const icons = {
  search: Search,
  location: MapPin,
  report: FileText,
};

const EmptyState = ({ 
  icon = 'search',
  title = 'No hay resultados',
  description = 'Intenta ajustar tus filtros o busca en otra área.',
  actionLabel,
  onAction,
}) => {
  const Icon = icons[icon] || Search;

  return (
    <div className="text-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;