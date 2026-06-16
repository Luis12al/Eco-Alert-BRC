import React from 'react';
import { MapPin, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { ALERT_LEVELS, REPORT_CATEGORIES } from '../../../utils/constants.js';
import { formatRelativeDate, formatCoordinates } from '../../../utils/formatters.js';

const ReportCard = ({ report, onClick }) => {
  const alertLevel = ALERT_LEVELS.find(l => l.value === report.alert_level);
  const category = REPORT_CATEGORIES.find(c => c.value === report.category);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={() => onClick?.(report)}
    >
      <div className="flex gap-4">
        {/* Imagen */}
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          {report.image_url ? (
            <img 
              src={report.image_url} 
              alt="Reporte" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {category?.label.split(' ')[0] || '📋'}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant={
                  report.alert_level === 'rojo' ? 'danger' :
                  report.alert_level === 'amarillo' ? 'warning' : 'success'
                }
              >
                {alertLevel?.icon} {alertLevel?.label}
              </Badge>
              <Badge variant="default">
                {category?.label.split(' ').slice(1).join(' ') || report.category}
              </Badge>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
            {report.description}
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatRelativeDate(report.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {report.reporter_name || 'Anónimo'}
            </span>
            {report.distance_km && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {report.distance_km} km
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReportCard;