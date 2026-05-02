import React from 'react';
import { X, MapPin, Clock, User, AlertTriangle } from 'lucide-react';
import Modal from '../../../components/ui/Modal.jsx';
import Badge from '../../../components/ui/Badge.jsx';
import { ALERT_LEVELS, REPORT_CATEGORIES } from '../../../utils/constants.js';
import { formatDate, formatCoordinates } from '../../../utils/formatters.js';

const ReportDetail = ({ report, isOpen, onClose }) => {
  if (!report) return null;

  const alertLevel = ALERT_LEVELS.find(l => l.value === report.alert_level);
  const category = REPORT_CATEGORIES.find(c => c.value === report.category);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Detalle del Reporte">
      <div className="space-y-4">
        {/* Imagen */}
        {report.image_url && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={report.image_url} 
              alt="Reporte" 
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={
              report.alert_level === 'rojo' ? 'danger' :
              report.alert_level === 'amarillo' ? 'warning' : 'success'
            }
            className="text-sm"
          >
            {alertLevel?.icon} {alertLevel?.label}
          </Badge>
          <Badge variant="primary" className="text-sm">
            {category?.label || report.category}
          </Badge>
          <Badge variant="default" className="text-sm">
            {report.status === 'pending' ? '⏳ Pendiente' :
             report.status === 'approved' ? '✅ Aprobado' : '❌ Rechazado'}
          </Badge>
        </div>

        {/* Descripción */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Descripción</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{report.description}</p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{formatCoordinates(report.latitude || report.lat, report.longitude || report.lng)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDate(report.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{report.reporter_name || 'Anónimo'}</span>
          </div>
          {report.distance_km && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <AlertTriangle className="h-4 w-4" />
              <span>A {report.distance_km} km de tu ubicación</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReportDetail;